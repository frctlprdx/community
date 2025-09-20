import { useState, useEffect } from "react";
import axios from "axios";
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

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const id = localStorage.getItem("id");

        if (!id) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/getUser/${id}`
        );
        setProfileData(response.data);
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
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileData.name}
                  </h1>
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
              </div>
            </div>
          </div>
        </div>

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
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-semibold text-gray-900">
                    {profileData.phone_number}
                  </p>
                </div>
              </div>
              {profileData.socialLink && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Link className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-500">Social Link</p>
                  </div>
                  <a
                    href={profileData.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-indigo-600 hover:text-indigo-800 break-all"
                  >
                    {profileData.socialLink}
                  </a>
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
                <p className="text-gray-900 leading-relaxed">
                  {profileData.bio || "No bio available"}
                </p>
              </div>

              {/* Community-specific fields */}
              {profileData.role === "COMMUNITY" && (
                <>
                  {profileData.category && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">Category</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {profileData.category}
                      </p>
                    </div>
                  )}

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
