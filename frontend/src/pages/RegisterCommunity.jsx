import { useState } from "react";
import { Users, Mail, Phone, Lock, FileText, Camera } from "lucide-react";

export default function RegisterCommunity() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    bio: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Pendaftaran komunitas berhasil! (Demo mode)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add padding top to avoid navbar overlap */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daftarkan Komunitas Anda
            </h1>
            <p className="text-gray-600 text-lg">
              Bergabunglah sebagai penyelenggara komunitas dan kelola member
              dengan mudah
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Komunitas */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Komunitas
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama komunitas"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Komunitas */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Komunitas
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="kontakt@komunitas.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nomor WhatsApp Komunitas */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor WhatsApp Komunitas
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Kata Sandi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Minimal 8 karakter"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Komunitas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Komunitas (Opsional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Jelaskan tentang komunitas Anda, kegiatan yang dilakukan, tujuan, dll..."
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Logo/Foto Komunitas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Logo/Foto Komunitas (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        <label className="cursor-pointer">
                          <span className="text-blue-600 font-medium hover:text-blue-500">
                            Pilih logo baru
                          </span>
                          <input
                            type="file"
                            name="profilePicture"
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                        <p className="mt-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-blue-50 rounded-xl p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Keuntungan Sebagai Komunitas:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Dashboard management komunitas</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Buat dan kelola event</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Analitik dan laporan aktivitas</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Akses eksklusif ke komunitas lain</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md mt-6"
                  >
                    Daftarkan Komunitas
                  </button>

                  {/* Bottom Links */}
                  <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Sudah punya akun?{" "}
                      <a
                        href="/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Masuk
                      </a>
                    </p>
                    <a
                      href="/"
                      className="text-sm text-gray-500 hover:text-gray-700 block"
                    >
                      ← Kembali ke Beranda
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
