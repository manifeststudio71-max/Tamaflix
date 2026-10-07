"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Info, Volume2, VolumeX, Flame } from "lucide-react";
import { Movie } from "../types/movie";
import { useAuth } from "../context/AuthContext";

interface HeroBannerProps {
  movie: Movie | null;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [imageError, setImageError] = useState(false);

  if (!movie) {
    return (
      <div className="relative h-[70vh] sm:h-[80vh] w-full bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-600 font-medium">Loading featured film...</div>
      </div>
    );
  }

  const handlePlayClick = () => {
    // CRITICAL: If user clicks Play and isLoggedIn is false in localStorage, redirect to /login
    requireAuth(() => {
      router.push(`/watch/${movie.id}`);
    }, `/watch/${movie.id}`);
  };

  const backdropSrc = imageError
    ? movie.thumbnail
    : movie.backdropUrl || movie.thumbnail;

  return (
    <div className="relative h-[75vh] sm:h-[85vh] w-full select-none overflow-hidden">
      {/* Background Poster Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropSrc}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.75] transition-all duration-700"
          onError={() => setImageError(true)}
        />
        {/* Cinematic gradient overlays like Netflix */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-28">
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider shadow">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>TAMAFLIX EXCLUSIVE</span>
            </span>
            {movie.isTop10 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-amber-400/30">
                #1 in Ghana Today
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md font-netflix">
            {movie.title}
          </h1>

          {/* Metadata badges */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm text-zinc-300 font-semibold">
            <span className="text-emerald-400 font-bold">{movie.matchScore || 98}% Match</span>
            <span>{movie.releaseYear || 2024}</span>
            <span className="border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-300 rounded">
              {movie.rating || "18+"}
            </span>
            <span>{movie.duration || "2h 14m"}</span>
            <span className="border border-zinc-500/50 bg-zinc-800/60 px-1.5 py-0.5 text-xs rounded text-zinc-300">
              Ultra HD 4K
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-200 line-clamp-3 leading-relaxed drop-shadow">
            {movie.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-3 pt-2">
            <button
              onClick={handlePlayClick}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Play</span>
            </button>

            <Link
              href={`/movies/${movie.id}`}
              className="flex items-center justify-center space-x-2 bg-zinc-600/70 hover:bg-zinc-600/90 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded transition-all duration-200 backdrop-blur-sm shadow hover:scale-105 active:scale-95"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Link>

            <div className="hidden sm:flex items-center text-xs text-zinc-300 bg-zinc-900/60 border border-zinc-700/50 rounded px-3 py-2 space-x-2 backdrop-blur-sm">
              <span className="text-zinc-400">Available to:</span>
              <span className="text-red-400 font-bold">Buy GH₵20</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">Rent GH₵10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
