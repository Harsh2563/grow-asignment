import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle-new";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FinanceLogo } from "@/components/svgs";
import { NewWidgetDialog } from "@/components/new-widget-dialog";
import { ReduxProvider } from "@/components/redux-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ReduxProvider>
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
                <NewWidgetDialog />
                <ThemeToggle />
              </div>
            </header>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
