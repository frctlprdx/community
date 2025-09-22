import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function CommunityDetail() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState(null); // null, 'success', 'error', 'already_joined'
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);

  // Get user ID from localStorage
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchCommunityDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const decodedName = decodeURIComponent(name);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/community/getdetail/${encodeURIComponent(decodedName)}`
        );
        setCommunity(res.data);

        // Check if user is already a member
        if (userId) {
          await checkMembership(res.data.id);
        }
      } catch (error) {
        console.error("Error fetching community detail:", error);
        setError(error.response?.status === 404 ? "Komunitas tidak ditemukan" : "Gagal memuat detail komunitas");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchCommunityDetail();
    }
  }, [name, userId]);

  const checkMembership = async (communityId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/community/check-membership/${communityId}/${userId}`
      );
      setIsAlreadyMember(response.data.isMember);
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!userId) {
      setJoinStatus('error');
      setError("Silakan login terlebih dahulu untuk bergabung dengan komunitas");
      return;
    }

    if (!community?.id) {
      setJoinStatus('error');
      setError("Data komunitas tidak tersedia");
      return;
    }

    try {
      setIsJoining(true);
      setJoinStatus(null);
      setError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/community/join`,
        {
          userId: parseInt(userId),
          communityId: community.id
        }
      );

      if (response.data.success) {
        setJoinStatus('success');
        setIsAlreadyMember(true);
        // Update member count locally
        setCommunity(prev => ({
          ...prev,
          memberCount: prev.memberCount + 1
        }));
      }
    } catch (error) {
      console.error("Error joining community:", error);
      
      if (error.response?.status === 409) {
        setJoinStatus('already_joined');
        setIsAlreadyMember(true);
      } else if (error.response?.status === 404) {
        setJoinStatus('error');
        setError("Komunitas atau user tidak ditemukan");
      } else {
        setJoinStatus('error');
        setError(error.response?.data?.message || "Gagal bergabung dengan komunitas");
      }
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat detail komunitas...</p>
        </div>
      </div>
    );
  }

  if (error && !community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 mt-20">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{error}</h2>
              <p className="text-gray-600 mb-6">
                Komunitas yang Anda cari mungkin tidak tersedia atau telah dihapus.
              </p>
              <Link
                to="/register"
                className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                Kembali ke Daftar Komunitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 mt-20">
          <Link
            to="/register"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Daftar Komunitas
          </Link>
        </div>

        {/* Join Status Messages */}
        {joinStatus && (
          <div className="mb-6">
            {joinStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">Berhasil bergabung dengan komunitas!</p>
                </div>
              </div>
            )}
            {joinStatus === 'already_joined' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-800 font-medium">Anda sudah menjadi member komunitas ini</p>
                </div>
              </div>
            )}
            {joinStatus === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            {community.profilePicture ? (
              <img
                src={community.profilePicture}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 opacity-80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h2 className="text-3xl font-bold opacity-90">{community.name}</h2>
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            {community.category && (
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold rounded-full">
                  {community.category}
                </span>
              </div>
            )}

            {/* Membership Status Badge */}
            {isAlreadyMember && (
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Member
                </span>
              </div>
            )}
          </div>

          {/* Community Info */}
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {community.name}
              </h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Member</p>
                    <p className="text-xl font-bold text-blue-600">
                      {community.memberCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM6 7h12l1 9H5l1-9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bergabung Sejak</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatDate(community.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kategori</p>
                    <p className="text-lg font-bold text-purple-600">
                      {community.category || "Belum Ditentukan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {community.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Tentang Komunitas
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {community.description}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Kontak Pengelola
                </h3>
                <div className="space-y-4">
                  {community.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a
                          href={`mailto:${community.email}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {community.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {community.phone_number && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <a
                          href={`https://wa.me/${community.phone_number.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          {community.phone_number}
                        </a>
                      </div>
                    </div>
                  )}

                  {!community.email && !community.phone_number && (
                    <p className="text-gray-500 italic">
                      Informasi kontak tidak tersedia
                    </p>
                  )}
                </div>
              </div>

              {/* Social Media & Additional Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Media Sosial & Info Tambahan
                </h3>
                <div className="space-y-4">
                  {community.socialLink && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Media Sosial</p>
                        <a
                          href={community.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 font-medium hover:underline block truncate"
                        >
                          Kunjungi Halaman
                        </a>
                      </div>
                    </div>
                  )}

                  {community.address && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Alamat</p>
                        <p className="text-gray-700 leading-relaxed">
                          {community.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {!community.socialLink && !community.address && (
                    <p className="text-gray-500 italic">
                      Informasi tambahan tidak tersedia
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Join Community CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">
                  {isAlreadyMember ? "Anda Sudah Tergabung!" : "Tertarik Bergabung?"}
                </h3>
                <p className="mb-6 opacity-90">
                  {isAlreadyMember 
                    ? "Terima kasih sudah menjadi bagian dari komunitas ini"
                    : "Bergabung dengan komunitas ini untuk mendapatkan akses penuh ke semua fitur dan kegiatan"
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!isAlreadyMember && userId && (
                    <button
                      onClick={handleJoinCommunity}
                      disabled={isJoining}
                      className="cursor-pointer inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Bergabung...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Bergabung Sekarang
                        </>
                      )}
                    </button>
                  )}

                  {!userId && (
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Login untuk Bergabung
                    </Link>
                  )}

                  {/* Contact buttons */}
                  {community.email && (
                    <a
                      href={`mailto:${community.email}?subject=Tertarik Bergabung dengan ${community.name}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg shadow hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Kirim Email
                    </a>
                  )}
                  {community.phone_number && (
                    <a
                      href={`https://wa.me/${community.phone_number.replace(/\D/g, '')}?text=Halo, saya tertarik untuk bergabung dengan komunitas ${community.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;