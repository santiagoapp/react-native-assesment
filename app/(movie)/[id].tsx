import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import { Movie } from "@/types/movie";
import { Header } from "@/components/Header";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { getImageUrl, getPlaceholderImage } from "@/utils/imageUtils";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const movieData = await fetchMovieDetails(Number(id));
        setMovie(movieData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovie();
    }
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay error={error}/>;
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, "poster", "medium")
    : getPlaceholderImage("poster");

  const formattedDate = new Date(movie.release_date).getFullYear().toString();

  return (
    <View style={styles.rootContainer}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "none",
          animationDuration: 0,
        }}
      />
      <Header title="Movie Details" showBackButton disableMenu />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.titleBackground}>
            <Text style={styles.title}>{movie.title}</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.posterContainer}>
              <Image
                source={{ uri: posterUrl }}
                style={styles.poster}
                resizeMode="cover"
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.yearText}>{formattedDate}</Text>
              <Text style={styles.durationText}>120 mins</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <TouchableOpacity 
                style={[styles.favoriteButton, isFavorite(Number(id)) && styles.favoriteButtonActive]}
                onPress={() => {
                  if (isFavorite(Number(id))) {
                    removeFavorite(Number(id));
                  } else if (movie) {
                    addFavorite(movie);
                  }
                }}
              >
                <Text style={styles.favoriteButtonText}>
                  {isFavorite(Number(id)) ? "Remove from Favorites" : "Add to Favorite"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.overviewContainer}>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>

          <View style={styles.trailersContainer}>
            <Text style={styles.trailersTitle}>TRAILERS</Text>

            <TouchableOpacity style={styles.trailerButton}>
              <Ionicons
                name="play-circle-outline"
                size={24}
                color="black"
                style={styles.playIcon}
              />
              <Text style={styles.trailerButtonText}>Play trailer 1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.trailerButton}>
              <Ionicons
                name="play-circle-outline"
                size={24}
                color="black"
                style={styles.playIcon}
              />
              <Text style={styles.trailerButtonText}>Play trailer 2</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  scrollView: {
    flex: 1,
  },
  titleBackground: {
    backgroundColor: "#746A64",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flexDirection: "row",
    padding: 16,
  },
  posterContainer: {
    marginRight: 16,
  },
  poster: {
    width: 115,
    height: 170,
    borderRadius: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: 170,
  },
  yearText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#212121",
    marginBottom: 1,
  },
  durationText: {
    fontSize: 14,
    color: "#212121",
    fontStyle: "italic",
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  favoriteButton: {
    backgroundColor: "#746A64",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonActive: {
    backgroundColor: "#D32F2F",
  },
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overviewContainer: {
    padding: 16,
  },
  overview: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
    color: "#757575",
  },
  trailersContainer: {
    padding: 16,
  },
  trailersTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  trailerButton: {
    borderWidth: 1,
    borderColor: '#FAFAFA',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 2,
  },
  playIcon: {
    marginRight: 8,
  },
  trailerButtonText: {
    fontSize: 14,
    color: "#757575",
  },
});
