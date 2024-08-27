import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Rent AI",
  description: "Generate your property description with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={clsx(inter.className, "dark")}>{children}</body>
    </html>
  );
}
