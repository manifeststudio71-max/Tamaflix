import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { MovieProvider } from "../context/MovieContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "TAMAFLIX - Watch Movies Online in Ghana",
  description: "Unlimited Ghanaian and international blockbusters, series, and exclusives. Buy for GH₵20, Rent for GH₵10, or stream anytime on TAMAFLIX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#141414] text-white min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white">
        <AuthProvider>
          <MovieProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </MovieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
