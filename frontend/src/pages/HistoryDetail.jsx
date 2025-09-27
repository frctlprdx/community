import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/community/gethistorydetail/${id}`
      );
      setUser(res.data);
    } catch (error) {
      console.error("Gagal ambil detail history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat detail...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Kembali
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold text-xl">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm mt-1">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Riwayat Login */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Riwayat Login
          </h2>

          {user.loginHistories.length === 0 ? (
            <p className="text-gray-500">Belum ada riwayat login.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Waktu Login
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.loginHistories.map((log, index) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(log.loginAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
