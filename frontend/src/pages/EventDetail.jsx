import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState(null); // null, 'success', 'error', 'already_registered'
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const navigate = useNavigate();

  // Get user ID - use sessionStorage as fallback
  const userId = localStorage.getItem("id") || sessionStorage.getItem("id");

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching event with ID:", id); // Debug log

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/eventdetail/${id}`
        );

        console.log("Event data received:", res.data); // Debug log
        setEvent(res.data);

        // Check if user is already registered
        if (userId) {
          await checkRegistration(id);
        }
      } catch (error) {
        console.error("❌ Gagal fetch detail event:", error);
        console.error("Error response:", error.response?.data); // Debug log

        if (error.response?.status === 404) {
          setError("Event tidak ditemukan");
        } else if (error.response?.status === 400) {
          setError("ID event tidak valid");
        } else if (error.response?.status === 500) {
          setError("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else if (error.code === "ERR_NETWORK") {
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          setError("Gagal memuat detail event");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(parseInt(id))) {
      fetchEventDetail();
    } else {
      setError("ID event tidak valid");
      setLoading(false);
    }
  }, [id, userId]);

  const checkRegistration = async (eventId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/event/check-registration/${eventId}/${userId}`
      );
      setIsAlreadyRegistered(response.data.isRegistered);
    } catch (error) {
      console.error("Error checking registration:", error);
      // Don't set error state here, as this is not critical
    }
  };

  const handleJoinEvent = async () => {
    if (!userId) {
      setJoinStatus("error");
      setError("Silakan login terlebih dahulu untuk mendaftar event");
      return;
    }

    if (!event?.id) {
      setJoinStatus("error");
      setError("Data event tidak tersedia");
      return;
    }

    try {
      setJoining(true);
      setJoinStatus(null);
      setError(null);

      console.log("Joining event:", {
        userId: parseInt(userId),
        eventId: parseInt(id),
      }); // Debug log

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/event/join`,
        {
          userId: parseInt(userId),
          eventId: parseInt(id),
        }
      );

      console.log("Join response:", response.data); // Debug log

      if (response.data.success) {
        setJoinStatus("success");
        setIsAlreadyRegistered(true);
        // Update participant count locally if available
        setEvent((prev) => ({
          ...prev,
          participantCount: prev.participantCount
            ? prev.participantCount + 1
            : 1,
        }));
      }
    } catch (error) {
      console.error("❌ Gagal daftar event:", error);
      console.error("Error response:", error.response?.data); // Debug log

      if (error.response?.status === 409) {
        setJoinStatus("already_registered");
        setIsAlreadyRegistered(true);
      } else if (error.response?.status === 404) {
        setJoinStatus("error");
        setError("Event atau user tidak ditemukan");
      } else if (error.response?.status === 400) {
        setJoinStatus("error");
        setError("Data yang dikirim tidak valid");
      } else if (error.code === "ERR_NETWORK") {
        setJoinStatus("error");
        setError(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        setJoinStatus("error");
        setError(error.response?.data?.message || "Gagal mendaftar event");
      }
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat detail event...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
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
                Event yang Anda cari mungkin tidak tersedia atau telah dihapus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/allevents"
                  className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Kembali ke Semua Event
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Event tidak ditemukan</p>
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
            to="/allevents"
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
            Kembali ke Semua Event
          </Link>
        </div>

        {/* Registration Status Messages */}
        {joinStatus && (
          <div className="mb-6">
            {joinStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-green-800 font-medium">
                    Berhasil mendaftar event!
                  </p>
                </div>
              </div>
            )}
            {joinStatus === "already_registered" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-3"
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
                  <p className="text-yellow-800 font-medium">
                    Anda sudah terdaftar di event ini
                  </p>
                </div>
              </div>
            )}
            {joinStatus === "error" && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-3"
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
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Event Detail Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Event Image/Header */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-purple-500 to-pink-600 relative">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}

            <div
              className="w-full h-full flex items-center justify-center"
              style={{ display: event.imageUrl ? "none" : "flex" }}
            >
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
                    d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM6 7h12l1 9H5l1-9z"
                  />
                </svg>
                <h2 className="text-3xl font-bold opacity-90">{event.title}</h2>
              </div>
            </div>

            {/* Registration Status Badge */}
            {isAlreadyRegistered && (
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Terdaftar
                </span>
              </div>
            )}
          </div>

          {/* Event Content */}
          <div className="p-8">
            {/* Title and Basic Info */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-gray-600">
                {/* Date */}
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
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
                  <span>{formatDate(event.date)}</span>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
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
                    <span>{event.location}</span>
                  </div>
                )}

                {/* Organizer */}
                {event.organizerName && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
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
                    <span>Oleh {event.organizerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Participants */}
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {event.participantCount || 0}
                </div>
                <div className="text-sm text-gray-600">Peserta</div>
              </div>

              {/* Max Participants */}
              {event.maxParticipants && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {event.maxParticipants}
                  </div>
                  <div className="text-sm text-gray-600">Maks. Peserta</div>
                </div>
              )}

              {/* Price */}
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {event.price
                    ? `Rp ${event.price.toLocaleString("id-ID")}`
                    : "Gratis"}
                </div>
                <div className="text-sm text-gray-600">Harga</div>
              </div>

              {/* Category */}
              {event.category && (
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600 truncate">
                    {event.category}
                  </div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Deskripsi Event
              </h3>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {event.description ? (
                  <div className="whitespace-pre-wrap">{event.description}</div>
                ) : (
                  <p className="text-gray-500 italic">
                    Tidak ada deskripsi tersedia untuk event ini.
                  </p>
                )}
              </div>
            </div>

            {/* Requirements */}
            {event.requirements && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Persyaratan
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {event.requirements}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(event.contactEmail || event.contactPhone) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Kontak Penyelenggara
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {event.contactEmail && (
                    <a
                      href={`mailto:${event.contactEmail}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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
                      {event.contactEmail}
                    </a>
                  )}

                  {event.contactPhone && (
                    <a
                      href={`tel:${event.contactPhone}`}
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors"
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
                      {event.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {!isAlreadyRegistered ? (
                  <button
                    onClick={handleJoinEvent}
                    disabled={
                      joining ||
                      (event.maxParticipants &&
                        event.participantCount >= event.maxParticipants)
                    }
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                      joining
                        ? "bg-gray-400 cursor-not-allowed"
                        : event.maxParticipants &&
                          event.participantCount >= event.maxParticipants
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {joining ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Mendaftar...
                      </div>
                    ) : event.maxParticipants &&
                      event.participantCount >= event.maxParticipants ? (
                      "Event Penuh"
                    ) : (
                      "Daftar Event"
                    )}
                  </button>
                ) : (
                  <div className="flex-1 px-6 py-3 rounded-lg font-semibold text-green-700 bg-green-100 border border-green-300 text-center">
                    ✓ Anda sudah terdaftar
                  </div>
                )}

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link berhasil disalin!");
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Bagikan
                </button>
              </div>

              {!userId && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <svg
                      className="w-4 h-4 inline mr-1"
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
                    Silakan{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      login
                    </Link>{" "}
                    terlebih dahulu untuk mendaftar event ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Event Timeline */}
          {(event.startDate || event.endDate) && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Timeline Event
              </h3>
              <div className="space-y-3">
                {event.startDate && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Mulai: {formatDate(event.startDate)}</span>
                  </div>
                )}
                {event.endDate && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Selesai: {formatDate(event.endDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Registration Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Info Pendaftaran
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-semibold ${
                    isAlreadyRegistered
                      ? "text-green-600"
                      : event.maxParticipants &&
                        event.participantCount >= event.maxParticipants
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {isAlreadyRegistered
                    ? "Terdaftar"
                    : event.maxParticipants &&
                      event.participantCount >= event.maxParticipants
                    ? "Penuh"
                    : "Tersedia"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Peserta:</span>
                <span className="font-semibold">
                  {event.participantCount || 0}
                  {event.maxParticipants ? ` / ${event.maxParticipants}` : ""}
                </span>
              </div>
              {event.registrationDeadline && (
                <div className="flex justify-between">
                  <span>Batas Daftar:</span>
                  <span className="font-semibold text-red-600">
                    {formatDate(event.registrationDeadline)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
