"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    // If already logged in, redirect away
    if (isLoggedIn) {
      router.push(redirectUrl);
    }
  }, [isLoggedIn, redirectUrl, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Your password must contain at least 4 characters.");
      return;
    }

    // Save to localStorage as isLoggedIn = "true" via AuthContext
    login(email);
    setSuccess(true);

    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    const demoEmail = "demo@tamaflix.gh";
    login(demoEmail);
    setSuccess(true);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 300);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      {/* Background with Netflix-style poster collage & overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.25]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-[#141414]/90" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-lg p-8 sm:p-10 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sign In</h1>
          {redirectUrl !== "/" && (
            <p className="mt-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-2 rounded flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please sign in to access playback or purchase options.</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/60 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Successfully signed in! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email or Ghana Phone
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#333333]/90 border border-transparent focus:border-red-600 focus:bg-[#454545] rounded text-white text-sm placeholder-zinc-400 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#333333]/90 border border-transparent focus:border-red-600 focus:bg-[#454545] rounded text-white text-sm placeholder-zinc-400 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition-all duration-200 shadow-lg hover:shadow-red-600/40 active:scale-[0.99]"
          >
            Sign In to TAMAFLIX
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-zinc-700 w-full" />
            <span className="bg-black/90 px-3 text-xs text-zinc-400 uppercase tracking-wider">
              Or
            </span>
            <div className="border-t border-zinc-700 w-full" />
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold rounded text-xs transition-colors border border-zinc-700 flex items-center justify-center space-x-2"
          >
            <span>One-Click Demo Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 text-xs text-zinc-400 space-y-4">
          <div className="flex items-center justify-between text-zinc-400">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span>Remember me</span>
            </label>
            <span className="hover:underline cursor-pointer">Need help?</span>
          </div>

          <p className="text-zinc-400 pt-2">
            New to TAMAFLIX?{" "}
            <button
              onClick={handleQuickDemoLogin}
              className="text-white hover:underline font-semibold"
            >
              Sign up now
            </button>
            .
          </p>

          <p className="text-[11px] text-zinc-500">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
          </p>
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
      <LoginForm />
    </Suspense>
  );
}
