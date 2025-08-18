import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = () => {
  const movieOptions = ["Avengers: End Game", "The Batman", "The Witches"];
  const categoryOptions = ["Action", "Adventure", "Drama"];
  const locationOptions = ["Purwokerto", "Jakarta", "Bandung"];

  const [selectedMovie, setSelectedMovie] = useState(movieOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedLocation, setSelectedLocation] = useState(locationOptions[0]);
  const [selectedRange, setSelectedRange] = useState("Weekly");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const salesData = [300, 500, 350, 250, 320, 220];

  const chartData = {
    labels: months,
    datasets: [
      {
        data: salesData,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "blue",
        tension: 0.5,
        pointBackgroundColor: "blue",
        pointBorderColor: "blue",
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => `$${v}` },
      },
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="p-4 rounded-lg  bg-white">
        <h2 className="text-lg font-bold mb-3">Sales Chart</h2>
        <div className="flex flex-col lg:flex-row gap-2 mb-3">
          <select
            className=" p-2 bg-gray-300 rounded-md"
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            {movieOptions.map((movie) => (
              <option key={movie} value={movie}>
                {movie}
              </option>
            ))}
          </select>
          <select
            className=" p-2 bg-gray-300 rounded-md"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <button className="bg-blue-700 text-white px-3 py-2 rounded-md">
            Filter
          </button>
        </div>
        <p className="mb-2">{selectedMovie}</p>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="p-4 rounded-lg  bg-white">
        <h2 className="text-lg font-bold mb-3">Ticket Sales</h2>
        <div className="flex flex-col lg:flex-row gap-2 mb-3">
          <select
            className=" p-2 bg-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className=" p-2 bg-gray-300 rounded-md"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button className="bg-blue-700 text-white px-3 py-2 rounded-md">
            Filter
          </button>
        </div>
        <p className="mb-2 ">
          {selectedCategory}, {selectedLocation}
        </p>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard