import React from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
} from 'react-native';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';

interface MovieGridProps {
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  loading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onEndReached: () => void;
  hasMore: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onMoviePress,
  loading,
  error,
  onRefresh,
  onEndReached,
  hasMore
}) => {
  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Text style={styles.errorSubText}>Pull down to refresh</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      renderItem={({ item }) => <MovieCard movie={item} onPress={onMoviePress} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      refreshControl={
        <RefreshControl
          refreshing={loading && movies.length === 0}
          onRefresh={onRefresh}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.contentContainer}
      testID="movie-grid-flatlist"
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 0, // No padding in the design
  },
  columnWrapper: {
    justifyContent: 'space-evenly', // Even spacing between items
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: 'gray',
  },
});