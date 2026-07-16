import type { Metadata } from "next";
import { Geist_Mono, Source_Serif_4 } from "next/font/google";
import Sidebar from "@/components/sidebar";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  weight: ["400"],
  variable: "--font-geist-mono",
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
      <body className={`${sourceSerif.variable} ${geistMono.variable} bg-paper font-serif text-ink`}>
        <Sidebar />
        <div className="md:pl-56">{children}</div>
      </body>
    </html>
  );
}
