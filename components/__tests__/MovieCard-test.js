import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { MovieCard } from "../MovieCard";

// Mock the imageUtils functions
jest.mock("@/utils/imageUtils", () => ({
  getImageUrl: jest.fn().mockReturnValue("https://mocked-image-url.jpg"),
  getPlaceholderImage: jest
    .fn()
    .mockReturnValue("https://mocked-placeholder.jpg"),
}));

describe("MovieCard Component", () => {
  const mockMovie = {
    id: 1,
    title: "Test Movie",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    overview: "Test overview",
    release_date: "2023-01-01",
    vote_average: 8.5,
    vote_count: 100,
    popularity: 500,
    adult: false,
    original_language: "en",
    original_title: "Test Movie Original",
    video: false,
    genre_ids: [28, 12],
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders correctly with poster path", () => {
    render(
      React.createElement(MovieCard, { movie: mockMovie, onPress: mockOnPress })
    );

    const touchable = screen.getByTestId("movie-card-touchable");
    const poster = screen.getByTestId("movie-poster");

    expect(touchable).toBeTruthy();
    expect(poster).toBeTruthy();
    expect(poster.props.source.uri).toBe("https://mocked-image-url.jpg");
  });

  it("renders correctly without poster path", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(
      React.createElement(MovieCard, {
        movie: movieWithoutPoster,
        onPress: mockOnPress,
      })
    );

    const touchable = screen.getByTestId("movie-card-touchable");
    const poster = screen.getByTestId("movie-poster");

    expect(touchable).toBeTruthy();
    expect(poster).toBeTruthy();
    expect(poster.props.source.uri).toBe("https://mocked-placeholder.jpg");
  });

  it("calls onPress with the movie when pressed", () => {
    render(
      React.createElement(MovieCard, { movie: mockMovie, onPress: mockOnPress })
    );

    const touchable = screen.getByTestId("movie-card-touchable");
    fireEvent.press(touchable);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockMovie);
  });
});
