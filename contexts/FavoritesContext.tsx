import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "@/types/movie";

// Storage key for favorites
const FAVORITES_STORAGE_KEY = "@favorites";

interface FavoritesState {
  favorites: Movie[];
}

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: Movie }
  | { type: "REMOVE_FAVORITE"; payload: number };

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const initialState: FavoritesState = {
  favorites: [],
};

// Helper functions for AsyncStorage
const saveFavoritesToStorage = async (favorites: Movie[]) => {
  try {
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error("Error saving favorites to storage:", error);
  }
};

const loadFavoritesFromStorage = async (): Promise<Movie[]> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Error loading favorites from storage:", error);
    return [];
  }
};

function favoritesReducer(state: FavoritesState, action: FavoritesAction) {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (state.favorites.some((movie) => movie.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter(
          (movie) => movie.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from storage when component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await loadFavoritesFromStorage();
      if (storedFavorites.length > 0) {
        storedFavorites.forEach((movie) => {
          dispatch({ type: "ADD_FAVORITE", payload: movie });
        });
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = (movie: Movie) => {
    dispatch({ type: "ADD_FAVORITE", payload: movie });
  };
  const removeFavorite = (movieId: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: movieId });
  };

  // Save favorites to storage whenever they change
  useEffect(() => {
    saveFavoritesToStorage(state.favorites);
  }, [state.favorites]);
  const isFavorite = (movieId: number) => {
    return state.favorites.some((movie) => movie.id === movieId);
  };
  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
