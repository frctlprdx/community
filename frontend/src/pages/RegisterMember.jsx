import { useState } from "react";
import { User, Mail, Phone, Lock, FileText, Camera } from "lucide-react";

export default function RegisterMember() {
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
    alert("Pendaftaran member berhasil! (Demo mode)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add padding top to avoid navbar overlap */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={40} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Sebagai Member</h1>
            <p className="text-gray-600 text-lg">Bergabunglah dengan komunitas dan dapatkan akses ke berbagai kegiatan menarik</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contoh@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nomor WhatsApp */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor WhatsApp
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

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio (Opsional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Foto Profil */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Foto Profil (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        <label className="cursor-pointer">
                          <span className="text-blue-600 font-medium hover:text-blue-500">
                            Pilih foto baru
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Daftar Member
                    </button>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Masuk di sini
                    </a>
                  </p>
                  <a href="/" className="text-sm text-gray-500 hover:text-gray-700 inline-block">
                    ← Kembali ke Beranda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}