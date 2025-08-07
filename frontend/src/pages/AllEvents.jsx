import { useEffect, useState } from "react";
import axios from "axios";
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

  const duplicatedEvents = [...events, ...events]; // duplikat agar bisa looping

  return (
    <div className="w-full py-4 px-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-center items-center mb-4 orbitron-regular">
        <h2 className="text-2xl font-bold text-[#FF00FF]">All Events</h2>
      </div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 animate-slide">
          {duplicatedEvents.map((event, index) => (
            <div
              key={index}
              className="min-w-[450px] bg-black/40 border border-purple-500 p-4 rounded shadow oxanium-regular h-128 flex flex-col"
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
              <p className="text-white text-sm mt-1 line-clamp-5 flex-grow mb-5">
                {event.description}
              </p>
              <div className="mt-auto text-center text-2xl font-medium text-yellow-400 space-y-1">
                <p className="text-sm text-white">Mulai Pada:</p>
                <CountdownTimer targetDate={event.date} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
