import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Order() {
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats] = useState([
    "A6",
    "B2",
    "B3",
    "D2",
    "E4",
    "G3",
    "A12",
    "C9",
    "C12",
    "D9",
    "D12",
    "F13",
  ]);
  const [loveNest] = useState(["C5", "C4"]);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState({
    date: "Tuesday, 07 July 2020",
    time: "13:00",
    location: "Jakarta",
    cinema: "CineOne21",
  });
  const [loading, setLoading] = useState(true);
  const ticketPrice = 10;

  // Check if device is mobile
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load movie and booking data from localStorage or URL params
  useEffect(() => {
    try {
      const savedBookingData = localStorage.getItem("movieBookingData");

      if (savedBookingData) {
        const bookingData = JSON.parse(savedBookingData);

        // Set movie data
        if (bookingData.movieId && bookingData.movieTitle) {
          setMovie({
            id: bookingData.movieId,
            title: bookingData.movieTitle,
            poster_path:
              bookingData.moviePoster ||
              "https://via.placeholder.com/300x450?text=No+Image",
            genres: bookingData.movieGenres || [],
            runtime: bookingData.movieRuntime || null,
          });
        }

        // Set booking details (logo & nama ikut dibaca)
        setBookingDetails({
          date: bookingData.date || "Tuesday, 07 July 2020",
          time: bookingData.time || "13:00",
          location: bookingData.location || "Jakarta",
          cinema: bookingData.cinema || "CineOne21",
          cinemaLogo: bookingData.cinemaLogo || "/CineOne21 2.svg",
          cinemaName:
            bookingData.cinemaName || bookingData.cinema || "CineOne21",
        });
      } else {
        // Kalau tidak ada data di localStorage, pakai demo
        setMovie({
          id: "demo",
          title: "Spider-Man: Homecoming",
          poster_path:
            "https://images.unsplash.com/photo-1489599577372-f4f4368c48f8?w=300&h=450&fit=crop",
          genres: [{ name: "Drama" }, { name: "Thriller" }],
          runtime: 133,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading booking data:", error);
      setLoading(false);
    }
  }, []);

  // Seat data
  const rows = ["A", "B", "C", "D", "E", "F", "G"];

  const handleSeatClick = (seatId) => {
    if (soldSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((seat) => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const getSeatClass = (seatId) => {
    if (soldSeats.includes(seatId))
      return "bg-gray-500 text-white cursor-not-allowed";
    if (selectedSeats.includes(seatId)) return "bg-blue-700 text-white";
    if (loveNest.includes(seatId)) return "bg-pink-400";
    return "bg-gray-200 hover:bg-gray-300 cursor-pointer";
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    // Simpan data lengkap untuk halaman payment
    localStorage.setItem(
      "paymentData",
      JSON.stringify({
        movie,
        bookingDetails,
        selectedSeats,
        totalPrice,
      })
    );

    // Pindah ke halaman payment
    navigate(`/payment`);
  };

  const handleSubmit = () => {
    handleCheckout();
  };

  // Calculate total price
  const totalPrice = selectedSeats.length * ticketPrice;

  // Mobile Modal Component
  const MobileCheckoutModal = () => {
    if (!showMobileModal) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileModal(false)}
        ></div>

        {/* Modal */}
        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
          <div className="bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Handle bar */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
              <button
                onClick={() => setShowMobileModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cinema Info */}
            <div className="flex justify-center mt-8 mb-6">
              <img
                src={`${bookingDetails.cinemaLogo}`}
                alt="cinema logo"
                className="h-12"
              />
            </div>
            <h2 className="text-xl font-medium text-center mb-6">
              {bookingDetails.cinema} Cinema
            </h2>

            {/* Movie Info Card */}
            <div className="border border-gray-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h4 className="font-bold text-lg">{movie.title}</h4>
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-4">
                {movie.genres?.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Date & Time */}
              <div className="text-sm">
                <div className="font-medium">{bookingDetails.date}</div>
                <div className="text-gray-500">
                  Regular - {bookingDetails.time}pm
                </div>
              </div>
            </div>

            {/* Selected Seats Display */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Selected Seats
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((seat, index) => (
                    <span
                      key={index}
                      className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {seat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">None selected</span>
                )}
              </div>
            </div>

            {/* Pricing Details */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span>Movie selected</span>
                <span className="font-bold text-right">{movie.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>One ticket price</span>
                <span className="font-bold">${ticketPrice}</span>
              </div>
              <div className="flex justify-between text-sm pb-4 border-b border-gray-300">
                <span>Seat choosed</span>
                <span className="font-bold text-right">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "None selected"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Payment</span>
                <span className="text-blue-700">${totalPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors"
              >
                Checkout now
              </button>
              <button
                onClick={() => setShowMobileModal(false)}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-base hover:bg-gray-50 transition-colors"
              >
                Continue Selecting Seats
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading || !movie) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Progress bar */}
      <div className="flex justify-center items-center pt-4">
        <img src="/Frame 5.png" alt="Progress" />
      </div>

      {/* Main content */}
      <section className="mt-12 mx-4 md:mx-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section - Seat selection */}
          <div className="bg-white rounded-lg p-4 flex-1">
            {/* Movie info */}
            <div className="border border-gray-300 rounded p-4 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-46 h-28 object-cover rounded flex-shrink-0"
                />
                <p className="font-bold text-xl md:text-2xl">{movie.title}</p>
              </div>

              <div className="flex gap-2 mt-4 ml-16">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm md:text-base">
                  Regular - {bookingDetails.time}pm
                </p>
                <button
                  className="bg-blue-700 text-white rounded px-4 md:px-8 py-2 text-sm md:text-base cursor-pointer hover:bg-blue-800 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Change
                </button>
              </div>
            </div>

            {/* Seat selection */}
            <h2 className="font-bold text-xl mt-8 mb-4">Choose Your Seat</h2>
            <div className="text-center my-8">
              <div className="w-full h-1 bg-gray-300 rounded mb-2"></div>
              <p className="text-gray-500">Screen</p>
            </div>

            {/* Seat grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-4 md:gap-12 justify-center">
                {/* Left section */}
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {/* Row labels and left seats */}
                  {rows.map((row) => (
                    <div key={`left-${row}`} className="contents">
                      <span className="flex items-center justify-center w-6 h-6 text-sm font-medium">
                        {row}
                      </span>
                      {[1, 2, 3, 4, 5, 6, 7].map((col) => {
                        const seatId = `${row}${col}`;
                        return (
                          <div
                            key={seatId}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(
                              seatId
                            )}`}
                            onClick={() => handleSeatClick(seatId)}
                          ></div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Column numbers */}
                  <div className="contents">
                    <span></span>
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                      <span
                        key={`left-col-${col}`}
                        className="flex items-center justify-center w-6 h-6 text-xs"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right section */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {/* Right seats */}
                  {rows.map((row) => (
                    <div key={`right-${row}`} className="contents">
                      {[8, 9, 10, 11, 12, 13, 14].map((col) => {
                        const seatId = `${row}${col}`;
                        return (
                          <div
                            key={seatId}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(
                              seatId
                            )}`}
                            onClick={() => handleSeatClick(seatId)}
                          ></div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Column numbers */}
                  <div className="contents">
                    {[8, 9, 10, 11, 12, 13, 14].map((col) => (
                      <span
                        key={`right-col-${col}`}
                        className="flex items-center justify-center w-6 h-6 text-xs"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seating key */}
            <h2 className="font-bold mt-8 mb-4">Seating Key</h2>
            <div className="flex flex-wrap gap-4 md:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <p className="text-sm">Available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-700 rounded"></div>
                <p className="text-sm">Selected</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-400 rounded"></div>
                <p className="text-sm">Love nest</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                <p className="text-sm">Sold</p>
              </div>
            </div>
          </div>

          {/* Right section - Order summary - Desktop Only */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white p-6 md:p-8 rounded-lg sticky top-4">
              <div className="flex justify-center mt-8">
                <img
                  src={bookingDetails.cinemaLogo}
                  alt="cinema logo"
                  className="h-12"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium mt-4 mb-8 text-center">
                {bookingDetails.cinema} Cinema
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <p>Movie selected</p>
                  <p className="font-bold text-right">{movie.title}</p>
                </div>

                <div className="flex justify-between text-sm">
                  <p>{bookingDetails.date}</p>
                  <p className="font-bold">{bookingDetails.time}pm</p>
                </div>

                {bookingDetails.location && (
                  <div className="flex justify-between text-sm">
                    <p>Location</p>
                    <p className="font-bold">{bookingDetails.location}</p>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <p>One ticket price</p>
                  <p className="font-bold">${ticketPrice}</p>
                </div>

                <div className="flex justify-between text-sm pb-4 border-b border-gray-300">
                  <p>Seat choosed</p>
                  <p className="font-bold text-right">
                    {selectedSeats.length > 0
                      ? selectedSeats.join(", ")
                      : "None selected"}
                  </p>
                </div>

                <div className="flex justify-between font-bold text-lg mt-8">
                  <p>Total Payment</p>
                  <p className="text-blue-700">${totalPrice}</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleCheckout}
                  className={`bg-blue-700 w-full text-white rounded px-8 md:px-1 py-2 font-bold text-center text-md transition-colors ${
                    selectedSeats.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-800"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Checkout now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Submit Button */}
      <div className="lg:hidden p-4">
        <button
          onClick={handleCheckout}
          className={`w-full py-4 font-bold rounded-lg transition-all ${
            selectedSeats.length > 0
              ? "text-white bg-blue-700 hover:bg-blue-800"
              : "text-gray-500 bg-gray-300 cursor-not-allowed"
          }`}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length > 0 ? "Checkout now" : "Select seats first"}
        </button>
      </div>

      {/* Mobile Modal */}
      <MobileCheckoutModal />

      {/* Add custom styles for slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Order;
