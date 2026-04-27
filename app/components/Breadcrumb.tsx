import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
}

export default function Breadcrumb({ items, tone = "dark" }: BreadcrumbProps) {
  const color = tone === "light" ? "rgba(228,223,218,0.7)" : "#7a716a";
  const activeColor = tone === "light" ? "#E4DFDA" : "#4C4238";

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
      <ol style={{ display: "flex", gap: 8, alignItems: "center", listStyle: "none", flexWrap: "wrap" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color, fontSize: 12 }}>›</span>}
            {item.href ? (
              <Link
                href={item.href}
                style={{ fontSize: 12, color, textDecoration: "none", fontFamily: "var(--font-sans)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ fontSize: 12, color: activeColor, fontWeight: 500, fontFamily: "var(--font-sans)" }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
