import axios from "axios";
import { useEffect, useState } from "react";

function ApplyEvent() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState(""); // ⬅ Tambahan
  const [formData, setFormData] = useState({
    userId: "",
    communityId: "",
    title: "",
  });

  useEffect(() => {
    const localId = localStorage.getItem("id");
    const localName = localStorage.getItem("user");
    const localEmail = localStorage.getItem("email");
    const localNumber = localStorage.getItem("phone_number");

    setId(localId);
    setName(localName);
    setEmail(localEmail);
    setNumber(localNumber);

    setFormData((prev) => ({
      ...prev,
      userId: localId,
    }));

    const fetchCommunities = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/community/get`
        );
        if (Array.isArray(res.data)) {
          setCommunities(res.data);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.communityId || !formData.title) {
      alert("Mohon lengkapi semua data.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/community/applyevent`, {
        userId: parseInt(formData.userId),
        communityId: parseInt(formData.communityId),
        title: formData.title,
      });
      alert("Berhasil mengajukan event!");
      setTitle("");
      setSelectedCommunity("");
    } catch (error) {
      console.error("Gagal mengajukan event:", error);
      alert("Gagal mengajukan event");
    }
  };

  const handleCommunityChange = (e) => {
    const selected = e.target.value;
    setSelectedCommunity(selected);
    setFormData((prev) => ({
      ...prev,
      communityId: selected,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0F0F0F] via-[#0F0F0F] to-[#8A2BE2]">
      <div className="bg-[#0e0e1f]/80 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-8 border border-purple-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#00FFFF] tracking-wide">
          Formulir Pengajuan Event
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-white">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              disabled
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* No WA */}
          <div>
            <label className="block text-sm font-medium text-white">Nomor WhatsApp</label>
            <input
              type="tel"
              value={number}
              disabled
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {/* Komunitas */}
          <div>
            <label className="block text-sm font-medium text-white">Komunitas</label>
            <select
              value={selectedCommunity}
              onChange={handleCommunityChange}
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">-- Pilih Komunitas --</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>

          {/* Judul Event */}
          <div>
            <label className="block text-sm font-medium text-white">Judul Event</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white"
              placeholder="Masukkan judul event"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg transition duration-300"
          >
            Ajukan Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyEvent;
