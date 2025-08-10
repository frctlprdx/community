import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginHistory() {
  const [role, setRole] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/community/gethistory`
      );
      setHistory(res.data);
    } catch (error) {
      console.error("Gagal mengambil data login history:", error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
      return;
    }

    fetchHistory();
  }, [navigate]);

  return (
    <>
      {role === "COMMUNITY" && (
        <div className="w-full p-4">
          <h2 className="text-2xl font-bold text-[#00FFFF] mb-4 orbitron-regular">
            Login History
          </h2>

          {history.length === 0 ? (
            <p className="text-white">Belum ada history login.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white border-collapse border border-purple-400">
                <thead className="bg-purple-700">
                  <tr>
                    <th className="p-2 border border-purple-400">No</th>
                    <th className="p-2 border border-purple-400">Nama</th>
                    <th className="p-2 border border-purple-400">Email</th>
                    <th className="p-2 border border-purple-400">Role</th>
                    <th className="p-2 border border-purple-400">Login At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-black/20 text-center oxanium-regular"
                    >
                      <td className="p-2 border border-purple-400 text-center">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {item.user?.name || "-"}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {item.user?.email || "-"}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {item.user?.role || "-"}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {new Date(item.loginAt).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
