import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function GalleryDetail() {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryDetail() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get/${id}`
        );
        if (!response.ok) throw new Error("Gagal fetch detail galeri");

        const result = await response.json();
        setGallery(result.data); // ✅ ambil isi dari data.data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat detail galeri...</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Galeri tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Gambar */}
        <img
          src={gallery.imageUrl}
          alt={gallery.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/600x400?text=Image+Not+Found";
          }}
        />

        {/* Judul */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {gallery.title}
        </h1>

        {/* Deskripsi */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {gallery.description || "Tidak ada deskripsi"}
        </p>

        {/* Info tambahan */}
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>📌 {gallery.communityName}</span>
          <span>
            🗓{" "}
            {new Date(gallery.uploadedAt).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tombol kembali */}
        <Link
          to="/gallery"
          className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Kembali ke Galeri
        </Link>
      </div>
    </section>
  );
}

export default GalleryDetail;
