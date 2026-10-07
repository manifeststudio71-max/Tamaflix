"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Search, Bell, User, LogOut, Film, Shield, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isLoggedIn, userEmail, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Trending", href: "/#trending" },
    { label: "Top 10 in Ghana", href: "/#top10" },
    { label: "Action", href: "/#action" },
    { label: "Comedy", href: "/#comedy" },
    { label: "Admin", href: "/admin/movies" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/5"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Main Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-red-600 transition-transform duration-300 group-hover:scale-105 font-netflix">
                TAMAFLIX
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`transition-colors duration-200 font-medium ${
                      isActive
                        ? "text-white font-bold"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/admin/movies"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
              title="Manage Movies"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Admin Portal</span>
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-red-600 flex items-center justify-center font-bold text-white text-sm ring-2 ring-transparent group-hover:ring-red-500 transition-all shadow-md">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-md bg-[#181818] border border-zinc-800 shadow-2xl py-2 z-50 text-sm"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-xs text-zinc-400">Signed in as</p>
                      <p className="text-white font-medium truncate">{userEmail}</p>
                    </div>
                    <Link
                      href="/admin/movies"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <Film className="w-4 h-4 mr-2.5 text-red-500" />
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out of TAMAFLIX
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-4 py-1.5 sm:px-5 sm:py-2 rounded transition-all duration-200 shadow-lg hover:shadow-red-600/30"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-300 hover:text-white p-1 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#181818]/95 backdrop-blur-md border-b border-zinc-800 px-4 pt-2 pb-5 space-y-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-zinc-300 hover:text-white font-medium py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
