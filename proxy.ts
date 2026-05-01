import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Slug-naming gotcha: "Atlanta" center's canonical slug is lilburn-ga
  // (city-state, not name-state). Permanent-redirect external links using
  // the name-based form so they don't dead-end. Returns before the supabase
  // session refresh — redirects don't need an auth round-trip.
  if (
    pathname === "/centers/atlanta-ga" ||
    pathname.startsWith("/centers/atlanta-ga/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/centers/atlanta-ga", "/centers/lilburn-ga");
    return NextResponse.redirect(url, 301);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do NOT remove this, it's required by @supabase/ssr
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { search } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/portal") || pathname.startsWith("/admin");

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
