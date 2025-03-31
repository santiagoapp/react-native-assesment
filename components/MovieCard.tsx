import React from "react";
import { StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Movie } from "@/types/movie";
import { getImageUrl, getPlaceholderImage } from "@/utils/imageUtils";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width / 2;

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, "poster", "medium")
    : getPlaceholderImage("poster");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
      testID="movie-card-touchable"
    >
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
        testID="movie-poster"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    maxWidth: "50%",
    overflow: "hidden",
  },
  poster: {
    width: cardWidth,
    aspectRatio: 2 / 3,
  },
});
