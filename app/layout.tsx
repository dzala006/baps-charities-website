import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import AxeProvider from "./components/AxeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baps-charities-website.vercel.app"),
  title: {
    default: "BAPS Charities — In the Spirit of Service",
    template: "%s — BAPS Charities",
  },
  description:
    "BAPS Charities is a global volunteer-driven nonprofit delivering health, education, environmental, and humanitarian programs across 12 countries.",
  openGraph: {
    siteName: "BAPS Charities",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BAPS Charities — In the Spirit of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bapscharities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body><AxeProvider>{children}</AxeProvider><CookieBanner /></body>
    </html>
  );
}
