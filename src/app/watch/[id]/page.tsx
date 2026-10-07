"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Volume2, ShieldAlert, AlertTriangle } from "lucide-react";
import { useMovies } from "../../../context/MovieContext";
import { useAuth } from "../../../context/AuthContext";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  const { getMovieById, movies } = useMovies();
  const { isLoggedIn, isReady } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [movie, setMovie] = useState(() => getMovieById(movieId));
  const [controlsVisible, setControlsVisible] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // CRITICAL: Guard /watch/[id] if isLoggedIn is false in localStorage
  useEffect(() => {
    if (isReady) {
      const storedAuth = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
      if (!storedAuth) {
        router.replace(`/login?redirect=/watch/${movieId}`);
      }
    }
  }, [isReady, movieId, router]);

  useEffect(() => {
    const found = getMovieById(movieId);
    if (found) {
      setMovie(found);
    }
  }, [movieId, getMovieById, movies]);

  // Handle overlay auto-hide on inactivity
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie Stream Not Available</h2>
        <p className="text-zinc-400 mb-6">
          Could not find the requested stream in the TAMAFLIX library.
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

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black text-white overflow-hidden select-none cursor-default"
    >
      {/* Top Floating Control Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-40 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/movies/${movie.id}`)}
            className="flex items-center space-x-2 text-white hover:text-red-500 bg-black/50 hover:bg-black/80 px-3.5 py-2 rounded-full backdrop-blur-md border border-zinc-800 transition-all hover:scale-105"
            aria-label="Back to movie details"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>

          <div>
            <span className="text-xs font-bold text-red-500 tracking-wider uppercase block">
              TAMAFLIX Player
            </span>
            <h1 className="text-base sm:text-xl font-bold text-white drop-shadow truncate max-w-md">
              {movie.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-zinc-300">
          <span className="bg-red-600/90 text-white font-bold px-2 py-0.5 rounded">
            HD
          </span>
          <span className="hidden sm:inline border border-zinc-700 px-2 py-0.5 rounded">
            {movie.rating || "18+"}
          </span>
        </div>
      </div>

      {/* HTML5 Video Player */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        {videoError ? (
          <div className="p-8 max-w-md text-center bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-lg font-bold text-white">Stream Playback Notice</h2>
            <p className="text-xs text-zinc-400">
              There was an issue streaming this video URL directly:
            </p>
            <p className="text-[11px] text-zinc-500 font-mono break-all bg-black p-2 rounded">
              {movie.videoUrl}
            </p>
            <button
              onClick={() => {
                setVideoError(false);
                if (videoRef.current) videoRef.current.load();
              }}
              className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition"
            >
              Retry Playback
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={movie.videoUrl}
            poster={movie.backdropUrl || movie.thumbnail}
            controls
            autoPlay
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
