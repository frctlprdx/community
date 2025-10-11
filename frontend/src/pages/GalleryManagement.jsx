import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Fungsi format tanggal sederhana
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function GalleryManagement() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const community = "Admin"; // Bisa diganti sesuai konteks dashboard

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setGalleries(data);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  // Fungsi delete
  const handleDelete = async (galleryId) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus post galeri ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/gallery/delete/${galleryId}`
      );
      setGalleries(galleries.filter((post) => post.id !== galleryId));
    } catch (error) {
      console.error("Gagal menghapus galeri:", error);
      alert("Gagal menghapus galeri. Silakan coba lagi.");
    }
  };

  // Modal handler
  const openModal = (post) => setSelectedImage(post);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Galeri <span className="text-blue-600">{community}</span>
              </h1>
              <div className="w-24 h-1 bg-blue-600 mb-4"></div>
              <p className="text-gray-600">
                Kelola galeri foto dan dokumentasi sebagai Admin
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Memuat galeri...</p>
            </div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Belum Ada Post Galeri
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Mulai dokumentasikan kegiatan komunitas Anda dengan membuat post
              galeri pertama
            </p>
            <Link
              to="/community/galleries/add"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Buat Post Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Total Post Galeri
                    </h2>
                    <p className="text-blue-100">
                      Dokumentasi yang telah dibuat oleh semua komunitas yang terdaftar
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{galleries.length}</div>
                    <div className="text-sm text-blue-100">Post</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title || "Gallery Post"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => openModal(post)}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE2Ij5HYWxsZXJ5IEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2">
                      {post.title || "Untitled Post"}
                    </h3>
                    {post.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.description}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Diunggah: {formatDate(post.uploadedAt)}</span>
                    </div>

                    {/* Delete button only */}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                      Hapus Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedImage.title || "Untitled Post"}
                  </h3>
                  {selectedImage.description && (
                    <p className="text-gray-600 mb-3">
                      {selectedImage.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Diunggah: {formatDate(selectedImage.uploadedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
