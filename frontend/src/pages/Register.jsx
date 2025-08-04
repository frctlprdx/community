import axios from "axios";
import { useEffect, useState } from "react";

function Register() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  useEffect(() => {
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0F0F0F] via-[#0F0F0F] to-[#8A2BE2]">
      <div className="bg-[#0e0e1f]/80 backdrop-blur-md shadow-2xl rounded-xl w-full max-w-md p-8 border border-purple-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#00FFFF] tracking-wide">
          Formulir Pendaftaran Anggota
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white oxanium-regular"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white oxanium-regular"
            >
              Email Aktif
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-white oxanium-regular"
            >
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div>
            <label
              htmlFor="community"
              className="block text-sm font-medium text-white oxanium-regular"
            >
              Komunitas yang akan didaftarkan
            </label>
            <select
              id="community"
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular focus:outline-none focus:ring-2 focus:ring-pink-500"
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

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-white oxanium-regular"
            >
              Mengapa ingin bergabung?
            </label>
            <textarea
              id="reason"
              rows={4}
              className="w-full mt-1 bg-black/40 border border-purple-500 rounded-lg px-4 py-2 text-white oxanium-regular placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Tulis alasan kamu ingin bergabung..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white oxanium-regular font-bold py-2 rounded-lg transition duration-300 tracking-wide shadow-md"
          >
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
