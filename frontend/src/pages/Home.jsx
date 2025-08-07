import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";

function Home() {
  const [role, setRole] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (role == "COMMUNITY" || role == "ADMIN") {
      navigate("/community/members", { replace: true });
      return;
    }
  });

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get`
        );
        console.log("DATA DARI API:", response.data); // ⬅️ DEBUG di console
        setGalleries(response.data);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      }
    }

    fetchGallery();
  }, []);

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

  return (
    <div className="w-screen min-h-screen bg-[#0F0F0F] text-[#CCCCCC]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#0F0F0F] text-[#00FFFF]">
        <div className="text-center px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-[0_0_3px_#00FFFF] audiowide-regular">
            Selamat Datang di Komunitas Kami
          </h1>
          <p className="text-lg md:text-xl mb-6 text-[#CCCCCC]">
            Tempat berkumpulnya orang-orang dengan visi dan semangat yang sama.
          </p>
          <button className="cursor-pointer bg-[#8A2BE2] text-[#00FFFF] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#00FFFF] hover:text-[#8A2BE2] transition drop-shadow-[0_0_6px_#8A2BE2] audiowide-regular">
            Gabung Sekarang
          </button>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-16 px-6 md:px-20 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#00FFFF] drop-shadow-[0_0_5px_#00FFFF] oxanium-regular">
            Tentang Kami
          </h2>
          <p className="text-[#AAAAAA] leading-relaxed audiowide-regular">
            Kami adalah komunitas yang fokus pada pengembangan diri, kolaborasi,
            dan berbagi pengetahuan. Di sini, kamu bisa belajar hal baru, ikut
            proyek seru, dan bertemu dengan orang-orang hebat.
          </p>
        </div>
      </section>

      {/* Showcase Preview */}
      <section className="py-16 px-6 md:px-20 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Title */}
            <h2 className="text-3xl font-bold text-[#FF00FF] drop-shadow-[0_0_3px_#FF00FF] oxanium-regular text-center md:text-left md:w-1/3">
              Kegiatan & Karya
            </h2>

            {/* Galleries scrollable */}
            <div className="w-full md:w-2/3 overflow-x-auto">
              <div className="flex gap-6 w-max">
                {galleries.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[250px] rounded-xl overflow-hidden shadow-lg bg-[#1A1A1A] border border-[#8A2BE2] hover:shadow-[0_0_10px_#8A2BE2] transition audiowide-regular"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-xl text-[#00FFFF]">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-20 bg-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Galleries scrollable */}
            <div className="w-full md:w-2/3 overflow-x-auto">
              <div className="flex gap-6 w-max">
                {events.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[250px] rounded-xl overflow-hidden shadow-lg bg-[#1A1A1A] border border-[#8A2BE2] hover:shadow-[0_0_10px_#8A2BE2] transition audiowide-regular"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-xl text-[#00FFFF]">
                        {item.title}
                      </h3>
                      <div className="mt-auto text-center text-2xl font-medium text-yellow-400 space-y-1">
                        <p className="text-sm text-white">Mulai Pada:</p>
                        <CountdownTimer targetDate={item.date} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-[#FF00FF] drop-shadow-[0_0_3px_#FF00FF] oxanium-regular text-center md:text-left md:w-1/3">
              Upcoming Events
            </h2>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-[0_0_10px_#FFFFFF] oxanium-regular">
          Tertarik Bergabung?
        </h2>
        <p className="mb-6 text-lg text-[#EEEEEE] oxanium-regular">
          Mari jadi bagian dari komunitas yang mendukung pertumbuhanmu.
        </p>
        <button className="bg-black text-[#00FFFF] font-semibold px-6 py-3 rounded-full border border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition audiowide-regular">
          Daftar Sekarang
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#AAAAAA] bg-[#1A1A1A] border-t border-[#333] orbitron-regular">
        &copy; {new Date().getFullYear()} Komunitas Kita. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
