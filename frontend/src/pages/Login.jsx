import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === "COMMUNITY") {
      navigate("/community/members");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { user } = res.data;

      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user.id);
      localStorage.setItem("user", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("phone_number", user.phone_number);

      alert("Login berhasil!");
      redirectByRole(user.role);
      setTimeout(() => navigate(0), 100); // mini refresh
    } catch (err) {
      console.error("Gagal:", err.response?.data || err.message);
      alert("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Masuk ke Akun
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Kata Sandi"
            className="w-full p-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>

        {/* Register Links */}
        <div className="mt-6 text-sm text-center space-y-3">
          <p className="text-gray-600">Belum punya akun?</p>
          <div className="flex flex-col space-y-2">
            <Link
              to="/registermember"
              className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition border border-blue-200"
            >
              Daftar Sebagai Member
            </Link>
            <Link
              to="/registercommunity"
              className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition border border-blue-200"
            >
              Daftar Sebagai Komunitas
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm hover:underline text-gray-600"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}