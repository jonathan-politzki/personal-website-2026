import type { Metadata } from "next";
import { Geist_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistMono = Geist_Mono({
  weight: ["400"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jonathan Politzki",
  description: "Founder & engineer. Ideas, innovation, and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${sourceSerif.variable} ${geistMono.variable} bg-paper text-ink font-serif`}
      >
        <header className="mx-auto flex w-full max-w-2xl items-baseline justify-between px-6 pb-6 pt-10">
          <Link href="/" className="text-lg font-medium tracking-tight">
            Jonathan Politzki
          </Link>
          <nav className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <Link href="/writing" className="transition-colors hover:text-ink">
              Writing
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
