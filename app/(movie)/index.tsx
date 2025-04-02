import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieGrid } from "@/components/MovieGrid";
import { Header } from "@/components/Header";
import { useMovies } from "@/hooks/useMovies";
import { Movie, MovieCategory } from "@/types/movie";

export default function DiscoveryScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<MovieCategory>("top_rated");
  const { movies, loading, error, loadMore, refreshMovies, hasMore } =
    useMovies(category);

  const handleMoviePress = (movie: Movie) => {
    router.push(`/(movie)/${movie.id}`);
  };

  const getHeaderTitle = () => {
    return category === 'popular' ? 'Popular Movies' : 'Top Rated Movies';
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Header 
        title={getHeaderTitle()} 
        onCategoryChange={setCategory}
        currentCategory={category}
      />
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        <MovieGrid
          movies={movies}
          onMoviePress={handleMoviePress}
          loading={loading}
          error={error}
          onRefresh={refreshMovies}
          onEndReached={loadMore}
          hasMore={hasMore}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background as per the design
  },
});
