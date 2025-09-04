import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle-new";
import { FinanceLogo } from "@/components/icons/svgs";
import { NewWidgetDialog } from "@/components/widgets/new-widget-dialog";
import { Navbar } from "@/components/layout/navbar";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="flex h-16 items-center justify-between">
                    {/* Left side - Logo and Navigation */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Logo */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                          <FinanceLogo />
                        </div>
                        <h1 className="text-lg font-bold hidden sm:block">
                          Finance Dashboard
                        </h1>
                        <h1 className="text-base font-bold sm:hidden">
                          Finance
                        </h1>
                      </div>

                      {/* Navigation */}
                      <Navbar />
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="hidden sm:block">
                        <NewWidgetDialog />
                      </div>
                      <div className="sm:hidden">
                        <NewWidgetDialog />
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </header>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
