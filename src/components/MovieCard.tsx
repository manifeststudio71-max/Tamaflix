"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Plus, Info, Check, ShoppingBag, Clock } from "lucide-react";
import { Movie } from "../types/movie";
import { useAuth } from "../context/AuthContext";
import { useMovies } from "../context/MovieContext";

interface MovieCardProps {
  movie: Movie;
  rank?: number;
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { isPurchased, isRented } = useMovies();
  const [imageError, setImageError] = useState(false);

  const fallbackThumbnail =
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // CRITICAL: If user clicks Play and isLoggedIn is false in localStorage, redirect to /login
    requireAuth(() => {
      router.push(`/watch/${movie.id}`);
    }, `/watch/${movie.id}`);
  };

  const hasAccess = isPurchased(movie.id) || isRented(movie.id);

  return (
    <div className="group relative flex-none w-[170px] sm:w-[220px] md:w-[260px] cursor-pointer select-none">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden bg-zinc-900 shadow-lg border border-zinc-800/80 transition-all duration-300 group-hover:scale-105 group-hover:z-30 group-hover:shadow-2xl group-hover:border-red-600/50">
          {/* Top 10 Rank Watermark if passed */}
          {rank && (
            <div className="absolute top-1 left-2 z-20 pointer-events-none">
              <span className="text-4xl sm:text-5xl font-black text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] stroke-black tracking-tighter">
                {rank}
              </span>
            </div>
          )}

          {/* Thumbnail */}
          <Image
            src={imageError ? fallbackThumbnail : movie.thumbnail}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 170px, (max-width: 768px) 220px, 260px"
            className="object-cover transition-transform duration-300 group-hover:brightness-90"
            onError={() => setImageError(true)}
          />

          {/* Hover Overlay with details & Play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-20">
            {/* Top row badges */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                {movie.category}
              </span>
              {hasAccess && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-600/90 text-white">
                  Unlocked
                </span>
              )}
            </div>

            {/* Bottom info & Play icon */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePlayClick}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-red-600 text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg transform hover:scale-110 active:scale-95"
                  title="Play Movie"
                  aria-label="Play Movie"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>

                <div className="flex items-center space-x-1.5 text-[11px] text-zinc-300 font-medium">
                  <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                    Buy GH₵20
                  </span>
                  <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                    Rent GH₵10
                  </span>
                </div>
              </div>

              <h3 className="text-white text-xs sm:text-sm font-bold truncate drop-shadow">
                {movie.title}
              </h3>

              <div className="flex items-center space-x-2 text-[10px] text-zinc-300">
                <span className="text-emerald-400 font-semibold">{movie.matchScore || 95}% Match</span>
                <span className="border border-zinc-600 px-1 rounded text-zinc-400">
                  {movie.rating || "16+"}
                </span>
                <span>{movie.duration || "1h 50m"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
