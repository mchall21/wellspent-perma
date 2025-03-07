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
  // Get session and user profile with error handling
  let session = null;
  let profile = null;
  
  try {
    session = await getSession();
    if (session) {
      try {
        profile = await getUserProfile();
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Continue without profile data
      }
    }
  } catch (sessionError) {
    console.error("Error fetching session:", sessionError);
    // Continue without session data
  }
  
  // Extract user information with fallbacks for everything
  const isAuthenticated = !!session;
  const userRole = profile?.role || session?.user?.user_metadata?.role || 'user';
  const userName = profile?.name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'Guest';
  const userEmail = profile?.email || session?.user?.email || '';

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
