import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";

export default function CommunityEvents() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [community, setCommunity] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id");
    const storedName = localStorage.getItem("user");

    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
      return;
    }

    setRole(storedRole || "");
    setId(storedId || "");
    setCommunity(storedName || "");

    if (storedId) {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/event/get/${storedId}`
          );
          setEvents(res.data);
        } catch (err) {
          console.error("Failed to fetch events:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [navigate]);

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus event ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/event/delete/${eventId}`
      );
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      alert("Gagal menghapus event. Silakan coba lagi.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (role !== "COMMUNITY") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Event <span className="text-blue-600">{community}</span>
              </h1>
              <div className="w-24 h-1 bg-blue-600 mb-4"></div>
              <p className="text-gray-600">
                Kelola dan buat event untuk komunitas Anda
              </p>
            </div>
            <Link
              to="/community/events/add"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tambah Event
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Memuat event...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Belum Ada Event
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Mulai buat event pertama untuk komunitas Anda dan ajak anggota untuk berpartisipasi
            </p>
            <Link
              to="/community/events/add"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Buat Event Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Total Event Komunitas
                    </h2>
                    <p className="text-blue-100">
                      Event yang telah dibuat untuk {community}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{events.length}</div>
                    <div className="text-sm text-blue-100">Event</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";
                      }}
                    />
                    
                    {/* Event Date Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                        <div className="text-xs font-semibold text-gray-600 text-center">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Countdown */}
                    <div className="bg-blue-50 rounded-lg p-4 text-center mb-4">
                      <p className="text-sm font-medium text-blue-700 mb-2">
                        Mulai Dalam:
                      </p>
                      <CountdownTimer targetDate={event.date} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/community/events/edit/${event.id}`}
                        className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Edit Event
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors duration-200"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}