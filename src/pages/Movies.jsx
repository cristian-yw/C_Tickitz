import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGenres,
  fetchMovies,
  setActiveFilter,
} from "../Redux/Slice/moviesSlice";
import styles from "../style/home2.module.css";
import MovieGrids from "../components/MoviesGrid.jsx";

function Movies({ searchPlaceholder = "Search movies..." }) {
  const dispatch = useDispatch();
  const { movies, genreMap, genreList, activeFilter, loading, totalPages } =
    useSelector((state) => state.movies);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const filterFromUrl = searchParams.get("filter") || "";
    setSearchTerm(searchFromUrl);
    if (filterFromUrl) {
      dispatch(setActiveFilter(filterFromUrl));
    }
  }, [searchParams, dispatch]);

  // Ambil genre sekali di awal
  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  // Ambil movies setiap kali page/search/filter berubah
  useEffect(() => {
    if (Object.keys(genreMap).length > 0) {
      dispatch(fetchMovies({ page: currentPage, searchTerm, activeFilter }));
    }
  }, [dispatch, currentPage, searchTerm, activeFilter, genreMap]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchParams((params) => {
      params.set("page", "1"); // reset ke page 1 saat search
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      if (activeFilter) {
        params.set("filter", activeFilter);
      }
      return params;
    });
  };

  const handleFilterClick = (genre) => {
    dispatch(setActiveFilter(genre));
    setSearchParams((params) => {
      params.set("page", "1"); // reset ke page 1 saat filter
      if (genre) {
        params.set("filter", genre);
      } else {
        params.delete("filter");
      }
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      return params;
    });
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams((params) => {
      params.set("page", pageNumber.toString());
      return params;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      {/* Hero Section */}
      <section className={styles["hero-section"]}>
        <div className={styles.overlay}>
          <div className={styles["hero-content"]}>
            <div className={styles["hero-label"]}>List Movie of the Week</div>
            <h1 className={styles["hero-title"]}>
              Experience the Magic of Cinema: Book Your Tickets Today
            </h1>
          </div>
          <div className={styles["hero-pagination"]}>
            <div
              className={`${styles["pagination-dot"]} ${styles.active}`}
            ></div>
            <div className={styles["pagination-dot"]}></div>
            <div className={styles["pagination-dot"]}></div>
            <div className={styles["pagination-dot"]}></div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className={styles["search-filter-container"]}>
        <div className={styles["search-filter-wrapper"]}>
          <div className={styles["search-section"]}>
            <label className={styles["search-label"]}>Cari Event</label>
            <div className={styles["search-input-wrapper"]}>
              <img
                src="/Search.png"
                alt="Search"
                className={styles["search-icon"]}
              />
              <input
                type="text"
                className={styles["search-input"]}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                id="searchInput"
              />
            </div>
          </div>

          <div className={styles["filter-section"]}>
            <label className={styles["filter-label"]}>Filter</label>
            <div className={styles["filter-buttons"]}>
              {genreList.map((genre, index) => (
                <button
                  key={index}
                  className={`${styles["filter-btn"]} ${
                    activeFilter === genre ? styles.active : ""
                  }`}
                  onClick={() => handleFilterClick(genre)}
                  disabled={loading}
                  data-filter={genre.toLowerCase()}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading movies...</p>
        </div>
      )}

      {/* Results info */}
      {!loading && (
        <div className="px-4 py-2 text-gray-600">
          Page {currentPage} of {totalPages}
          {searchTerm && ` - Search results for "${searchTerm}"`}
          {activeFilter !== "all" &&
            activeFilter !== "All" &&
            ` - ${activeFilter} movies`}
        </div>
      )}

      {/* Movie Grid */}
      {!loading && <MovieGrids movies={movies} genreMap={genreMap} />}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <section className="m-5 mt-2.5 flex flex-row justify-center gap-2">
          {currentPage > 3 && (
            <>
              <button
                className="inline-block rounded-full bg-[#A0A3BD1A] px-4 py-2 text-[#A0A3BD] transition hover:bg-blue-700 hover:text-white"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2 py-2">...</span>}
            </>
          )}
          {currentPage > 1 && (
            <button
              className="inline-block rounded-full bg-[#A0A3BD1A] px-4 py-2 text-[#A0A3BD] transition hover:bg-blue-700 hover:text-white"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ←
            </button>
          )}
          {getPaginationNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`inline-block rounded-full px-4 py-2 transition ${
                currentPage === pageNumber
                  ? "bg-blue-700 text-white"
                  : "bg-[#A0A3BD1A] text-[#A0A3BD] hover:bg-blue-700 hover:text-white"
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              className="inline-block rounded-full bg-[#A0A3BD1A] px-4 py-2 text-[#A0A3BD] transition hover:bg-blue-700 hover:text-white"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              →
            </button>
          )}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 py-2">...</span>
              )}
              <button
                className="inline-block rounded-full bg-[#A0A3BD1A] px-4 py-2 text-[#A0A3BD] transition hover:bg-blue-700 hover:text-white"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </section>
      )}

      {/* No results */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No movies found matching your criteria.
        </div>
      )}
    </>
  );
}

export default Movies;
