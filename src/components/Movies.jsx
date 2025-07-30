import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const genreRes = await axios.get(`${import.meta.env.VITE_BASE}/genre/movie/list?api_key=${import.meta.env.VITE_API_KEY}`);
        const genres = genreRes.data.genres;
        const genreMapping = {};
        genres.forEach(g => genreMapping[g.id] = g.name);
        setGenreMap(genreMapping);

        const movieRes = await axios.get(`${import.meta.env.VITE_BASE}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}`);
        setMovies(movieRes.data.results);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <>
    
      <section className="hero-section">
        <div className='overlay'>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>

        <div className="hero-content">
          <div className="hero-label">List Movie of the Week</div>
          <h1 className="hero-title">Experience the Magic of Cinema: Book Your Tickets Today</h1>
        </div>

        <div className="hero-pagination">
          <div className="pagination-dot active"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
        </div>
        </div>
      </section>
      <section className="search-filter-container">
        <div className="search-filter-wrapper">
          <div className="search-section">
            <label className="search-label">Cari Event</label>
            <div className="search-input-wrapper">
              <img src="../../img/Search.png" alt="" className="search-icon" />
              <input type="text" className="search-input" placeholder="New Born Expert" id="searchInput" />
            </div>
          </div>
          <div className="filter-section">
            <label className="filter-label">Filter</label>
            <div className="filter-buttons">
              <button className="filter-btn active" data-filter="thriller">Thriller</button>
              <button className="filter-btn" data-filter="horror">Horror</button>
              <button className="filter-btn" data-filter="romantic">Romantic</button>
              <button className="filter-btn" data-filter="adventure">Adventure</button>
              <button className="filter-btn" data-filter="sci-fi">Sci-Fi</button>
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="movie-list">
        {movies.map(m => (
          <div key={m.id} className="relative group bg-white rounded overflow-hidden shadow hover:shadow-lg transition">
            <img src={import.meta.env.VITE_IMG_BASE + m.poster_path} alt={m.title} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex-col justify-center items-center opacity-0 group-hover:opacity-100 flex transition">
              <a href={`#`} className="mb-2 px-4 py-2 border text-white rounded hover:bg-white hover:text-black transition">Details</a>
              <a href={`#`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Buy Ticket</a>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold ">{m.title}</h4>
              <div className="flex flex-wrap gap-1 mt-2">
                {m.genre_ids.map(id => (
                  <span key={id} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {genreMap[id] || "Unknown"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
      
    </>
  );
}

export default Movies;
