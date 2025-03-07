"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().optional(),
});

type AuthFormProps = {
  type: "signin" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        router.push("/assessment");
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        setIsAuthenticated(true);
        router.push("/assessment");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (type === "signup") {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name || "",
            },
          },
        });

        if (error) throw error;
        
        // Create user profile
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from('users')
            .insert({
              id: user.id,
              email: values.email,
              name: values.name || "",
              role: "individual",
              profile_info: {}
            });
        }
        
        setSuccess(true);
        // Force navigation after a short delay
        setTimeout(() => {
          window.location.href = "/assessment";
        }, 1000);
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;
        
        setSuccess(true);
        // Force navigation after a short delay
        setTimeout(() => {
          window.location.href = "/assessment";
        }, 1000);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  }

  // If already authenticated, redirect
  if (isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <AlertDescription>
            You are already signed in. Redirecting to assessment...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {type === "signin" ? "Sign In" : "Create an Account"}
        </h1>
        <p className="text-gray-500">
          {type === "signin"
            ? "Enter your credentials to sign in to your account"
            : "Enter your information to create an account"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <AlertDescription>
            {type === "signin" 
              ? "Sign in successful! Redirecting..." 
              : "Account created and signed in! Redirecting..."}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === "signup" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading
              ? "Loading..."
              : success
              ? "Redirecting..."
              : type === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 