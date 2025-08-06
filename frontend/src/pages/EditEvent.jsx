import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../supabaseClient";
import { Upload, CheckCircle, XCircle } from "lucide-react";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    imageUrl: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/event/eventdetail/${eventId}`
        )
        .then((res) => {
          setForm(res.data);
          setOldImageUrl(res.data.imageUrl);
        })
        .catch((err) => console.error("Gagal mengambil data event:", err));
    }
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = form.imageUrl;

      // Upload gambar baru jika ada
      if (newImage) {
        const fileExt = newImage.name.split(".").pop();
        const fileName = `events/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("community-diskominfo") // Sesuaikan dengan nama bucket Anda
          .upload(fileName, newImage);

        if (error) throw error;

        // URL gambar baru
        imageUrl = `${
          import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/community-diskominfo/${fileName}`;

        // Hapus gambar lama jika ada
        if (oldImageUrl && oldImageUrl.includes("/community-diskominfo/")) {
          const oldPath = oldImageUrl.split("/community-diskominfo/")[1];
          if (oldPath) {
            await supabase.storage
              .from("community-diskominfo")
              .remove([oldPath]);
          }
        }
      }

      // Update event dengan imageUrl yang baru
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/event/update/${eventId}`,
        {
          title: form.title,
          description: form.description,
          date: form.date,
          imageUrl: imageUrl,
        }
      );

      setMessage("Event berhasil diupdate!");
      setTimeout(() => {
        navigate("/community/events");
      }, 1500);
    } catch (err) {
      console.error("Gagal update event:", err);
      setMessage("Gagal update event. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-bold text-[#00FFFF] mb-4">Edit Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preview Gambar */}
        {form.imageUrl && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Preview Gambar
            </label>
            <div className="relative">
              <img
                src={form.imageUrl}
                alt="Event preview"
                className="w-full h-48 object-cover rounded-lg border border-purple-500"
              />
            </div>
          </div>
        )}

        {/* Upload Gambar */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            {form.imageUrl ? "Ganti Gambar Event" : "Upload Gambar Event"}
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-purple-500 rounded-lg hover:border-[#00FFFF] hover:bg-black/20 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-2 text-gray-300">
                <Upload size={20} className="text-[#00FFFF]" />
                <span className="text-sm font-medium">
                  {newImage ? newImage.name : "Pilih gambar baru"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">Judul</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/40 border border-purple-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Deskripsi</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/40 border border-purple-500 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Tanggal Event</label>
          <input
            type="date"
            name="date"
            value={form.date.slice(0, 10)} // format YYYY-MM-DD
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/40 border border-purple-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold px-4 py-2 rounded transition-all duration-200 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-[#00FFFF]"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div className="mt-4">
          <div
            className={`p-4 rounded-lg border ${
              message.includes("berhasil")
                ? "bg-green-900/50 border-green-500 text-green-300"
                : "bg-red-900/50 border-red-500 text-red-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.includes("berhasil") ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <XCircle size={20} className="text-red-400" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}
