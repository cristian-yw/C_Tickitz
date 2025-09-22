import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Plus, X } from "lucide-react";
import { apiFetch } from "../utils/apiFetch";

const AdminMovie = () => {
  const emptyForm = {
    title: "",
    genre: "",
    release: "",
    hours: "",
    minutes: "",
    director: "",
    cast: "",
    synopsis: "",
    scheduleDate: "",
    scheduleTime: "08:30",
    cinema: "",
    location: "",
    price: "",
    posterFile: null,
    backdropFile: null,
    thumbnail: "/api/placeholder/60/60",
  };

  const [form, setForm] = useState(emptyForm);
  const [filmList, setFilmList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [pageNow, setPageNow] = useState(1);

  const perPage = 5;
  const totalPage = Math.ceil(filmList.length / perPage);
  const startIdx = (pageNow - 1) * perPage;
  const pageData = filmList.slice(startIdx, startIdx + perPage);

  useEffect(() => {
    apiFetch("/genres").then((data) => setGenres(data || []));
    apiFetch("/cinemas").then((data) => setCinemas(data || []));
    apiFetch("/locations").then((data) => setLocations(data || []));
    apiFetch("/movies/all").then((data) => {
      if (data && Array.isArray(data)) {
        const formatted = data.map((m) => ({
          ...m,
          duration: m.runtime
            ? `${Math.floor(m.runtime / 60)} Hours ${m.runtime % 60} Minute`
            : "0 Hours 0 Minute",
          thumbnail: m.poster_path
            ? `http://localhost:8080/uploads/poster${m.poster_path.replace(
                /\\/g,
                "/"
              )}`
            : "/api/placeholder/60/60",
          backdropThumbnail: m.backdrop_path
            ? `http://localhost:8080/uploads/backdrop${m.backdrop_path.replace(
                /\\/g,
                "/"
              )}`
            : "/api/placeholder/300/150",
          cast: m.casts || [],
          genre: m.genres ? m.genres.join(", ") : "-", // ambil array genres
          release: m.release_date || "-", // ambil release_date
        }));
        setFilmList(formatted);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        [type]: e.target.files[0],
        thumbnail:
          type === "posterFile"
            ? URL.createObjectURL(e.target.files[0])
            : prev.thumbnail,
      }));
    }
  };

  const openModal = (film = null) => {
    if (film) {
      const parts = film.duration?.match(/(\d+)\s*Hours?\s*(\d+)\s*Minute/i);
      setForm({
        title: film.title,
        genre: film.category,
        release: film.release,
        hours: parts ? parts[1] : "",
        minutes: parts ? parts[2] : "",
        director: film.director || "",
        cast: film.cast ? film.cast.map((c) => c.name).join(",") : "",
        synopsis: film.synopsis || "",
        scheduleDate: film.scheduleDate || "",
        scheduleTime: film.scheduleTime || "08:30",
        cinema: film.cinema || "",
        location: film.location || "",
        price: film.price || "",
        posterFile: null,
        backdropFile: null,
        thumbnail: film.thumbnail,
      });
      setSelectedFilm(film);
    } else {
      setForm(emptyForm);
      setSelectedFilm(null);
    }
    setIsModalOpen(true);
  };

  const saveFilm = async () => {
    if (
      !form.title ||
      !form.genre ||
      !form.release ||
      !form.hours ||
      !form.minutes
    ) {
      alert("Lengkapi semua field wajib");
      return;
    }

    const runtime = parseInt(form.hours) * 60 + parseInt(form.minutes);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("overview", form.synopsis);
    formData.append("release_date", form.release);
    formData.append("runtime", runtime);
    formData.append("genres", form.genre);
    if (form.posterFile) formData.append("poster", form.posterFile);
    if (form.backdropFile) formData.append("backdrop", form.backdropFile);
    formData.append(
      "director",
      JSON.stringify({ name: form.director })
    );

    const castArray = form.cast
      .split(",")
      .map((c) => ({ name: c.trim() }));
    formData.append("casts", JSON.stringify(castArray));

    const scheduleObj = [
      {
        cinema_id: parseInt(form.cinema),
        location_id: parseInt(form.location),
        time_id: 1,
        date: form.scheduleDate,
        price: parseInt(form.price),
      },
    ];
    formData.append("schedules", JSON.stringify(scheduleObj));

    try {
      const res = await apiFetch("/admin/movies", {
        method: "POST",
        body: formData,
      });
      console.log(res);

      const durasi = `${form.hours} Hours ${form.minutes} Minute`;
      const dataBaru = {
        ...form,
        duration: durasi,
        id: selectedFilm ? selectedFilm.id : Date.now(),
        cast: castArray,
      };

      if (selectedFilm) {
        setFilmList((prev) =>
          prev.map((f) => (f.id === selectedFilm.id ? dataBaru : f))
        );
      } else {
        setFilmList((prev) => [...prev, dataBaru]);
      }

      setIsModalOpen(false);
      setSelectedFilm(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFilm = (id) => {
    if (window.confirm("Hapus film ini?")) {
      setFilmList((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Film Management</h2>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Film
            </button>
          </div>

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
                    <td className="px-6 py-4">{film.genre}</td>
                    <td className="px-6 py-4">{film.release}</td>
                    <td className="px-6 py-4">{film.duration}</td>
                    <td className="px-6 py-4 flex gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
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
              {/* Poster & Backdrop */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <img
                    src={form.thumbnail}
                    alt="poster"
                    className="w-16 h-16 rounded border object-cover mb-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "posterFile")}
                  />
                  <span className="text-xs text-gray-500 mt-1">Poster</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={
                      form.backdropFile
                        ? URL.createObjectURL(form.backdropFile)
                        : "/api/placeholder/200/60"
                    }
                    alt="backdrop"
                    className="w-32 h-16 rounded border object-cover mb-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        backdropFile: e.target.files[0] || null,
                      }))
                    }
                  />
                  <span className="text-xs text-gray-500 mt-1">Backdrop</span>
                </div>
              </div>

              {/* Title & Genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Release & Duration */}
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

              {/* Director & Cast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cast (comma separated)
                  </label>
                  <input
                    type="text"
                    name="cast"
                    value={form.cast}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
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

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cinema
                  </label>
                  <select
                    name="cinema"
                    value={form.cinema}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Cinema</option>
                    {cinemas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    name="scheduleTime"
                    value={form.scheduleTime}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="scheduleDate"
                    value={form.scheduleDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <button
                onClick={saveFilm}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                {selectedFilm ? "Update Film" : "Save Film"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovie;
