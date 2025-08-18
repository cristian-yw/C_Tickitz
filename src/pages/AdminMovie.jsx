import { useState } from "react";
import {
  Search,
  User,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
} from "lucide-react";

const AdminMovie = () => {
  // --- Form State ---
  const emptyForm = {
    title: "",
    category: "",
    release: "",
    duration: "",
    hours: "",
    minutes: "",
    director: "",
    cast: "",
    synopsis: "",
    location: "",
    scheduleDate: "",
    scheduleTime: "08:30am",
    thumbnail: "/api/placeholder/60/60",
  };

  const [form, setForm] = useState(emptyForm);

  // --- Movie Data ---
  const [filmList, setFilmList] = useState([
    {
      id: 1,
      thumbnail: "/Rectangle 119.png",
      title: "Spiderman HomeComing",
      category: "Action, Adventure",
      release: "2023-05-07",
      duration: "2 Hours 15 Minute",
    },
    {
      id: 2,
      thumbnail: "/Rectangle 140.png",
      title: "Black Widow",
      category: "Action, Adventure",
      release: "2023-06-10",
      duration: "2 Hours 15 Minute",
    },
    {
      id: 3,
      thumbnail: "/Rectangle 119.png",
      title: "Spiderman HomeComing",
      category: "Action, Adventure",
      release: "2023-03-02",
      duration: "2 Hours 15 Minute",
    },
    {
      id: 4,
      thumbnail: "/Rectangle 140.png",
      title: "Black Widow",
      category: "Action, Adventure",
      release: "2023-09-01",
      duration: "2 Hours 15 Minute",
    },
    {
      id: 5,
      thumbnail: "/Rectangle 119.png",
      title: "Spiderman HomeComing",
      category: "Action, Adventure",
      release: "2023-08-07",
      duration: "2 Hours 15 Minute",
    },
  ]);

  // --- UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [pageNow, setPageNow] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("November 2023");
  const [dropdownMonth, setDropdownMonth] = useState(false);

  // --- Month Options ---
  const months = [
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
    "July 2023",
    "August 2023",
    "September 2023",
    "October 2023",
    "November 2023",
    "December 2023",
  ];

  // --- Pagination ---
  const perPage = 5;
  const totalPage = Math.ceil(filmList.length / perPage);
  const startIdx = (pageNow - 1) * perPage;
  const pageData = filmList.slice(startIdx, startIdx + perPage);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (film = null) => {
    if (film) {
      const parts = film.duration.match(/(\d+)\s*Hours?\s*(\d+)\s*Minutes?/i);
      setForm({
        title: film.title,
        category: film.category,
        release: film.release,
        hours: parts ? parts[1] : "",
        minutes: parts ? parts[2] : "",
        duration: film.duration,
        director: film.director || "",
        cast: film.cast || "",
        synopsis: film.synopsis || "",
        location: film.location || "",
        scheduleDate: film.scheduleDate || "",
        scheduleTime: film.scheduleTime || "08:30am",
        thumbnail: film.thumbnail,
      });
      setSelectedFilm(film);
    } else {
      setForm(emptyForm);
      setSelectedFilm(null);
    }
    setIsModalOpen(true);
  };

  const saveFilm = () => {
    if (
      !form.title ||
      !form.category ||
      !form.release ||
      !form.hours ||
      !form.minutes
    ) {
      alert("Lengkapi semua field wajib");
      return;
    }

    const durasi = `${form.hours} Hours ${form.minutes} Minute`;
    const dataBaru = { ...form, duration: durasi };

    if (selectedFilm) {
      setFilmList((prev) =>
        prev.map((f) =>
          f.id === selectedFilm.id ? { ...dataBaru, id: f.id } : f
        )
      );
    } else {
      setFilmList((prev) => [...prev, { ...dataBaru, id: Date.now() }]);
    }

    setIsModalOpen(false);
    setSelectedFilm(null);
    setForm(emptyForm);
  };

  const deleteFilm = (id) => {
    if (window.confirm("Hapus film ini?")) {
      setFilmList((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Film Management</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownMonth(!dropdownMonth)}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <span>{selectedMonth}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {dropdownMonth && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                    {months.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMonth(m);
                          setDropdownMonth(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Film</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "No",
                    "Poster",
                    "Title",
                    "Category",
                    "Release",
                    "Duration",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((film, idx) => (
                  <tr key={film.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{startIdx + idx + 1}</td>
                    <td className="px-6 py-4">
                      <img
                        src={film.thumbnail}
                        alt={film.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {film.title}
                    </td>
                    <td className="px-6 py-4">{film.category}</td>
                    <td className="px-6 py-4">{film.release}</td>
                    <td className="px-6 py-4">{film.duration}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="bg-blue-100 text-blue-600 p-2 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(film)}
                          className="bg-purple-100 text-purple-600 p-2 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFilm(film.id)}
                          className="bg-red-100 text-red-600 p-2 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex justify-center gap-2">
            {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPageNow(p)}
                className={`px-3 py-2 rounded ${
                  pageNow === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedFilm ? "Edit Film" : "Add New Film"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2">Poster</label>
                <div className="flex items-center gap-4">
                  <img
                    src={form.thumbnail}
                    alt="poster"
                    className="w-16 h-16 rounded border object-cover"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                    Upload
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Release + Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Release
                  </label>
                  <input
                    type="date"
                    name="release"
                    value={form.release}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="hours"
                      value={form.hours}
                      onChange={handleChange}
                      placeholder="2"
                      min="0"
                      max="5"
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <input
                      type="number"
                      name="minutes"
                      value={form.minutes}
                      onChange={handleChange}
                      placeholder="15"
                      min="0"
                      max="59"
                      className="flex-1 border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Director */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={form.director}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium mb-1">Cast</label>
                <input
                  type="text"
                  name="cast"
                  value={form.cast}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Synopsis
                </label>
                <textarea
                  name="synopsis"
                  value={form.synopsis}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Schedule
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      name="scheduleDate"
                      value={form.scheduleDate}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2"
                    />
                    <span className="text-gray-500">Pick a date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 border-2 border-dashed border-blue-600 rounded flex items-center justify-center text-blue-600">
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                        08:30am
                      </span>
                      <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                        10:30pm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <button
                onClick={saveFilm}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Save Film
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovie;
