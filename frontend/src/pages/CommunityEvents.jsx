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

  const handleDelete = async (eventId, e) => {
    e.stopPropagation();
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

  const handleEdit = (eventId, e) => {
    e.stopPropagation();
    navigate(`/community/events/edit/${eventId}`);
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
    <div className="min-h-screen bg-gray-50 py-8">
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
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Belum Ada Event
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Mulai buat event pertama untuk komunitas Anda dan ajak anggota
              untuk berpartisipasi
            </p>
            <Link
              to="/community/events/add"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 cursor-pointer flex flex-col"
              >
                {/* Event Image */}
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Event Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 0 016 0zm6 3a2 2 0 11-4 0 2 0 014 0zM7 10a2 2 0 11-4 0 2 0 014 0z"
                        />
                      </svg>
                      {event.participantCount || 0} peserta
                    </div>
                    {event.price && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        {event.price === 0
                          ? "Gratis"
                          : `Rp ${event.price.toLocaleString("id-ID")}`}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-blue-600 font-medium flex items-center mb-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 9v-4m-4 4h8a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(event.date)}
                  </p>

                  {/* Action buttons - selalu di bawah */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => handleEdit(event.id, e)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 w-1/2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(event.id, e)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 w-1/2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
