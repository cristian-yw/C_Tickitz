import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- thunk untuk ambil data film dari endpoint backend dengan filter
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params) => {
    const res = await axios.get("http://backend:8080/movies/filter", {
      params,
    });
    return {
      results: res.data.results, // ambil array film
      totalPages: res.data.total_pages, // kalau butuh pagination
    };
  }
);
// --- thunk untuk ambil daftar genre
export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const res = await axios.get("/api/genres");
  return res.data; // misal [{id:1,name:'Action'}, ...]
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    totalPages: 1,
    error: null,
  },
  reducers: {
    // <== reducer yang tadi belum ada
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchGenres.fulfilled, (state, action) => {
        const list = action.payload.map((g) => g.name);
        state.genreList = ["All", ...list];
        const map = {};
        action.payload.forEach((g) => {
          map[g.id] = g.name;
        });
        state.genreMap = map;
      });
  },
});

export const { setActiveFilter } = moviesSlice.actions; // <-- penting
export default moviesSlice.reducer;
