import { useEffect, useState } from "react";

function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Function to format date from uploadedAt
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
            Galeri Komunitas
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Dokumentasi momen berharga dari berbagai komunitas di Kota Semarang
          </p>
        </div>

        {/* Gallery Grid */}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                  {/* Community Badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {item.communityName}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Upload Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    <span>{formatDate(item.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📸</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Galeri Kosong
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Belum ada foto yang tersedia saat ini. Silakan kembali lagi nanti
              untuk melihat galeri terbaru.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
