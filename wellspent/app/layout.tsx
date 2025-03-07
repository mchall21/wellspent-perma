import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSession, getUserProfile } from "@/lib/auth";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AuthNav } from "@/components/auth/auth-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WellSpent",
  description: "Financial wellness assessment and resources",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session and user profile
  const session = await getSession();
  const profile = session ? await getUserProfile() : null;
  
  // Extract user information
  const isAuthenticated = !!session;
  const userRole = profile?.role || session?.user?.user_metadata?.role;
  const userName = profile?.name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0];
  const userEmail = profile?.email || session?.user?.email;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header 
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            userName={userName}
            userEmail={userEmail}
          />
          <main>{children}</main>
          <Footer />
          <AuthNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
