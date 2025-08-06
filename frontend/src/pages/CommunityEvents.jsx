import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash } from "lucide-react";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";

export default function CommunityEvents() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [community, setCommunity] = useState("");
  const [ events, setEvents] = useState([]);
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
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/event/get/${storedId}`
          );
          setEvents(res.data);
        } catch (err) {
          console.error("Failed to fetch events:", err);
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
      // Refresh daftar event setelah delete
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      alert("Gagal menghapus event. Silakan coba lagi.");
    }
  };

  // Fungsi untuk menghitung sisa hari ke tanggal event
  const getDaysLeft = (eventDate) => {
    const now = new Date();
    const targetDate = new Date(eventDate);

    // Hapus jam/menit/detik supaya beda harinya akurat
    now.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `Dimulai dalam ${diffDays} hari lagi`;
    if (diffDays === 0) return "Event dimulai hari ini!";
    return `Event sudah lewat ${Math.abs(diffDays)} hari yang lalu`;
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4 orbitron-regular">
        <h2 className="text-xl font-bold text-[#00FFFF]">Events {community}</h2>
        <Link
          to="/community/events/add"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-[#00FFFF] font-semibold px-4 py-2 rounded"
        >
          <Plus size={18} /> Add Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="text-white">Belum ada event.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-black/40 border border-purple-500 p-4 rounded shadow oxanium-regular h-128 flex flex-col"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded mb-3 border border-purple-300"
                />
              )}

              <h3 className="text-lg font-semibold text-[#00FFFF]">
                {event.title}
              </h3>

              {/* Deskripsi dibatasi 3 baris */}
              <p className="text-white text-sm mt-1 line-clamp-5 flex-grow mb-5">
                {event.description}
              </p>

              {/* Countdown di bagian bawah */}
              <div className="mt-auto text-center text-2xl font-medium text-yellow-400 space-y-1">
                <p className="text-sm text-white">Mulai Pada:</p>
                <CountdownTimer targetDate={event.date} />
              </div>
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/community/events/edit/${event.id}`}
                  className="w-4/5 inline-block bg-purple-400 text-xl text-center p-4 text-black rounded hover:text-purple-400 hover:bg-gray-900"
                >
                  Edit Event
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="w-1/5 inline-flex items-center justify-center bg-red-600 text-white text-sm p-3 rounded hover:bg-red-700 transition-all cursor-pointer"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
