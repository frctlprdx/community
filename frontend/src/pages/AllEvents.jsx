import { useEffect, useState } from "react";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/get`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Memuat events...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-30 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Semua Event
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Ikuti berbagai event menarik dari komunitas di Kota Semarang
          </p>
        </div>

        {/* Events */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const formattedDate = new Date(event.date).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-xl text-gray-900 flex-grow">
                        {event.title}
                      </h3>
                      {event.communityName && (
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full shrink-0">
                          {event.communityName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {formattedDate}
                    </p>
                    <p className="text-gray-600 text-sm flex-grow mb-6 line-clamp-4">
                      {event.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-blue-700 mb-1">
                        Mulai Dalam:
                      </p>
                      <CountdownTimer targetDate={event.date} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">📅</div>
            <p className="text-gray-500">Belum ada event yang tersedia...</p>
          </div>
        )}
      </div>
    </section>
  );
}
