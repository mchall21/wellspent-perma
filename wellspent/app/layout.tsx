import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AuthNav } from "@/components/auth/auth-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WellSpent",
  description: "Financial wellness assessment and resources",
};

// Explicitly force dynamic rendering - critical for preventing build errors
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll fetch the session client-side instead to avoid build-time cookie access
  // This prevents static generation errors with cookies
  const initialSession = null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialSession={initialSession}>
            <Header />
            <main>{children}</main>
            <Footer />
            <AuthNav />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
