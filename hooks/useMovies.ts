import { useState, useEffect, useCallback } from 'react';
import { fetchMovies } from '@/services/api';
import { Movie, MovieCategory } from '@/types/movie';

interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  refreshMovies: () => void;
  hasMore: boolean;
}

export const useMovies = (category: MovieCategory): UseMoviesResult => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadMovies = useCallback(async (page: number, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetchMovies(category, page);
      
      setMovies(prev => append ? [...prev, ...response.results] : response.results);
      setTotalPages(response.total_pages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadMovies(1, false);
  }, [loadMovies]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMovies(nextPage, true);
    }
  }, [currentPage, totalPages, loading, loadMovies]);

  const refreshMovies = useCallback(() => {
    setCurrentPage(1);
    loadMovies(1, false);
  }, [loadMovies]);

  return {
    movies,
    loading,
    error,
    loadMore,
    refreshMovies,
    hasMore: currentPage < totalPages
  };
};