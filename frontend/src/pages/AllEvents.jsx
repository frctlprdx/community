import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Trash } from "lucide-react";
import CountdownTimer from "../components/countdownTimer";

export default function AllEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/get`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);


  return (
    <div className="w-full py-4 px-8">
      {/* Header */}
      <div className="flex justify-center items-center mb-4 orbitron-regular">
        <h2 className="text-2xl font-bold text-[#FF00FF]">All Events</h2>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="text-white">Belum ada event.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-black/40 border border-purple-500 p-4 rounded shadow oxanium-regular h-128 flex flex-col"
            >
              {/* Gambar */}
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded mb-3 border border-purple-300"
                />
              )}

              {/* Judul */}
              <h3 className="text-lg font-semibold text-[#00FFFF]">
                {event.title}
              </h3>

              {/* Deskripsi dengan batas 3 baris */}
              <p className="text-white text-sm mt-1 line-clamp-5 flex-grow mb-5">
                {event.description}
              </p>

              {/* Countdown */}
              <div className="mt-auto text-center text-2xl font-medium text-yellow-400 space-y-1">
                <p className="text-sm text-white">Mulai Pada:</p>
                <CountdownTimer targetDate={event.date} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
