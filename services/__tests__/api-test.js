import { fetchMovies } from "../api";
import { API_BASE_URL, API_KEY } from "@/constants/Config";

// Mock the global fetch function
global.fetch = jest.fn();

// Mock console.error to avoid cluttering test output
console.error = jest.fn();

describe("API Service", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("fetchMovies", () => {
    const mockMoviesResponse = {
      page: 1,
      results: [
        {
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
        },
      ],
      total_pages: 10,
      total_results: 200,
    };

    it("fetches movies successfully", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMoviesResponse,
      });
      const result = await fetchMovies("popular", 1);

      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`
      );

      expect(result).toEqual(mockMoviesResponse);
    });

    it("handles API errors", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchMovies("top_rated", 1)).rejects.toThrow(
        "API Error: 404"
      );

      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`
      );

      expect(console.error).toHaveBeenCalled();
    });

    it("handles network errors", async () => {
      const networkError = new Error("Network error");
      global.fetch.mockRejectedValueOnce(networkError);

      await expect(fetchMovies("popular", 1)).rejects.toThrow("Network error");

      expect(console.error).toHaveBeenCalled();
    });
  });
});
