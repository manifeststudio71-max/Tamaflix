import React from "react";
import Link from "next/link";
import { Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-zinc-900 text-zinc-500 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 text-zinc-400">
          <span className="font-semibold">Questions? Contact Support in Ghana:</span>
          <a href="tel:+233302000000" className="hover:underline text-zinc-300">
            +233 (0) 30 200 0000
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <ul className="space-y-2.5">
            <li><Link href="/" className="hover:underline">FAQ</Link></li>
            <li><Link href="/admin/movies" className="hover:underline">Admin Console</Link></li>
            <li><Link href="/" className="hover:underline">Ways to Watch</Link></li>
            <li><Link href="/" className="hover:underline">Corporate Information</Link></li>
          </ul>
          <ul className="space-y-2.5">
            <li><Link href="/" className="hover:underline">Help Center</Link></li>
            <li><Link href="/" className="hover:underline">Jobs & Careers</Link></li>
            <li><Link href="/" className="hover:underline">Terms of Use</Link></li>
            <li><Link href="/" className="hover:underline">Contact Us</Link></li>
          </ul>
          <ul className="space-y-2.5">
            <li><Link href="/login" className="hover:underline">Account Portal</Link></li>
            <li><Link href="/" className="hover:underline">Redeem Gift Cards</Link></li>
            <li><Link href="/" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:underline">Speed Test</Link></li>
          </ul>
          <ul className="space-y-2.5">
            <li><Link href="/" className="hover:underline">Media Center</Link></li>
            <li><Link href="/" className="hover:underline">Buy GH₵20 Movies</Link></li>
            <li><Link href="/" className="hover:underline">Rent GH₵10 Movies</Link></li>
            <li><Link href="/" className="hover:underline">Legal Notices</Link></li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-zinc-800/80 gap-4">
          <div className="inline-flex items-center space-x-2 border border-zinc-700 px-3 py-1.5 rounded text-zinc-300">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>English (Ghana)</span>
          </div>

          <div className="text-zinc-500 flex items-center space-x-1">
            <span>© {new Date().getFullYear()} TAMAFLIX Ghana, Inc. Built with Next.js 14 & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
