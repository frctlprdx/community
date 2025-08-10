import { useEffect, useState } from "react";
import axios from "axios";

export default function AppliedEventCommunity() {
  const [appliedEvents, setAppliedEvents] = useState([]);

  const fetchAppliedEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/community/applied-events`
      );
      setAppliedEvents(res.data);
    } catch (error) {
      console.error("Gagal mengambil data applied events:", error);
    }
  };

  useEffect(() => {
    fetchAppliedEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus pendaftaran ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/community/applied-events/${id}`
      );
      fetchAppliedEvents();
    } catch (error) {
      console.error("Gagal menghapus pendaftaran:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold text-[#00FFFF] mb-4 orbitron-regular">
        Pendaftar Event
      </h2>

      {appliedEvents.length === 0 ? (
        <p className="text-white">Belum ada pendaftar event.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white border-collapse border border-purple-400">
            <thead className="bg-purple-700">
              <tr>
                <th className="p-2 border border-purple-400">No</th>
                <th className="p-2 border border-purple-400">Nama Event</th>
                <th className="p-2 border border-purple-400">Nama Peserta</th>
                <th className="p-2 border border-purple-400">Email</th>
                <th className="p-2 border border-purple-400">No Telp</th>
                <th className="p-2 border border-purple-400">Tanggal Daftar</th>
                <th className="p-2 border border-purple-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {appliedEvents.map((item, index) => (
                <tr key={item.id} className="bg-black/20 text-center oxanium-regular">
                  <td className="p-2 border border-purple-400 text-center">
                    {index + 1}
                  </td>
                  <td className="p-2 border border-purple-400">
                    {item.title || "Event Tanpa Judul"}
                  </td>
                  <td className="p-2 border border-purple-400">
                    {item.user?.name || "-"}
                  </td>
                  <td className="p-2 border border-purple-400">
                    {item.user?.email || "-"}
                  </td>
                  <td className="p-2 border border-purple-400">
                    {item.user?.phone_number ? (
                      <a
                        href={`https://wa.me/${item.user.phone_number.replace(
                          /^0/,
                          "62"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 underline hover:text-cyan-400"
                      >
                        {item.user.phone_number}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border border-purple-400">
                    {item.appliedAt
                      ? new Date(item.appliedAt).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="p-2 border border-purple-400 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
