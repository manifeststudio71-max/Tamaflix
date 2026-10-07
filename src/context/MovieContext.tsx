"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Movie, MovieCategory } from "../types/movie";
import { INITIAL_MOVIES } from "../data/mockMovies";

interface MovieContextType {
  movies: Movie[];
  addMovie: (movieData: Omit<Movie, "id"> & { id?: string }) => void;
  deleteMovie: (id: string) => void;
  resetMovies: () => void;
  getMovieById: (id: string) => Movie | undefined;
  getMoviesByCategory: (category: MovieCategory) => Movie[];
  purchasedIds: string[];
  rentedIds: string[];
  buyMovie: (id: string) => void;
  rentMovie: (id: string) => void;
  isPurchased: (id: string) => boolean;
  isRented: (id: string) => boolean;
  featuredMovie: Movie | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const STORAGE_KEY = "tamaflix_movies";
const PURCHASES_KEY = "tamaflix_purchased";
const RENTALS_KEY = "tamaflix_rented";

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [rentedIds, setRentedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedMovies = localStorage.getItem(STORAGE_KEY);
      if (storedMovies) {
        const parsed = JSON.parse(storedMovies);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMovies(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOVIES));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOVIES));
      }

      const storedPurchases = localStorage.getItem(PURCHASES_KEY);
      if (storedPurchases) {
        setPurchasedIds(JSON.parse(storedPurchases));
      }

      const storedRentals = localStorage.getItem(RENTALS_KEY);
      if (storedRentals) {
        setRentedIds(JSON.parse(storedRentals));
      }
    } catch (e) {
      console.error("Error reading movies from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  const saveMovies = (updated: Movie[]) => {
    setMovies(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving movies to localStorage", e);
    }
  };

  const addMovie = (movieData: Omit<Movie, "id"> & { id?: string }) => {
    const newMovie: Movie = {
      ...movieData,
      id: movieData.id || `movie_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      backdropUrl: movieData.backdropUrl || movieData.thumbnail,
      matchScore: movieData.matchScore || Math.floor(Math.random() * 15) + 85,
      releaseYear: movieData.releaseYear || new Date().getFullYear(),
      rating: movieData.rating || "16+",
      duration: movieData.duration || "1h 50m",
    };
    const updated = [newMovie, ...movies];
    saveMovies(updated);
  };

  const deleteMovie = (id: string) => {
    const updated = movies.filter((m) => m.id !== id);
    saveMovies(updated);
  };

  const resetMovies = () => {
    saveMovies(INITIAL_MOVIES);
  };

  const getMovieById = (id: string): Movie | undefined => {
    return movies.find((m) => m.id === id);
  };

  const getMoviesByCategory = (category: MovieCategory): Movie[] => {
    return movies.filter((m) => m.category === category);
  };

  const buyMovie = (id: string) => {
    if (!purchasedIds.includes(id)) {
      const updated = [...purchasedIds, id];
      setPurchasedIds(updated);
      try {
        localStorage.setItem(PURCHASES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const rentMovie = (id: string) => {
    if (!rentedIds.includes(id)) {
      const updated = [...rentedIds, id];
      setRentedIds(updated);
      try {
        localStorage.setItem(RENTALS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const isPurchased = (id: string) => purchasedIds.includes(id);
  const isRented = (id: string) => rentedIds.includes(id);

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <MovieContext.Provider
      value={{
        movies,
        addMovie,
        deleteMovie,
        resetMovies,
        getMovieById,
        getMoviesByCategory,
        purchasedIds,
        rentedIds,
        buyMovie,
        rentMovie,
        isPurchased,
        isRented,
        featuredMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}
