"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  ShoppingBag,
  Clock,
  CheckCircle,
  Share2,
  ThumbsUp,
  ArrowLeft,
  Flame,
  Star,
  Check,
} from "lucide-react";
import { useMovies } from "../../../context/MovieContext";
import { useAuth } from "../../../context/AuthContext";
import MovieCard from "../../../components/MovieCard";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  const { movies, getMovieById, buyMovie, rentMovie, isPurchased, isRented } = useMovies();
  const { requireAuth, isLoggedIn } = useAuth();

  const [movie, setMovie] = useState(() => getMovieById(movieId));
  const [purchaseModal, setPurchaseModal] = useState<{
    type: "buy" | "rent";
    title: string;
    price: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const found = getMovieById(movieId);
    if (found) {
      setMovie(found);
    }
  }, [movieId, getMovieById, movies]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
        <p className="text-zinc-400 mb-6">
          The requested movie could not be located in the TAMAFLIX library.
        </p>
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded transition"
        >
          Return to Browse
        </Link>
      </div>
    );
  }

  /**
   * CRITICAL REQUIREMENT:
   * "If user clicks Play/Buy/Rent and isLoggedIn is false in localStorage, redirect to /login"
   */
  const handlePlayClick = () => {
    requireAuth(() => {
      router.push(`/watch/${movie.id}`);
    }, `/movies/${movie.id}`);
  };

  const handleBuyClick = () => {
    requireAuth(() => {
      buyMovie(movie.id);
      setPurchaseModal({
        type: "buy",
        title: movie.title,
        price: "GH₵20",
      });
    }, `/movies/${movie.id}`);
  };

  const handleRentClick = () => {
    requireAuth(() => {
      rentMovie(movie.id);
      setPurchaseModal({
        type: "rent",
        title: movie.title,
        price: "GH₵10",
      });
    }, `/movies/${movie.id}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const hasPurchased = isPurchased(movie.id);
  const hasRented = isRented(movie.id);
  const similarMovies = movies.filter(
    (m) => m.id !== movie.id && m.category === movie.category
  );

  const heroImage = imageError
    ? movie.thumbnail
    : movie.backdropUrl || movie.thumbnail;

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-24">
      {/* Top Back Navigation Bar */}
      <div className="fixed top-20 left-4 sm:left-8 z-40">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 bg-black/60 hover:bg-black/90 text-white px-3.5 py-1.5 rounded-full backdrop-blur-md border border-zinc-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back</span>
        </button>
      </div>

      {/* Cinematic Hero Backdrop */}
      <div className="relative h-[65vh] sm:h-[75vh] w-full">
        <Image
          src={heroImage}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.65]"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent w-full md:w-2/3" />

        {/* Hero Title & Actions */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {movie.category}
              </span>
              {movie.isTop10 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold px-2 py-0.5 rounded">
                  Top 10 in Ghana Today
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-netflix drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-xs sm:text-sm text-zinc-300">
              <span className="text-emerald-400 font-bold">{movie.matchScore || 96}% Match</span>
              <span>{movie.releaseYear || 2024}</span>
              <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-xs">
                {movie.rating || "18+"}
              </span>
              <span>{movie.duration || "2h 14m"}</span>
              <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded text-xs">
                Ultra HD 4K
              </span>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Play Button */}
              <button
                onClick={handlePlayClick}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm sm:text-base px-7 py-3 rounded transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play Movie</span>
              </button>

              {/* Buy GH₵20 Button */}
              <button
                onClick={handleBuyClick}
                className={`flex items-center justify-center space-x-2 text-sm sm:text-base px-6 py-3 rounded font-bold transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 ${
                  hasPurchased
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{hasPurchased ? "Purchased (GH₵20)" : "Buy GH₵20"}</span>
              </button>

              {/* Rent GH₵10 Button */}
              <button
                onClick={handleRentClick}
                className={`flex items-center justify-center space-x-2 text-sm sm:text-base px-6 py-3 rounded font-bold transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 ${
                  hasRented
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{hasRented ? "Rented 48h (GH₵10)" : "Rent GH₵10"}</span>
              </button>

              {/* Share & Like */}
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {copiedLink && (
                <span className="text-xs text-emerald-400 bg-zinc-900 px-2 py-1 rounded">
                  Copied URL!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Left 2 Cols: Synopsis & tags */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Synopsis</h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Video stream status */}
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span>TAMAFLIX High Definition Stream Ready</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Direct stream encoded at 1080p 60fps with 5.1 surround audio. Streamable on any device including Smart TVs, mobile phones, and desktop browsers.
              </p>
            </div>
          </div>

          {/* Right Col: Metadata, Cast, Director */}
          <div className="space-y-5 bg-zinc-900/40 p-6 rounded-xl border border-zinc-800/80">
            {movie.director && (
              <div>
                <span className="text-zinc-400 text-xs block">Director</span>
                <span className="text-white font-medium text-sm">{movie.director}</span>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span className="text-zinc-400 text-xs block mb-1">Starring</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="text-xs bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded border border-zinc-700/60"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.tags && movie.tags.length > 0 && (
              <div>
                <span className="text-zinc-400 text-xs block mb-1">Genres & Vibe</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-zinc-400 border border-zinc-700/60 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Audio:</span>
                <span className="text-zinc-200">English, Twi, Ga (Original)</span>
              </div>
              <div className="flex justify-between">
                <span>Subtitles:</span>
                <span className="text-zinc-200">English [CC]</span>
              </div>
              <div className="flex justify-between">
                <span>Age Rating:</span>
                <span className="text-zinc-200">{movie.rating || "18+"} Suitable for mature viewers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {similarMovies.map((similar) => (
                <MovieCard key={similar.id} movie={similar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase / Rental Success Modal */}
      {purchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-zinc-700 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">
              {purchaseModal.type === "buy"
                ? "Movie Purchase Complete!"
                : "Movie Rental Confirmed!"}
            </h3>

            <p className="text-sm text-zinc-300">
              You have successfully {purchaseModal.type === "buy" ? "bought" : "rented"}{" "}
              <span className="text-white font-bold">{purchaseModal.title}</span> for{" "}
              <span className="text-red-400 font-bold">{purchaseModal.price}</span>.
            </p>

            <p className="text-xs text-zinc-500">
              {purchaseModal.type === "buy"
                ? "This title is now permanently in your TAMAFLIX library."
                : "Your 48-hour rental period has commenced."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setPurchaseModal(null);
                  router.push(`/watch/${movie.id}`);
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Now</span>
              </button>
              <button
                onClick={() => setPurchaseModal(null)}
                className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
