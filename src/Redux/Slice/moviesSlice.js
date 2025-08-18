import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_BASE}/genre/movie/list?api_key=${
      import.meta.env.VITE_API_KEY
    }`
  );
  return res.data.genres;
});


export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page = 1, searchTerm = "", activeFilter = "All" }, { getState }) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const BASE = import.meta.env.VITE_BASE;
    const genreMap = getState().movies.genreMap || {};

    let results = [];
    let total_pages = 1;

    if (searchTerm) {
      // Search mode → ambil dari search API
      const searchRes = await axios.get(`${BASE}/search/movie`, {
        params: {
          api_key: API_KEY,
          page,
          query: searchTerm,
        },
      });

      results = searchRes.data.results || [];
      total_pages = Math.min(searchRes.data.total_pages || 1, 500);

      if (activeFilter && activeFilter !== "All") {
        const genreId = parseInt(
          Object.keys(genreMap).find((id) => genreMap[id] === activeFilter)
        );
        if (genreId) {
          results = results.filter((m) => m.genre_ids.includes(genreId));
        }
      }
    } else {
      const params = {
        api_key: API_KEY,
        page,
        sort_by: "popularity.desc",
      };

      if (activeFilter && activeFilter !== "All") {
        const genreId = Object.keys(genreMap).find(
          (id) => genreMap[id] === activeFilter
        );
        if (genreId) params.with_genres = genreId;
      }

      const discoverRes = await axios.get(`${BASE}/discover/movie`, {
        params,
      });

      results = discoverRes.data.results || [];
      total_pages = Math.min(discoverRes.data.total_pages || 1, 500);
    }

    return { results, total_pages };
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    genreMap: {},
    genreList: [],
    loading: false,
    totalPages: 1,
    activeFilter: "All",
    searchTerm: "",
    currentPage: 1,
    error: null,
  },
  reducers: {
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.fulfilled, (state, action) => {
        action.payload.forEach((g) => {
          state.genreMap[g.id] = g.name;
        });
        state.genreList = [
          "All",
          ...action.payload.slice(0, 4).map((g) => g.name),
        ];
      })
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
  },
});

export const { setActiveFilter, setSearchTerm, setCurrentPage } =
  moviesSlice.actions;
export default moviesSlice.reducer;
