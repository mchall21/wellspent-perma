"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function AuthDebug() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSessionData(session);
        
        // If we have a session, get the user profile
        if (session) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              setError(`Profile error: ${profileError.message}`);
            } else {
              setProfileData(profile);
            }
          } catch (profileErr: any) {
            console.error("Profile fetch error:", profileErr);
            setError(`Profile fetch error: ${profileErr.message}`);
          }
        }
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
        console.log("Auth state changed:", event);
        setSessionData(session);
        
        if (session) {
          // Update profile data when session changes
          const fetchProfile = async () => {
            try {
              const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single();
                
              if (error) {
                console.error("Profile update error:", error);
                setError(`Profile update error: ${error.message}`);
              } else {
                setProfileData(data);
              }
            } catch (err: any) {
              console.error("Profile update catch error:", err);
              setError(`Profile update catch error: ${err.message}`);
            }
          };
          
          fetchProfile();
        } else {
          setProfileData(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="text-sm p-2 bg-gray-100 rounded">Loading auth state...</div>;
  }

  return (
    <div className="text-sm p-2 bg-gray-100 rounded">
      <h3 className="font-bold">Client Auth Debug</h3>
      <div>Auth State: {sessionData ? "Authenticated" : "Not authenticated"}</div>
      {error && <div className="text-red-500">Error: {error}</div>}
      
      {sessionData && (
        <div>
          <div>User ID: {sessionData.user.id}</div>
          <div>Email: {sessionData.user.email}</div>
        </div>
      )}
      
      {profileData && (
        <div>
          <div>Profile Name: {profileData.name || "Not set"}</div>
          <div>Role: {profileData.role}</div>
        </div>
      )}
    </div>
  );
} 