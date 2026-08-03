import type { Metadata } from "next";
import Menu from "@/components/menu";
import "./globals.css";

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
    <html lang="en">
      <body>
        <Menu />
        <div id="left" />
        <div id="content">{children}</div>
      </body>
    </html>
  );
}
