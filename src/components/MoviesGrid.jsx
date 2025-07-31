import React from 'react';

function MovieGrids({ movies, genreMap }) {
  const IMG_BASE = import.meta.env.VITE_IMG_BASE;

  return (
    <section className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="movie-list">
      {movies.map(m => (
        <div key={m.id} className="relative group bg-white rounded overflow-hidden shadow hover:shadow-lg transition">
          {m.poster_path && (
            <img src={IMG_BASE + m.poster_path} alt={m.title} className="w-full h-auto" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex-col justify-center items-center opacity-0 group-hover:opacity-100 flex transition">
            <a href="#" className="mb-2 px-4 py-2 border text-white rounded hover:bg-white hover:text-black transition">Details</a>
            <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Buy Ticket</a>
          </div>
          <div className="p-3">
            <h4 className="text-sm font-semibold">{m.title}</h4>
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
  );
}

export default MovieGrids;
