import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MovieDetail() {
  // Using useParams and useNavigate would be here in real implementation
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "08/02/25",
    time: "10:00",
    location: "Jakarta",
    cinema: "CineOne21",
  });

  const IMG_BASE =
    import.meta.env.VITE_IMG_BASE || "https://image.tmdb.org/t/p/w500";
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (!API_KEY) {
          throw new Error(
            "API Key not found. Please check your environment variables."
          );
        }

        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        console.log("Movie Response Status:", movieResponse.status);
        console.log("Movie Response Text:", await movieResponse.clone().text());
        if (!movieResponse.ok) {
          throw new Error(
            `Failed to fetch movie data: ${movieResponse.status}`
          );
        }

        const movieData = await movieResponse.json();

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );

        if (!creditsResponse.ok) {
          throw new Error(
            `Failed to fetch credits data: ${creditsResponse.status}`
          );
        }

        const creditsData = await creditsResponse.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);

        const fallbackMovieData = {
          title: "Sample Movie - API Error",
          poster_path: "/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
          backdrop_path: "/vc8bCGjdVp0UbMNLzHnHSLRbBWQ.jpg",
          genres: [
            { id: 28, name: "Action" },
            { id: 12, name: "Adventure" },
            { id: 878, name: "Science Fiction" },
          ],
          release_date: "2017-07-05",
          runtime: 133,
          vote_average: 7.4,
          overview:
            "This is sample data shown because the API call failed. Please check your API key and network connection.",
        };

        const fallbackCreditsData = {
          crew: [{ job: "Director", name: "Sample Director" }],
          cast: [
            { name: "Sample Actor 1" },
            { name: "Sample Actor 2" },
            { name: "Sample Actor 3" },
          ],
        };

        setMovie(fallbackMovieData);
        setCredits(fallbackCreditsData);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API_KEY]);

  const director = credits?.crew?.find((c) => c.job === "Director");
  const casts =
    credits?.cast
      ?.slice(0, 3)
      ?.map((c) => c.name)
      ?.join(", ") || "N/A";

  const cinemas = [
    {
      name: "EBV.id",
      logo: "/ebv.id.png",
      displayName: "EBV Cinema",
      color: "blue",
    },
    {
      name: "Hiflix",
      logo: "/hiflix_2.png",
      displayName: "HiFlix Premium",
      color: "red",
    },
    {
      name: "CineOne21",
      logo: "/cinemaone.png",
      displayName: "CineOne21",
      color: "yellow",
    },
    {
      name: "XXI",
      logo: "/ebv.id.png",
      displayName: "Cinema XXI",
      color: "purple",
    },
  ];

  const timeSlots = ["10:00", "13:00", "16:00", "19:00", "22:00"];
  const dates = ["08/02/25", "08/03/25", "08/04/25", "08/05/25"];
  const locations = ["Jakarta", "Bandung", "Surabaya", "Purwokerto"];

  const handleBookNow = () => {
    const selectedCinemaData = cinemas.find(
      (c) => c.name === bookingData.cinema
    );

    const movieBookingData = {
      movieId: id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      movieGenres: movie.genres,
      movieRuntime: movie.runtime,
      movieOverview: movie.overview,
      movieReleaseDate: movie.release_date,
      date: bookingData.date,
      time: bookingData.time,
      location: bookingData.location,
      cinema: bookingData.cinema,
      cinemaLogo: selectedCinemaData?.logo || null,
      timestamp: new Date().toISOString(),
      director: director?.name || "Unknown",
      casts: casts,
    };

    localStorage.setItem("movieBookingData", JSON.stringify(movieBookingData));

    navigate(`/order/${id}`);
  };

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center">
        <div className="animate-pulse">
          <div className="w-full h-80 bg-gray-300 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto px-4">
            <div className="w-80 h-96 bg-gray-300 rounded-2xl"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center">
      {error && (
        <div className="w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                <strong>Warning:</strong> Using sample data due to API error:{" "}
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Image with Gradient Overlay */}
      <div className="relative w-full h-80 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      <section className="max-w-6xl mx-auto px-4 w-full">
        {/* Movie Poster + Info */}
        <div className="-mt-72 flex flex-col md:flex-row gap-6 mb-8 relative z-10">
          {/* Movie Poster */}
          <img
            className="aspect-[2/3] rounded-2xl object-cover md:w-80"
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={movie.title}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x450?text=No+Image";
            }}
          />

          {/* Movie Information */}
          <div className="flex flex-col items-center md:items-start gap-4 relative top-74">
            <h1 className="text-4xl font-medium text-black">{movie.title}</h1>

            {/* Genres */}
            {movie.genres && (
              <ul className="flex gap-4 text-sm text-gray-600">
                {movie.genres.map((genre) => (
                  <li key={genre.id}>{genre.name}</li>
                ))}
              </ul>
            )}

            {/* About Movie */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              <span>
                <div className="font-light text-[#8692A6]">Release Date</div>
                <div className="text-black">{movie.release_date || "N/A"}</div>
              </span>
              <span>
                <div className="font-light text-[#8692A6]">Directed by</div>
                <div className="text-black">{director?.name || "Unknown"}</div>
              </span>
              <span>
                <div className="font-light text-[#8692A6]">Duration</div>
                <div className="text-black">{formatRuntime(movie.runtime)}</div>
              </span>
              <span>
                <div className="font-light text-[#8692A6]">Casts</div>
                <div className="text-black">{casts}</div>
              </span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mt-6 mb-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-medium mb-4">Synopsis</h3>
          <p className="text-base font-light text-[#A0A3BD]">
            {movie.overview || "No synopsis available."}
          </p>
        </div>

        {/* Book Tickets */}
        <div className="flex flex-col items-center mt-10">
          <h2 className="text-3xl font-light mb-6">Book Tickets</h2>
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4 mb-8">
            {/* Date */}
            <span className="flex flex-col gap-2">
              <div className="text-xl font-medium">Choose Date</div>
              <div className="rounded-md bg-[#EFF0F6] px-4 py-3">
                <select
                  className="w-full bg-transparent focus:outline-none"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                >
                  {dates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
            </span>

            {/* Time */}
            <span className="flex flex-col gap-2">
              <div className="text-xl font-medium">Choose Time</div>
              <div className="flex items-center gap-3 rounded-md bg-[#EFF0F6] px-4 py-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <select
                  className="w-full bg-transparent focus:outline-none"
                  value={bookingData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </span>

            {/* Location */}
            <span className="flex flex-col gap-2">
              <div className="text-xl font-medium">Choose Location</div>
              <div className="flex items-center gap-3 rounded-md bg-[#EFF0F6] px-4 py-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <select
                  className="w-full bg-transparent focus:outline-none"
                  value={bookingData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </span>

            {/* Filter btn placeholder */}
            <span className="flex flex-col gap-2">
              <div className="invisible text-xl font-medium">Filter Button</div>
              <button className="w-full gap-3 rounded-md bg-[#1D4ED8] px-4 py-3 text-[#F8FAFC] hover:bg-blue-700 transition-colors">
                Filter
              </button>
            </span>
          </div>

          {/* Cinemas */}
          <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Choose Cinema</h3>
              <span className="font-semibold text-[#8692A6]">
                {cinemas.length} Result
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {cinemas.map((cinema) => (
                <button
                  key={cinema.name}
                  onClick={() => handleInputChange("cinema", cinema.name)}
                  className={`flex flex-col items-center justify-center rounded-lg border p-5 transition-all hover:shadow-md ${
                    bookingData.cinema === cinema.name
                      ? "bg-[#1c4eda9a] border-[#1D4ED8]"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={cinema.logo}
                    alt={cinema.displayName}
                    className="mx-auto mb-2 w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/64x64?text=No+Logo";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Book Now */}
          <button
            onClick={handleBookNow}
            className="w-1/4 cursor-pointer rounded-sm bg-[#1D4ED8] py-4 text-[#F8FAFC] hover:bg-blue-700 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </section>
    </main>
  );
}

export default MovieDetail;
