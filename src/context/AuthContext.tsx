"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  requireAuth: (callback?: () => void, returnUrl?: string) => boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "tamaflix_registered_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("isLoggedIn") === "true";
      const storedEmail = localStorage.getItem("userEmail");
      const storedName = localStorage.getItem("userName");
      setIsLoggedIn(storedAuth);
      setUserEmail(storedEmail || (storedAuth ? "user@tamaflix.com" : null));
      setUserName(storedName || (storedAuth ? "TAMAFLIX Member" : null));
    } catch {
      // ignore SSR or storage access errors
    } finally {
      setIsReady(true);
    }
  }, []);

  const getStoredUsers = (): UserAccount[] => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const register = (
    name: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    try {
      const existingUsers = getStoredUsers();
      const existing = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in.",
        };
      }

      const newUser: UserAccount = {
        name: cleanName || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: password,
        createdAt: new Date().toISOString(),
      };

      const updatedList = [...existingUsers, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedList));

      // Auto sign in user upon successful registration
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", cleanEmail);
      localStorage.setItem("userName", newUser.name);

      setIsLoggedIn(true);
      setUserEmail(cleanEmail);
      setUserName(newUser.name);

      return { success: true };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, error: "Failed to save registration data to browser." };
    }
  };

  const login = (
    email: string,
    password?: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    try {
      const existingUsers = getStoredUsers();
      const matched = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (matched && password && matched.password && matched.password !== password) {
        return { success: false, error: "Incorrect password for this account." };
      }

      const displayName = matched?.name || cleanEmail.split("@")[0];

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", cleanEmail);
      localStorage.setItem("userName", displayName);

      setIsLoggedIn(true);
      setUserEmail(cleanEmail);
      setUserName(displayName);

      return { success: true };
    } catch (err) {
      console.error("Login storage error:", err);
      // Fallback
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", cleanEmail);
      setIsLoggedIn(true);
      setUserEmail(cleanEmail);
      return { success: true };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    } catch (err) {
      console.error("Failed to remove from localStorage:", err);
    }
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
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
        userName,
        login,
        register,
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
