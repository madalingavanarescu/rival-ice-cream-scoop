import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Bot, ArrowLeft } from "lucide-react";

// Switch between login and signup forms
const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If user is already logged in, redirect them away
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  // Handle sign up and login functions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      // Sign Up
      let { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/dashboard",
          data: { full_name: fullName }
        }
      });
      setLoading(false);
      if (error) {
        setError(error.message || "Signup failed. Please try again.");
      } else {
        toast.success("Confirmation email sent. Please check your inbox.");
      }
    } else {
      // Login
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message || "Login failed. Please check your credentials.");
      } else {
        toast.success("Logged in!");
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
                              <img src="/images/logo-contenda.svg" alt="Contenda" className="h-6 sm:h-8" />
            </Link>
            <Link 
              to="/" 
              className="flex items-center text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
              <Bot className="h-6 w-6 text-neutral-900" />
            </div>
            <h2 className="font-display text-3xl font-medium text-neutral-900">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {mode === "signup" 
                ? "Start analyzing your competitors with AI" 
                : "Sign in to your Contenda account"
              }
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md px-4">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleAuth} className="space-y-6">
                {mode === "signup" && (
                  <div>
                    <label 
                      htmlFor="fullName" 
                      className="block text-sm font-medium text-neutral-900 mb-2"
                    >
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      autoComplete="name"
                      className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
                    />
                  </div>
                )}
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-neutral-900 mb-2"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-neutral-900 mb-2"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3">
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-neutral-900 hover:bg-neutral-800 focus:ring-neutral-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {mode === "signup" ? "Creating account..." : "Signing in..."}
                    </>
                  ) : mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-neutral-500">
                      {mode === "signup" ? "Already have an account?" : "New to Contenda?"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                    className="text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
                  >
                    {mode === "signup" ? "Sign in to your account" : "Create a new account"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-neutral-700 hover:text-neutral-900 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-neutral-700 hover:text-neutral-900 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
