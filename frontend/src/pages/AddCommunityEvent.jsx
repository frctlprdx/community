import { useState } from "react";
import { supabase } from "../../supabaseClient"; // Pastikan path ini sesuai dengan struktur project Anda
import axios from "axios";

export default function AddCommunityEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
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
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`; // Simpan di folder 'events'

    const { error } = await supabase.storage
      .from("community-diskominfo")
      .upload(filePath, file);

    if (error) {
      throw new Error("Upload gagal: " + error.message);
    }

    const { data: publicUrl } = supabase.storage
      .from("community-diskominfo")
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdById = localStorage.getItem("id");
      let imageUrl = null;

      // Upload gambar ke Supabase jika ada file yang dipilih
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      }

      // Kirim data ke backend
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/event/post`,
        {
          title,
          description,
          date,
          imageUrl, // Kirim imageUrl bukan FormData
          createdById,
        },
        {
          headers: {
            "Content-Type": "application/json", // Gunakan JSON bukan multipart
          },
        }
      );

      alert("Event berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan event:", error);
      alert(
        "Gagal menambahkan event: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#0e0e1f]/80 p-8 rounded-lg shadow-lg w-full max-w-md border border-purple-500 oxanium-regular">
        <h2 className="text-2xl text-center text-white font-bold mb-6">
          Tambah Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1">Judul</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-black/40 border border-purple-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Deskripsi</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded bg-black/40 border border-purple-500 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Tanggal Event</label>
            <input
              type="date"
              className="w-full p-2 rounded bg-black/40 border border-purple-500 focus:outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Gambar (opsional)
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
              "Simpan Event"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
