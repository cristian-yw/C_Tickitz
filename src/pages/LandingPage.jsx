// Fully TailwindCSS-based LandingPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieGrids from "../components/MoviesGrid.jsx";

function LandingPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch genres
        const genreRes = await axios.get(
          `${import.meta.env.VITE_BASE}/genre/movie/list?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        const mapping = {};
        genreRes.data.genres.forEach((g) => (mapping[g.id] = g.name));
        setGenreMap(mapping);

        // fetch popular
        const popularRes = await axios.get(
          `${import.meta.env.VITE_BASE}/movie/popular?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setPopularMovies(popularRes.data.results);

        // fetch upcoming
        const upcomingRes = await axios.get(
          `${import.meta.env.VITE_BASE}/movie/upcoming?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setUpcomingMovies(upcomingRes.data.results);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col gap-8 px-8 pt-10 md:flex-row md:items-center">
        <div className="flex flex-col gap-8 ">
          <p className="text-[#1D4ED8] font-semibold text-lg">
            MOVIE TICKET PURCHASES #1 IN INDONESIA
          </p>
          <h1 className="text-3xl font-medium">
            Experience the Magic of Cinema: Book Your Tickets Today
          </h1>
          <p className="text-[#A0A3BD] text-lg font-light">
            Sign up and get the ticket with a lot of discount
          </p>
        </div>
        <section className="h-96 grid grid-cols-2 grid-rows-3 gap-2">
          {popularMovies.slice(0, 4).map((movie, index) => {
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const layoutClasses = [
              "row-span-1 col-span-1 rounded-t-2xl", // posisi 1
              "row-span-2 col-span-1 row-start-1 row-end-3 col-start-2 rounded-t-2xl", // posisi 2
              "row-span-2 col-span-1 row-start-2 col-start-1 rounded-b-2xl", // posisi 3
              "row-span-1 col-span-1 row-start-3 col-start-2 rounded-b-2xl", // posisi 4
            ];
            return (
              <img
                key={movie.id}
                src={posterUrl}
                alt={movie.title}
                className={`w-full h-full object-cover ${layoutClasses[index]}`}
              />
            );
          })}
        </section>
      </section>

      {/* Why Choose Us */}
      <section className="px-8">
        <p className="text-[#1D4ED8] text-sm font-semibold">WHY CHOOSE US</p>
        <h2 className="text-2xl font-bold mb-10">
          Unleashing the Ultimate Movie Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "/Shield Done.png", title: "Guaranteed" },
            { icon: "/check-circle-fill.png", title: "Affordable" },
            {
              icon: "/icons8-speech-bubble 1.png",
              title: "24/7 Customer Support",
            },
          ].map(({ icon, title }) => (
            <div
              key={title}
              className="text-left flex flex-col items-start gap-3"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <img src={icon} alt={title} className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-semibold">{title}</h4>
              <p className="text-sm text-[#A0A3BD]">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Exciting Movies */}
      <section className="px-8">
        <p className="text-[#1D4ED8] text-sm font-semibold">MOVIES</p>
        <h2 className="text-2xl font-bold mb-6">
          Exciting Movies That Should Be Watched Today
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"></div>
        <MovieGrids movies={popularMovies.slice(0, 4)} genreMap={genreMap} />
      </section>

      {/* Upcoming Movies */}
      <section className="px-8">
        <p className="text-[#1D4ED8] text-sm font-semibold">UPCOMING MOVIES</p>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Exciting Movie Coming Soon</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-gray-300 text-white text-xl">
              ‹
            </button>
            <button className="w-10 h-10 rounded-full bg-blue-500 text-white text-xl">
              ›
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingMovies.slice(4, 8).map((movie) => (
            <div key={movie.id} className="flex flex-col gap-2">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full h-72 object-cover"
              />
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-sm text-[#1D4ED8]">Coming Soon</p>
              <ul className="text-sm text-gray-500 flex flex-wrap gap-2">
                {movie.genre_ids.map((id) => (
                  <li key={id}>{genreMap[id]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-[#1D4ED8] py-16 px-8 text-center text-white rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Subscribe to our newsletter
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="px-4 py-3 rounded-md bg-blue-600 w-full max-w-xs"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-3 rounded-md bg-blue-600 w-full max-w-xs"
          />
          <button className="px-6 py-3 bg-white text-[#1D4ED8] font-semibold rounded-md w-full max-w-xs">
            Subscribe Now
          </button>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
