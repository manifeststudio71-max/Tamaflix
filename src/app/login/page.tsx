"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, Film } from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register, isLoggedIn } = useAuth();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectUrl);
    }
  }, [isLoggedIn, redirectUrl, router]);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!password || password.length < 4) {
        setError("Password must contain at least 4 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please verify.");
        return;
      }

      const result = register(name, email, password);
      if (!result.success) {
        setError(result.error || "Failed to create account.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } else {
      // Sign In mode
      if (!password || password.length < 4) {
        setError("Your password must contain at least 4 characters.");
        return;
      }

      const result = login(email, password);
      if (!result.success) {
        setError(result.error || "Failed to sign in.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    }
  };

  const handleQuickDemo = () => {
    login("demo@tamaflix.gh");
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Poster Collage Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.22]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-[#141414]/90" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md bg-black/85 backdrop-blur-xl border border-zinc-800 rounded-xl p-8 sm:p-10 shadow-2xl">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block text-2xl font-black text-red-600 font-netflix tracking-wider mb-2">
            TAMAFLIX
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === "signup" ? "Create an Account" : "Sign In"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === "signup"
              ? "Join TAMAFLIX today to stream, rent, and buy movies."
              : "Welcome back! Enter your details to continue."}
          </p>

          {redirectUrl !== "/" && (
            <p className="mt-3 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-2 rounded flex items-center gap-1.5 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please sign in or register to access playback and purchases.</span>
            </p>
          )}
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              mode === "signin"
                ? "bg-red-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-md transition-all ${
              mode === "signup"
                ? "bg-red-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/70 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{mode === "signup" ? "Account created successfully! Signing in..." : "Successfully signed in! Redirecting..."}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2b2b2b] border border-zinc-700/60 focus:border-red-600 focus:bg-[#383838] rounded text-white text-sm placeholder-zinc-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#2b2b2b] border border-zinc-700/60 focus:border-red-600 focus:bg-[#383838] rounded text-white text-sm placeholder-zinc-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-[#2b2b2b] border border-zinc-700/60 focus:border-red-600 focus:bg-[#383838] rounded text-white text-sm placeholder-zinc-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2b2b2b] border border-zinc-700/60 focus:border-red-600 focus:bg-[#383838] rounded text-white text-sm placeholder-zinc-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition-all duration-200 shadow-lg hover:shadow-red-600/40 active:scale-[0.99]"
          >
            {mode === "signup" ? "Create Free Account" : "Sign In to TAMAFLIX"}
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-black/90 px-3 text-[11px] text-zinc-500 uppercase tracking-wider">
              Or
            </span>
            <div className="border-t border-zinc-800 w-full" />
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-medium rounded text-xs transition-colors border border-zinc-700 flex items-center justify-center space-x-2"
          >
            <span>Instant Demo Account (One-Click)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-center text-zinc-400">
          {mode === "signup" ? (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className="text-white hover:underline font-semibold"
              >
                Sign In now
              </button>
            </p>
          ) : (
            <p>
              New to TAMAFLIX?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-white hover:underline font-semibold"
              >
                Register free account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
