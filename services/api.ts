import { API_BASE_URL, API_KEY } from '@/constants/Config';
import { Movie, MovieCategory, MovieResponse } from '@/types/movie';

export const fetchMovies = async (category: MovieCategory, page = 1): Promise<MovieResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};