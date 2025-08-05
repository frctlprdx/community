import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CommunityEvents() {
  const [role, setRole] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  const fetchMembers = async (communityId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/community/get/${communityId}`
      );
      setMembers(res.data);
    } catch (error) {
      console.error("Gagal mengambil data anggota:", error);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("user");
    const communityId = localStorage.getItem("id");

    setRole(storedRole);
    setCommunityName(storedName);

    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
      return;
    }

    if (communityId) {
      fetchMembers(communityId);
    }
  }, [navigate]);

  const handleDelete = async (memberId) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus anggota ini?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/community/member/${memberId}`
      );
      const communityId = localStorage.getItem("id");
      fetchMembers(communityId);
    } catch (error) {
      console.error("Gagal menghapus anggota:", error);
    }
  };

  return (
    <>
      {role === "COMMUNITY" && (
        <div className="w-full p-4">
          <h2 className="text-2xl font-bold text-[#00FFFF] mb-4 orbitron-regular ">
            Anggota {communityName}
          </h2>

          {members.length === 0 ? (
            <p className="text-white">Belum ada anggota terdaftar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white border-collapse border border-purple-400">
                <thead className="bg-purple-700">
                  <tr>
                    <th className="p-2 border border-purple-400">No</th>
                    <th className="p-2 border border-purple-400">Nama</th>
                    <th className="p-2 border border-purple-400">No Telp</th>
                    <th className="p-2 border border-purple-400">
                      Tanggal Join
                    </th>
                    <th className="p-2 border border-purple-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member.id} className="bg-black/20 text-center oxanium-regular">
                      <td className="p-2 border border-purple-400 text-center">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {member.user.name}
                      </td>
                      <td className="p-2 border border-purple-400">
                        {member.user.phone_number ? (
                          <a
                            href={`https://wa.me/${member.user.phone_number.replace(
                              /^0/,
                              "62"
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 underline hover:text-cyan-400"
                          >
                            {member.user.phone_number}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-2 border border-purple-400">
                        {new Date(member.joinedAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-2 border border-purple-400 text-center">
                        <button
                          onClick={() => handleDelete(member.id)}
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
      )}
    </>
  );
}
