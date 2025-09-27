import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../supabaseClient";

export default function EditCommunityGallery() {
  const { galleryId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // ✅ tambahin state description
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/getdetail/${galleryId}`
        );
        const gallery = response.data;

        setTitle(gallery.title || "");
        setDescription(gallery.description || ""); // ✅ set description
        setImageUrl(gallery.imageUrl || "");
        setOldImageUrl(gallery.imageUrl || "");
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
        alert("Data galeri tidak ditemukan.");
        navigate("/community/galleries", { replace: true });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchGallery();
  }, [galleryId, navigate]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const removeNewImage = () => {
    setNewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const communityId = localStorage.getItem("id");

    try {
      let updatedImageUrl = imageUrl;

      if (newImage) {
        const ext = newImage.name.split(".").pop();
        const fileName = `galleries/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("community-diskominfo")
          .upload(fileName, newImage);

        if (uploadError) throw uploadError;

        updatedImageUrl = `${
          import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/community-diskominfo/${fileName}`;

        if (oldImageUrl && oldImageUrl.includes("/community-diskominfo/")) {
          const oldPath = oldImageUrl.split("/community-diskominfo/")[1];
          if (oldPath) {
            await supabase.storage
              .from("community-diskominfo")
              .remove([oldPath]);
          }
        }
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/gallery/update/${galleryId}`,
        {
          title,
          description, // ✅ kirim description
          imageUrl: updatedImageUrl,
          communityId: communityId,
        }
      );

      alert("Galeri berhasil diperbarui.");
      navigate("/community/galleries");
    } catch (err) {
      console.error("Gagal update galeri:", err);
      alert("Gagal update galeri. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memuat data galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/community/galleries")}
              className="mr-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Edit <span className="text-blue-600">Galeri</span>
              </h1>
              <div className="w-24 h-1 bg-blue-600"></div>
            </div>
          </div>
          <p className="text-gray-600 ml-14">
            Perbarui informasi galeri komunitas Anda
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Galeri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Masukkan judul galeri..."
                required
              />
            </div>

            {/* ✅ Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Galeri <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Tuliskan deskripsi singkat galeri..."
                required
              />
            </div>

            {/* Current Image Display */}
            {imageUrl && !newImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Saat Ini
                </label>
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Current gallery"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {imageUrl ? "Ganti Gambar (Opsional)" : "Upload Gambar"}
              </label>

              {!newImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0-6l-3 3m3-3l3 3m-3-6V4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-blue-600">
                        Klik untuk upload
                      </span>{" "}
                      atau drag & drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PNG, JPG, JPEG hingga 10MB
                    </p>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="New preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
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
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Gambar baru: {newImage?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/community/galleries")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
