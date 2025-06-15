
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-2">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === "signup" ? "Signing Up..." : "Signing In..."}
                </>
              ) : mode === "signup" ? "Sign Up" : "Sign In"}
            </Button>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </form>
          <div className="mt-4 text-center">
            {mode === "signup" ? (
              <span>
                Already have an account?{" "}
                <button className="text-blue-600 underline" type="button" onClick={() => setMode("login")}>
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New here?{" "}
                <button className="text-blue-600 underline" type="button" onClick={() => setMode("signup")}>
                  Create an Account
                </button>
              </span>
            )}
          </div>
          <div className="mt-2 text-center">
            <Link to="/" className="text-gray-500 text-sm hover:underline">← Back to Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
