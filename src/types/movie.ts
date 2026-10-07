export type MovieCategory = 
  | "Trending Now" 
  | "Top 10 in Ghana" 
  | "Action" 
  | "Comedy";

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  backdropUrl?: string;
  videoUrl: string;
  description: string;
  category: MovieCategory;
  duration?: string;
  rating?: string;
  releaseYear?: number;
  matchScore?: number;
  cast?: string[];
  director?: string;
  tags?: string[];
  isTop10?: boolean;
  top10Rank?: number;
}
