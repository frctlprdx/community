import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";
import Footer from "../components/Footer";

function Home() {
  const [role, setRole] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (role === "COMMUNITY" || role === "ADMIN") {
      navigate("/community/members", { replace: true });
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get`
        );
        setGalleries(response.data);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/get`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center px-6 md:px-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Komunitas Kota <span className="text-blue-600">Semarang</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Satu kota, banyak komunitas. Temukan wadahmu, perluas jaringan, 
            dan berkontribusi untuk Semarang yang lebih maju, inklusif, 
            dan penuh kolaborasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Daftarkan Komunitas
              </button>
            </Link>
            <Link to="/event">
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200">
                Lihat Agenda
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Tentang Kami
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Diskominfo Kota Semarang mendukung lahirnya komunitas-komunitas 
              kreatif, edukatif, sosial, dan inspiratif. 
              Kami menjadi wadah untuk menghubungkan masyarakat 
              dalam berbagi ide, berkolaborasi, dan menciptakan kegiatan positif 
              bagi kota tercinta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Beragam Komunitas
              </h3>
              <p className="text-gray-600">
                Dari seni, olahraga, teknologi, sosial, hingga lingkungan. 
                Semua ada di sini.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Kolaborasi
              </h3>
              <p className="text-gray-600">
                Ruang bertemu dan bekerja sama antar komunitas 
                untuk menghasilkan dampak nyata.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Fasilitasi & Dukungan
              </h3>
              <p className="text-gray-600">
                Diskominfo hadir untuk mendukung kegiatan komunitas 
                agar berkembang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Komunitas */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Kegiatan Komunitas
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Momen-momen berharga dari komunitas di Semarang
            </p>
          </div>

          {galleries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📸</div>
              <p className="text-gray-500">Galeri akan segera hadir...</p>
            </div>
          )}

          {galleries.length > 6 && (
            <div className="text-center mt-12">
              <Link to="/gallery">
                <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                  Lihat Semua Galeri
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Agenda Komunitas */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Agenda Komunitas
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Jangan lewatkan agenda komunitas di Kota Semarang
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((item) => {
                const formattedDate = new Date(item.date).toLocaleDateString(
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
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {formattedDate}
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                          Mulai Dalam:
                        </p>
                        <CountdownTimer targetDate={item.date} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📅</div>
              <p className="text-gray-500">
                Belum ada agenda komunitas yang akan datang...
              </p>
            </div>
          )}

          {events.length > 3 && (
            <div className="text-center mt-12">
              <Link to="/event">
                <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                  Lihat Semua Agenda
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Punya Komunitas di Semarang?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Daftarkan komunitasmu dan bergabung dengan ratusan komunitas lain 
            untuk menciptakan gerakan positif di Kota Semarang.
          </p>
          <Link to="/register">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Daftarkan Komunitas Sekarang
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
