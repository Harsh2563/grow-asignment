import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle-new";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FinanceLogo } from "@/components/svgs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description: "A financial dashboard with dark mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-between items-center px-6 py-4 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                <FinanceLogo />
              </div>
              <h1 className={`text-lg font-bold`}>Finance Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" /> Add Widget
              </Button>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
