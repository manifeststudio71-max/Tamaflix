"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  requireAuth: (callback?: () => void, returnUrl?: string) => boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("isLoggedIn") === "true";
      const storedEmail = localStorage.getItem("userEmail");
      setIsLoggedIn(storedAuth);
      setUserEmail(storedEmail || (storedAuth ? "user@tamaflix.com" : null));
    } catch {
      // ignore SSR or storage access errors
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = (email: string) => {
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
    }
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
    } catch (err) {
      console.error("Failed to remove from localStorage:", err);
    }
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  /**
   * CRITICAL REQUIREMENT:
   * "If user clicks Play/Buy/Rent and isLoggedIn is false in localStorage, redirect to /login"
   */
  const requireAuth = (callback?: () => void, returnUrl?: string): boolean => {
    let currentAuth = false;
    try {
      currentAuth = localStorage.getItem("isLoggedIn") === "true";
    } catch {
      currentAuth = false;
    }

    if (!currentAuth) {
      const target = returnUrl || (typeof window !== "undefined" ? window.location.pathname : "/");
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return false;
    }

    if (callback) {
      callback();
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        login,
        logout,
        requireAuth,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
