import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Focus Finder | Jackson State University",
  description:
    "Discover the best on-campus study spots with live busyness and noise cues plus student feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
