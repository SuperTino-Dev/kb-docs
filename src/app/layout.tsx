import type { Metadata } from "next";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
 metadataBase: new URL("https://kb.tu24x7.com"),
  title: {
    default: "Technical Knowledge Base",
    template: "%s | Technical Knowledge Base",
  },
  description:
    "Independent technical knowledge base focused on enterprise technologies, databases, cloud, infrastructure, and security.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}