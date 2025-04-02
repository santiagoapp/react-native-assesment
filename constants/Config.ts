export const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: 'w92',
    medium: 'w185',
    large: 'w342',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};