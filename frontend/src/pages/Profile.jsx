import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../supabase";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  FileText,
  Camera,
  LogOut,
  Users,
  Link,
  Tag,
} from "lucide-react";

export default function ProfileCommunity() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State baru untuk edit profile
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");

        if (!id) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/getUser/${id}`
        );
        setProfileData(response.data);
        setEditData(response.data);
        setOldImageUrl(response.data.profilePicture || "");
        setRole(role);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/"; // Adjust the path as needed
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData(profileData);
      setNewProfileImage(null);
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const id = localStorage.getItem("id");
      let imageUrl = editData.profilePicture;

      // Upload gambar baru ke Supabase jika ada
      if (newProfileImage) {
        const fileExt = newProfileImage.name.split(".").pop();
        const fileName = `profile/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("community-diskominfo")
          .upload(fileName, newProfileImage);

        if (uploadError) throw uploadError;

        imageUrl = `${
          import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/community-diskominfo/${fileName}`;

        // Hapus gambar lama jika ada
        if (oldImageUrl && oldImageUrl.includes("/community-diskominfo/")) {
          const oldPath = oldImageUrl.split("/community-diskominfo/")[1];
          if (oldPath) {
            try {
              await supabase.storage
                .from("community-diskominfo")
                .remove([oldPath]);
            } catch (deleteError) {
              console.warn("Failed to delete old image:", deleteError);
            }
          }
        }
      }

      // Update data ke API
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/updateUser/${id}`,
        {
          name: editData.name,
          phone_number: editData.phone_number,
          bio: editData.bio,
          socialLink: editData.socialLink,
          profilePicture: imageUrl,
          ...(editData.role === "COMMUNITY" && { category: editData.category }),
        }
      );

      // Update state
      setProfileData({ ...editData, profilePicture: imageUrl });
      setOldImageUrl(imageUrl);
      setNewProfileImage(null);
      setIsEditing(false);

      setMessage("Profil berhasil diperbarui.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage(error.response?.data?.message || "Gagal menyimpan perubahan.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MEMBER":
        return "bg-blue-100 text-blue-800";
      case "COMMUNITY":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 h-32 relative">
            <div className="absolute inset-0 bg-blue-400 bg-opacity-10"></div>
          </div>

          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 relative group">
                {(
                  isEditing
                    ? editData.profilePicture
                    : profileData.profilePicture
                ) ? (
                  <img
                    src={
                      isEditing
                        ? editData.profilePicture
                        : profileData.profilePicture
                    }
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Upload overlay saat editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setNewProfileImage(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Indikator file terpilih */}
              {newProfileImage && (
                <div className="mt-2 text-xs text-green-600 bg-white p-1 rounded shadow">
                  File terpilih: {newProfileImage.name}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profileData.name}
                    </h1>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                        profileData.role
                      )}`}
                    >
                      <Shield className="w-4 h-4 inline mr-1" />
                      {profileData.role}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              message.includes("berhasil")
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center">
              <div className="font-medium">{message}</div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-indigo-600" />
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-semibold text-gray-900">
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div className="w-full">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone_number"
                      value={editData.phone_number}
                      onChange={handleInputChange}
                      className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {profileData.phone_number}
                    </p>
                  )}
                </div>
              </div>

              {profileData.socialLink && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Link className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-500">Social Link</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="url"
                      name="socialLink"
                      value={editData.socialLink || ""}
                      onChange={handleInputChange}
                      className="font-semibold text-indigo-600 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                      placeholder="https://..."
                    />
                  ) : (
                    <a
                      href={profileData.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-600 hover:text-indigo-800 break-all"
                    >
                      {profileData.socialLink}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio & Additional Info - Different for MEMBER and COMMUNITY */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-indigo-600" />
              {profileData.role === "COMMUNITY" ? "Community Details" : "About"}
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Bio</p>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className="text-gray-900 leading-relaxed w-full bg-transparent border border-gray-300 rounded p-2 focus:border-indigo-500 focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 leading-relaxed">
                    {profileData.bio || "No bio available"}
                  </p>
                )}
              </div>

              {/* Community-specific fields */}
              {profileData.role === "COMMUNITY" && (
                <>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Tag className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-500">Category</p>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="category"
                        value={editData.category || ""}
                        onChange={handleInputChange}
                        className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900">
                        {profileData.category}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-500">Member Count</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {profileData.memberCount || 0} Members
                    </p>
                  </div>
                </>
              )}

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500">
                    {profileData.role === "COMMUNITY"
                      ? "Community Since"
                      : "Member Since"}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatDate(profileData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full justify-end mt-4">
          <button
            onClick={handleLogout}
            className="flex justify-center cursor-pointer items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
