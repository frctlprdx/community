import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";

import axios from "axios";
import { supabase } from "../../supabaseClient";

export default function EditCommunityGallery() {
  const { galleryId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get/${galleryId}`
        );
        const gallery = response.data;

        setTitle(gallery.title || "");
        setImageUrl(gallery.imageUrl || "");
        setOldImageUrl(gallery.imageUrl || "");
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
        alert("Data galeri tidak ditemukan.");
        navigate("/community/gallery", { replace: true });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          imageUrl: updatedImageUrl,
        }
      );

      alert("Galeri berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal update galeri:", err);
      alert("Gagal update galeri. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#0e0e1f]/80 p-8 rounded-lg shadow-lg w-full max-w-lg border border-purple-500 oxanium-regular">
        <h2 className="text-2xl text-center text-white font-bold mb-6">
          Edit Galeri Komunitas
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1">Judul Galeri</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-black/40 border border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {imageUrl ? "Ganti Gambar Galeri" : "Upload Gambar Galeri"}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-purple-500 rounded-lg hover:border-[#00FFFF] hover:bg-black/20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2 text-gray-300">
                  <Upload size={20} className="text-[#00FFFF]" />

                  <span className="text-sm font-medium">
                    {newImage ? newImage.name : "Pilih gambar baru"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {imageUrl && (
            <div>
              <p className="text-sm mb-1">Gambar Saat Ini:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded border border-purple-300"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2 rounded transition duration-300"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
