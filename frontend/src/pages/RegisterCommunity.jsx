import { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Lock,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link,
  Tag,
} from "lucide-react";
import { supabase } from "../../supabase";

export default function RegisterCommunity() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    bio: "",
    profilePicture: null,
    category: "",
    socialLink: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama komunitas wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (
      formData.phone_number &&
      !/^[0-9+\-\s()]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Format nomor telepon tidak valid";
    }

    if (formData.socialLink && !formData.socialLink.startsWith("http")) {
      newErrors.socialLink =
        "Link sosial harus dimulai dengan http:// atau https://";
    }

    return newErrors;
  };

  const uploadProfilePicture = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `profile/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("community-diskominfo")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const imageUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/community-diskominfo/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Gagal mengupload gambar profil");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    setMessage("");
    setIsSuccess(false);

    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      let profilePicture = null;

      // Upload profile picture to Supabase if provided
      if (formData.profilePicture) {
        try {
          profilePicture = await uploadProfilePicture(formData.profilePicture);
        } catch (uploadError) {
          setMessage("Gagal mengupload gambar profil. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }
      }

      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone_number: formData.phone_number.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        profilePicture: profilePicture, // URL gambar dari Supabase
        category: formData.category.trim() || undefined,
        socialLink: formData.socialLink.trim() || undefined,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/registercommunity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Terjadi kesalahan saat mendaftarkan komunitas"
        );
      }

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          bio: "",
          profilePicture: null,
          category: "",
          socialLink: "",
        });

        // Clear file input
        const fileInput = document.querySelector(
          'input[name="profilePicture"]'
        );
        if (fileInput) {
          fileInput.value = "";
        }

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        throw new Error(data.message || "Registrasi komunitas gagal");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setMessage(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else if (error.message.includes("fetch")) {
        setMessage(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        // Try to parse server response errors
        try {
          const errorResponse = await error.response?.json();
          const { message: serverMessage, errors: serverErrors } =
            errorResponse || {};

          setMessage(
            serverMessage ||
              error.message ||
              "Terjadi kesalahan saat mendaftarkan komunitas"
          );

          if (serverErrors) {
            setErrors(serverErrors);
          }
        } catch {
          setMessage(
            error.message ||
              "Terjadi kesalahan tidak terduga. Silakan coba lagi."
          );
        }
      }

      // If there was an uploaded image but registration failed, clean up
      if (formData.profilePicture && profilePicture) {
        try {
          const fileName = profilePicture.split("/community-diskominfo/")[1];
          if (fileName) {
            await supabase.storage
              .from("community-diskominfo")
              .remove([fileName]);
          }
        } catch (cleanupError) {
          console.warn("Failed to cleanup uploaded image:", cleanupError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">{message}</p>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Anda akan diarahkan ke halaman login...
              </p>
            </div>
          )}

          {/* Error Message */}
          {message && !isSuccess && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Komunitas */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Komunitas <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama komunitas"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 ${
                            errors.name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contoh@email.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nomor Telepon */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 ${
                            errors.phone_number
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone_number && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone_number}
                        </p>
                      )}
                    </div>

                    {/* Kata Sandi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kata Sandi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Minimal 8 karakter"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 ${
                            errors.password
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Kategori Komunitas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Komunitas
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Teknologi, Bisnis, Pendidikan, dll."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Link Media Sosial */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Link Media Sosial
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        name="socialLink"
                        value={formData.socialLink}
                        onChange={handleChange}
                        placeholder="https://instagram.com/komunitas-anda"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 ${
                          errors.socialLink
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.socialLink && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.socialLink}
                      </p>
                    )}
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
                        placeholder="Ceritakan tentang komunitas Anda, tujuan, dan aktivitas yang dilakukan..."
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Logo/Foto Profil */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Logo/Foto Profil Komunitas (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        <label className="cursor-pointer">
                          <span className="text-blue-600 font-medium hover:text-blue-500">
                            Pilih logo komunitas
                          </span>
                          <input
                            type="file"
                            name="profilePicture"
                            onChange={handleChange}
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            className="hidden"
                            disabled={isLoading}
                          />
                        </label>
                        <p className="mt-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG, GIF maksimal 10MB
                      </p>
                      {formData.profilePicture && (
                        <div className="mt-4">
                          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              File terpilih: {formData.profilePicture.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || isSuccess}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          {formData.profilePicture
                            ? "Mengupload logo & mendaftar..."
                            : "Mendaftarkan komunitas..."}
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Berhasil Terdaftar!
                        </>
                      ) : (
                        "Daftarkan Komunitas"
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Masuk di sini
                    </a>
                  </p>
                  <a
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 inline-block"
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
  );
}
