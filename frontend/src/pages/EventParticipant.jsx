import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventParticipants() {
  const { id } = useParams(); // id event
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/getparticipants/${id}`
        );
        setParticipants(res.data.participants || []);
      } catch (err) {
        console.error("Gagal ambil peserta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Tombol kembali */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          ← Kembali
        </button>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20 text-gray-600 animate-pulse">
            Memuat peserta...
          </div>
        ) : (
          <>
            {/* List peserta */}
            <h2 className="text-2xl font-semibold mb-6">
              Peserta Event #{id} ({participants.length})
            </h2>

            {participants.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada peserta</p>
            ) : (
              <ul className="space-y-3">
                {participants.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white shadow rounded-lg px-4 py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      {p.profilePicture ? (
                        <img
                          src={p.profilePicture}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.email}</p>
                        <p className="text-xs text-gray-400">
                          Bergabung: {formatDate(p.joinedAt)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                      ✔ Terdaftar
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
