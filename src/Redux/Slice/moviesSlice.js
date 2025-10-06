import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- Thunk untuk ambil data film dari endpoint backend dengan filter
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params) => {
    const res = await axios.get("http://backend:8080/movies/filter", {
      params,
    });
    console.log("fetchMovies response:", res.data);

    return {
      results: res.data.results || [],
      totalPages: res.data.total_pages || 1,
    };
  }
);

// --- Thunk untuk ambil daftar genre
export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const res = await axios.get("http://backend:8080/genres");
  console.log("fetchGenres raw response:", res.data);

  // Pastikan hasil akhirnya berupa array genre
  const data = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data.data)
    ? res.data.data
    : [];

  console.log("fetchGenres parsed data:", data);
  return data;
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    genreList: [],
    genreMap: {},
    activeFilter: "All",
    totalPages: 1,
    error: null,
  },
  reducers: {
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- Genres
      .addCase(fetchGenres.fulfilled, (state, action) => {
        console.log("fetchGenres.fulfilled payload:", action.payload);

        const list = Array.isArray(action.payload)
          ? action.payload.map((g) => g.name)
          : [];

        state.genreList = ["All", ...list];

        const map = {};
        (action.payload || []).forEach((g) => {
          map[g.id] = g.name;
        });

        state.genreMap = map;
        console.log("genreList:", state.genreList);
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genreList = ["All"];
        state.error = action.error.message;
        console.error("fetchGenres failed:", action.error.message);
      });
  },
});

export const { setActiveFilter } = moviesSlice.actions;
export default moviesSlice.reducer;
