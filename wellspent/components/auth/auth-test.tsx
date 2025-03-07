"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function AuthTest() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        setError(null);
        
        // Get session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(data.session);
        console.log("Session data:", data);
      } catch (err: any) {
        console.error("Auth check error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setTestResult("Sign out successful");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCookies = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      // Test if cookies are working
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        setTestResult("Cookies are working correctly. Session found.");
      } else {
        setTestResult("No session found in cookies.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setTestResult("Sign in successful!");
      
      // Use window.location for a hard redirect
      window.location.href = "/assessment";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSigningIn(false);
    }
  };

  const testRedirect = () => {
    // Use window.location for a hard redirect
    window.location.href = "/assessment";
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Authentication Test</h2>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {testResult && (
        <Alert className="bg-blue-50 border-blue-500 text-blue-700">
          <AlertDescription>{testResult}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <p>Authentication Status: {session ? "Authenticated" : "Not Authenticated"}</p>
        {session && (
          <div className="mt-2">
            <p>User ID: {session.user.id}</p>
            <p>Email: {session.user.email}</p>
          </div>
        )}
      </div>
      
      {!session && (
        <div className="space-y-4 border p-4 rounded">
          <h3 className="font-semibold">Test Sign In</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
            <Button 
              onClick={handleSignIn} 
              disabled={signingIn || !email || !password}
            >
              {signingIn ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-x-2">
        <Button onClick={testCookies} variant="outline" disabled={loading}>
          Test Cookies
        </Button>
        
        <Button onClick={testRedirect} variant="outline">
          Test Redirect
        </Button>
        
        {session && (
          <Button onClick={handleSignOut} variant="destructive" disabled={loading}>
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
} 