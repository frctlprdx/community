import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash, Eye } from "lucide-react";
import axios from "axios";

export default function CommunityGalleries() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [community, setCommunity] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("id");
    const storedName = localStorage.getItem("user");

    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
      return;
    }

    setRole(storedRole || "");
    setId(storedId || "");
    setCommunity(storedName || "");

    // Fetch gallery posts
    const fetchGalleries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get`
        );
        setGalleries(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [navigate]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus post ini?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/gallery/delete/${postId}`
      );
      // Refresh daftar gallery setelah delete
      setGalleries(galleries.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Gagal menghapus post:", error);
      alert("Gagal menghapus post. Silakan coba lagi.");
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-white">Loading gallery posts...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4 orbitron-regular">
        <h2 className="text-xl font-bold text-[#00FFFF]">
          Gallery {community}
        </h2>
        <Link
          to="/community/galleries/add"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-[#00FFFF] font-semibold px-4 py-2 rounded"
        >
          <Plus size={18} /> Add Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.length === 0 ? (
          <p className="text-white">Belum ada post di gallery.</p>
        ) : (
          galleries.map((post) => (
            <div
              key={post.id}
              className="bg-black/40 border border-purple-500 p-4 rounded shadow oxanium-regular h-128 flex flex-col"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title || "Gallery Post"}
                  className="w-full h-40 object-cover rounded mb-3 border border-purple-300"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#00FFFF]">
                  {post.title || "Untitled Post"}
                </h3>
              </div>

              {/* Deskripsi dibatasi 5 baris */}
              {post.description && (
                <p className="text-white text-sm mt-1 line-clamp-5 flex-grow mb-3">
                  {post.description}
                </p>
              )}

              {/* Tanggal upload */}
              <div className="mt-auto text-center space-y-1">
                <p className="text-xs text-gray-400">
                  Uploaded: {formatDate(post.uploadedAt)}
                </p>
              </div>

              <div className="mt-2 flex gap-2">
                <Link
                  to={`/community/gallery/edit/${post.id}`}
                  className="flex-1 inline-block bg-purple-400 text-sm text-center p-3 text-black rounded hover:text-purple-400 hover:bg-gray-900 transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="inline-flex items-center justify-center bg-red-600 text-white text-sm p-3 rounded hover:bg-red-700 transition-all cursor-pointer"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
