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
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Belum Ada Event
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Mulai buat event pertama untuk komunitas Anda dan ajak anggota
              untuk berpartisipasi
            </p>
            <Link
              to="/community/events/add"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              Buat Event Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() =>
                  navigate(`/community/eventsparticipants/${event.id}`)
                }
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
