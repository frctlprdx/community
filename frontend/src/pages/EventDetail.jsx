import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const userId = localStorage.getItem("id") || sessionStorage.getItem("id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/eventdetail/${id}`
        );
        setEvent(res.data);
        if (userId) checkRegistration(id);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            (err.code === "ERR_NETWORK"
              ? "Tidak dapat terhubung ke server"
              : "Gagal memuat detail event")
        );
      } finally {
        setLoading(false);
      }
    };
    if (id && !isNaN(id)) fetchEvent();
    else {
      setError("ID event tidak valid");
      setLoading(false);
    }
  }, [id, userId]);

  const checkRegistration = async (eventId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/event/check-registration/${eventId}/${userId}`
      );
      setIsAlreadyRegistered(res.data.isRegistered);
    } catch {}
  };

  const handleJoinEvent = async () => {
    if (!userId) {
      setError("Silakan login terlebih dahulu");
      return;
    }
    try {
      setJoining(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/event/join`,
        { userId: parseInt(userId), eventId: parseInt(id) }
      );
      if (res.data.success) {
        setIsAlreadyRegistered(true);
        setEvent((prev) => ({
          ...prev,
          participantCount: (prev.participantCount || 0) + 1,
        }));
        setJoinStatus("success");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setJoinStatus("already_registered");
        setIsAlreadyRegistered(true);
      } else setError(err.response?.data?.message || "Gagal mendaftar");
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Event tidak ditemukan
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Status Message */}
        {joinStatus === "success" && (
          <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
            Berhasil mendaftar event!
          </div>
        )}
        {joinStatus === "already_registered" && (
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded mb-4">
            Anda sudah terdaftar
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-600 relative">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            )}
            {isAlreadyRegistered && (
              <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded">
                Terdaftar
              </span>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="text-gray-600 mb-6">
              <p>{formatDate(event.date)}</p>
              {event.location && <p>📍 {event.location}</p>}
              {event.organizerName && <p>👤 {event.organizerName}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Stat label="Peserta" value={event.participantCount || 0} />
              {event.maxParticipants && (
                <Stat label="Maks." value={event.maxParticipants} />
              )}
              <Stat
                label="Harga"
                value={
                  event.price
                    ? `Rp ${event.price.toLocaleString("id-ID")}`
                    : "Gratis"
                }
              />
              {event.category && (
                <Stat label="Kategori" value={event.category} />
              )}
            </div>

            <Section title="Deskripsi">
              {event.description || "Tidak ada deskripsi"}
            </Section>

            {event.requirements && (
              <Section title="Persyaratan">{event.requirements}</Section>
            )}

            {(event.contactEmail || event.contactPhone) && (
              <Section title="Kontak">
                {event.contactEmail && (
                  <a href={`mailto:${event.contactEmail}`}>
                    {event.contactEmail}
                  </a>
                )}
                <br />
                {event.contactPhone && (
                  <a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a>
                )}
              </Section>
            )}

            <div className="flex gap-4 mt-6">
              {!isAlreadyRegistered ? (
                <button
                  onClick={handleJoinEvent}
                  disabled={
                    joining ||
                    (event.maxParticipants &&
                      event.participantCount >= event.maxParticipants)
                  }
                  className={`flex-1 px-6 py-3 rounded-lg text-white ${
                    joining
                      ? "bg-gray-400"
                      : event.maxParticipants &&
                        event.participantCount >= event.maxParticipants
                      ? "bg-red-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {joining
                    ? "Mendaftar..."
                    : event.maxParticipants &&
                      event.participantCount >= event.maxParticipants
                    ? "Event Penuh"
                    : "Daftar Event"}
                </button>
              ) : (
                <div className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded text-center">
                  ✓ Anda sudah terdaftar
                </div>
              )}

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link berhasil disalin!");
                  }
                }}
                className="px-6 py-3 border rounded-lg"
              >
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-gray-700 whitespace-pre-wrap">{children}</div>
    </div>
  );
}
