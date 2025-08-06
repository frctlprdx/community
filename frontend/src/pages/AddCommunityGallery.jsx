import { useState } from "react";
import axios from "axios";
import { supabase } from "../../supabaseClient";

export default function AddCommunityGallery() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `galleries/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("community-diskominfo")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error("Upload gagal: " + uploadError.message);
    }

    const { data: publicData } = supabase.storage
      .from("community-diskominfo")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const communityId = parseInt(localStorage.getItem("id")); // Ambil dari localStorage
      if (!communityId) throw new Error("communityId tidak ditemukan.");

      if (!imageFile) {
        alert("Gambar wajib diisi.");
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToSupabase(imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/gallery/post`,
        {
          title,
          imageUrl,
          communityId,
        },
        {
          headers: {
            "Content-Type": "application/json", // Gunakan JSON bukan multipart
          },
        }
      );

      alert("Gallery berhasil ditambahkan!");

      // Reset
      setTitle("");
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Gagal menambahkan gallery:", error);
      alert("Gagal menambahkan gallery: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#0e0e1f]/80 p-8 rounded-lg shadow-lg w-full max-w-md border border-purple-500 oxanium-regular">
        <h2 className="text-2xl text-center text-white font-bold mb-6">
          Tambah Gallery
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1">Judul</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-black/40 border border-purple-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul gambar"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Gambar <span className="text-red-500">*</span>
            </label>

            <div className="relative w-full">
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded cursor-pointer bg-purple-700 hover:bg-purple-800 text-white transition duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0-6l-3 3m3-3l3 3m-3-6V4"
                  />
                </svg>
                <span>{imageFile?.name || "Pilih Gambar"}</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-60 object-cover rounded-lg border border-purple-500 shadow"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed text-white font-bold py-2 rounded transition duration-300 flex items-center justify-center"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              "Simpan Gallery"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
