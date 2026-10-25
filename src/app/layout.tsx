import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://balajitechlabs.com"),
  title: {
    default: "Balaji S. (||BTL||™) — Developer & Design Lab",
    template: "%s | Balaji S.",
  },
  description:
    "Official engineering lab, design system, and production showcase of Balaji S. (balajitechlabs). Ultra-fast software, high-throughput systems, and bespoke digital experiences.",
  authors: [{ name: "Balaji S.", url: "https://balajitechlabs.com" }],
  creator: "Balaji S. (||BTL||™)",
  publisher: "||BTL||™",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balajitechlabs.com",
    siteName: "balajitechlabs.com",
    title: "Balaji S. (||BTL||™) — Developer & Design Lab",
    description:
      "Official engineering lab, design system, and production showcase of Balaji S. (balajitechlabs).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balaji S. (||BTL||™) — Developer & Design Lab",
    description:
      "Official engineering lab, design system, and production showcase of Balaji S. (balajitechlabs).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono bg-black text-[#ededed] antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
