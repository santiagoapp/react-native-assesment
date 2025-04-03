export interface Movie {
  id: number;
  adult: boolean;
  title: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  poster_path: string;
  overview: string;
  popularity: number;
  video: boolean;
  vote_count: number;
  vote_average: number;
  release_date: string;
  backdrop_path: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type MovieCategory = "popular" | "top_rated";
