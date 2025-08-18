import React from "react";
import { Link } from "react-router-dom";

function MovieGrids({ movies, genreMap }) {
  const IMG_BASE = import.meta.env.VITE_IMG_BASE;

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      id="movie-list"
    >
      {movies.map((m) => (
        <div
          key={m.id}
          className="relative group bg-white rounded overflow-hidden shadow hover:shadow-lg transition"
        >
          {/* Container dengan rasio tetap 2:3 */}
          <div className="w-full aspect-[2/3] bg-gray-200">
            <img
              src={
                m.poster_path
                  ? IMG_BASE + m.poster_path
                  : "/image-not-found.png"
              }
              alt={m.title || "No title"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay button */}
          <div className="absolute inset-0 bg-black/50 flex-col justify-center items-center opacity-0 group-hover:opacity-100 flex transition">
            <Link
              to={`/movies/${m.id}`}
              className="mb-2 px-4 py-2 border text-white rounded hover:bg-white hover:text-black transition"
            >
              Details
            </Link>
            <Link
              to={`/order/${m.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Buy Ticket
            </Link>
          </div>

          {/* Info film */}
          <div className="p-3">
            <h4 className="text-sm font-semibold">{m.title}</h4>
            <div className="flex flex-wrap gap-1 mt-2">
              {m.genre_ids.map((id) => (
                <span
                  key={id}
                  className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
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
