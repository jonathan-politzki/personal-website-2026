import type { Metadata } from "next";
import { Geist, Geist_Mono, Ruslan_Display, Courier_Prime, Source_Serif_4 } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ruslan = Ruslan_Display({
  weight: "400",
  variable: "--font-calligraphy",
  subsets: ["latin", "cyrillic"],
});

const courier = Courier_Prime({
  weight: ["400", "700"],
  variable: "--font-courier",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jonathan Politzki",
  description: "Founder & Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          ${ruslan.variable} ${courier.variable} ${sourceSerif.variable}
          bg-[#050505] text-[#e5e5e5] overflow-x-hidden
        `}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
