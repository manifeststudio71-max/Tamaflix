"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Film,
  Plus,
  Trash2,
  ExternalLink,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import { useMovies } from "../../../context/MovieContext";
import { Movie, MovieCategory } from "../../../types/movie";

const CATEGORIES: MovieCategory[] = [
  "Trending Now",
  "Top 10 in Ghana",
  "Action",
  "Comedy",
];

const PRESET_SAMPLE_VIDEOS = [
  {
    name: "Big Buck Bunny (Animation)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    name: "Elephants Dream (Sci-Fi)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    name: "Tears of Steel (VFX)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    name: "For Bigger Blazes (Action)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    name: "Sintel (Fantasy)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

const PRESET_SAMPLE_POSTERS = [
  {
    name: "Cyberpunk Action",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "African Gold Cinema",
    url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Urban Night Drama",
    url: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Comedy Express",
    url: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AdminMoviesPage() {
  const { movies, addMovie, deleteMovie, resetMovies } = useMovies();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MovieCategory>("Trending Now");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
  );
  const [videoUrl, setVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("2h 05m");
  const [rating, setRating] = useState("16+");
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [director, setDirector] = useState("Shirley Frimpong-Manso");
  const [isTop10, setIsTop10] = useState(false);

  // Status & feedback
  const [notification, setNotification] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("Error: Please provide a movie title.");
      return;
    }
    if (!description.trim()) {
      showNotification("Error: Please provide a movie synopsis.");
      return;
    }

    addMovie({
      title: title.trim(),
      category,
      thumbnail: thumbnail.trim(),
      backdropUrl: thumbnail.trim(),
      videoUrl: videoUrl.trim(),
      description: description.trim(),
      duration: duration.trim(),
      rating,
      releaseYear: Number(releaseYear),
      director: director.trim(),
      isTop10,
      matchScore: Math.floor(Math.random() * 10) + 90,
      cast: ["Leading Star", "Co-star", "Special Appearance"],
      tags: [category, "New Release", "HD"],
    });

    showNotification(`Movie "${title}" added to TAMAFLIX library!`);

    // Reset fields
    setTitle("");
    setDescription("");
  };

  const handleDelete = (id: string, movieTitle: string) => {
    if (confirm(`Are you sure you want to delete "${movieTitle}" from TAMAFLIX?`)) {
      deleteMovie(id);
      showNotification(`Deleted "${movieTitle}" from localStorage.`);
    }
  };

  const handleReset = () => {
    if (confirm("Reset movie database to the default 12 initial movies?")) {
      resetMovies();
      showNotification("Reset movie library to default 12 movies.");
    }
  };

  const filteredMovies =
    filterCategory === "All"
      ? movies
      : movies.filter((m) => m.category === filterCategory);

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Shield className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-netflix">
              TAMAFLIX Content Admin
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Add, update, and delete movies stored locally in browser localStorage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded text-xs font-semibold border border-zinc-700 transition"
            title="Reset library to 12 mock movies"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to 12 Defaults</span>
          </button>
          <Link
            href="/"
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Home App</span>
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/80 border border-red-500/50 text-white text-sm flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-red-400" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Layout Grid: Add Movie Form + Movie Catalog List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 shadow-xl h-fit">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-zinc-800">
            <Plus className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white">Add New Movie</h2>
          </div>

          <form onSubmit={handleCreateMovie} className="space-y-4 text-xs sm:text-sm">
            {/* Title */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Movie Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Accra Nights: Unchained"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 focus:border-red-500 rounded text-white focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MovieCategory)}
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-red-500 rounded text-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Poster Thumbnail */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Thumbnail Poster URL (Unsplash or direct image) *
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 focus:border-red-500 rounded text-white text-xs font-mono focus:outline-none"
              />
              {/* Presets */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="text-[11px] text-zinc-400">Presets:</span>
                {PRESET_SAMPLE_POSTERS.map((poster) => (
                  <button
                    key={poster.name}
                    type="button"
                    onClick={() => setThumbnail(poster.url)}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700"
                  >
                    {poster.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Video Stream URL (MP4 / Google sample) *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800/90 border border-zinc-700 focus:border-red-500 rounded text-white text-xs font-mono focus:outline-none"
              />
              {/* Presets */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="text-[11px] text-zinc-400">Samples:</span>
                {PRESET_SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setVideoUrl(sample.url)}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Description / Synopsis *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Enter film plot synopsis..."
                required
                className="w-full px-3.5 py-2 bg-zinc-800/90 border border-zinc-700 focus:border-red-500 rounded text-white text-xs focus:outline-none"
              />
            </div>

            {/* Quick Metadata: Duration, Rating, Year */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-zinc-400 text-xs mb-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2.5 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-2.5 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs"
                >
                  <option value="13+">13+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs mb-1">Year</label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(Number(e.target.value))}
                  className="w-full px-2.5 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs"
                />
              </div>
            </div>

            {/* Director */}
            <div>
              <label className="block text-zinc-400 text-xs mb-1">Director</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full px-2.5 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-xs"
              />
            </div>

            {/* Top 10 check */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isTop10"
                checked={isTop10}
                onChange={(e) => setIsTop10(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-0 w-4 h-4"
              />
              <label htmlFor="isTop10" className="text-zinc-300 text-xs cursor-pointer">
                Promote as &ldquo;Top 10 in Ghana&rdquo; featured badge
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm transition shadow-lg hover:shadow-red-600/30 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Publish Movie</span>
            </button>
          </form>
        </div>

        {/* Catalog List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-red-500" />
              <span>Active Movie Catalog ({movies.length} titles)</span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded transition ${
                    filterCategory === cat
                      ? "bg-red-600 text-white font-bold"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of movies */}
          <div className="space-y-3">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-3 sm:p-4 flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="relative w-16 h-10 sm:w-20 sm:h-12 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
                    <Image
                      src={movie.thumbnail}
                      alt={movie.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                      {movie.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mt-0.5">
                      <span className="text-red-400 font-semibold">{movie.category}</span>
                      <span>•</span>
                      <span>{movie.duration || "2h"}</span>
                      <span>•</span>
                      <span>{movie.releaseYear || 2024}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="View Movie Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/watch/${movie.id}`}
                    className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 transition"
                    title="Direct Watch"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Link>

                  <button
                    onClick={() => handleDelete(movie.id, movie.title)}
                    className="p-2 rounded bg-zinc-800 hover:bg-red-950 text-red-500 hover:text-red-300 border border-transparent hover:border-red-600/40 transition"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredMovies.length === 0 && (
              <div className="text-center py-12 text-zinc-500 bg-zinc-900/30 rounded-lg border border-zinc-800">
                No movies found under &ldquo;{filterCategory}&rdquo;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
