"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  id?: string;
  title: string;
  movies: Movie[];
  isTop10?: boolean;
}

export default function MovieRow({ id, title, movies, isTop10 = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const onScrollCheck = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div id={id} className="relative mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8 group/row">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center space-x-2">
          <span>{title}</span>
          {isTop10 && (
            <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-normal">
              Ghana Daily
            </span>
          )}
        </h2>
      </div>

      <div className="relative">
        {/* Left scroll chevron */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/row:opacity-100 rounded-r backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-7 h-7 hover:scale-125 transition-transform" />
          </button>
        )}

        {/* Scrollable list */}
        <div
          ref={rowRef}
          onScroll={onScrollCheck}
          className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={isTop10 ? index + 1 : undefined}
            />
          ))}
        </div>

        {/* Right scroll chevron */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/row:opacity-100 rounded-l backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-7 h-7 hover:scale-125 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
