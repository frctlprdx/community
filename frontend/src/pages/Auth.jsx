import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
  });

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    });
  };

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
      if (!isLogin) {
        if (formData.role === "MEMBER") {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
            {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone_number: formData.phone_number,
              role: formData.role,
            }
          );
          alert("Pendaftaran berhasil! Silakan login.");
          setIsLogin(true);
        } else if (formData.role === "COMMUNITY") {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/community/create`,
            {
              name: formData.name,
              email: formData.email,
              phone_number: formData.phone_number,
              password: formData.password,
            }
          );
          alert("Community registration successful! Please login.");
          setIsLogin(true);
        }
      } else {
        // LOGIN
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
          {
            email: formData.email,
            password: formData.password,
            
          }
        );

        const { user } = res.data;

        // Simpan ke localStorage
        localStorage.setItem("role", user.role);
        localStorage.setItem("id", user.id);
        localStorage.setItem("user", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("phone_number", user.phone_number);

        alert("Login berhasil!");

        // Redirect sesuai role
        redirectByRole(user.role);
        setTimeout(() => navigate(0), 100); // mini refresh
      }
    } catch (err) {
      console.error("Gagal:", err.response?.data || err.message);
      alert("Terjadi kesalahan saat submit.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white px-4">
      <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 orbitron-regular">
          {isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}
        </h2>

        <form className="space-y-4 oxanium-regular" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Lengkap / Komunitas"
                className="w-full p-2 rounded bg-white/20 placeholder-white focus:outline-none"
                required
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="COMMUNITY">Community</option>
                <option value="ADMIN">Admin</option>
              </select>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 rounded bg-white/20 placeholder-white focus:outline-none"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 rounded bg-white/20 placeholder-white focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Kata Sandi"
            className="w-full p-2 rounded bg-white/20 placeholder-white focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#00FFFF] text-black py-2 rounded font-semibold hover:bg-cyan-300 transition orbitron-regular"
          >
            {isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center oxanium-regular">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={handleSwitch}
            className="text-[#00FFFF] hover:underline"
          >
            {isLogin ? "Daftar" : "Masuk"}
          </button>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm hover:underline text-gray-300 oxanium-regular">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
