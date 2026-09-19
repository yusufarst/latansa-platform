import type { Metadata } from "next";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { CompareProvider } from "@/components/compare-provider";

export const metadata: Metadata = {
  title: "LATANSA Platform | Perangkat Elektronik & Solusi IT Bisnis",
  description: "Platform pengadaan perangkat elektronik, perlengkapan IT, dan kebutuhan teknologi bisnis terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased font-sans text-foreground bg-background">
        <TooltipProvider>
          <CompareProvider>{children}</CompareProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
