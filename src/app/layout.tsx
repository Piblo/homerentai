import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Logger } from "@/components/Logger";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
      <body className={clsx(inter.className, "dark")}>
        <Logger>
          <Nav />
          {children}
          <SpeedInsights />
          <Analytics />
        </Logger>
      </body>
    </html>
  );
}
