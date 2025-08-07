import { useEffect, useState } from "react";
import axios from "axios";

function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Memuat galeri...</div>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#24243e] text-white py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#FF00FF] oxanium-regular">
          Galeri Komunitas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 audiowide-regular h-80">
          {galleries.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 border border-pink-500 hover:scale-105"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover brightness-90 hover:brightness-110 transition-all duration-300"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-cyan-300">
                  {item.title}
                </h3>
                <p className="text-sm text-purple-400">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
