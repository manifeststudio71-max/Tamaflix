"use client";

import React from "react";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { useMovies } from "../context/MovieContext";

export default function HomePage() {
  const { movies, getMoviesByCategory, featuredMovie } = useMovies();

  const trendingMovies = getMoviesByCategory("Trending Now");
  const top10Movies = getMoviesByCategory("Top 10 in Ghana");
  const actionMovies = getMoviesByCategory("Action");
  const comedyMovies = getMoviesByCategory("Comedy");

  // Fallback if user cleared or filtered movies
  const heroMovie = featuredMovie || movies[0] || null;

  return (
    <div className="relative pb-16 bg-[#141414] min-h-screen text-white">
      {/* Hero Banner featuring big movie */}
      <HeroBanner movie={heroMovie} />

      {/* Rows Container with subtle negative margin to overlap hero gradient */}
      <div className="relative z-20 -mt-14 sm:-mt-24 md:-mt-32 space-y-4">
        {/* Row 1: Trending Now */}
        <MovieRow
          id="trending"
          title="Trending Now"
          movies={trendingMovies.length > 0 ? trendingMovies : movies.slice(0, 4)}
        />

        {/* Row 2: Top 10 in Ghana */}
        <MovieRow
          id="top10"
          title="Top 10 Movies in Ghana Today"
          isTop10={true}
          movies={top10Movies.length > 0 ? top10Movies : movies.slice(2, 6)}
        />

        {/* Row 3: Action */}
        <MovieRow
          id="action"
          title="Action & High-Octane Thrillers"
          movies={actionMovies.length > 0 ? actionMovies : movies.slice(4, 8)}
        />

        {/* Row 4: Comedy */}
        <MovieRow
          id="comedy"
          title="Comedy & Feel-Good Laughs"
          movies={comedyMovies.length > 0 ? comedyMovies : movies.slice(8, 12)}
        />
      </div>
    </div>
  );
}
