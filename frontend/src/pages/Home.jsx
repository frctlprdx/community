import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CountdownTimer from "../components/countdownTimer";
import Footer from "../components/Footer";

function Home() {
  const [role, setRole] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentCommunityIndex, setCurrentCommunityIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (role === "COMMUNITY" || role === "ADMIN") {
      navigate("/community/members", { replace: true });
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/gallery/get`
        );
        setGalleries(response.data);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/event/get`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/community/get`
        );
        if (Array.isArray(res.data)) {
          setCommunities(res.data.slice(0, 6)); // Ambil 6 komunitas pertama
        }
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    }
    fetchCommunities();
  }, []);

  // Auto slide for gallery
  useEffect(() => {
    if (galleries.length > 0) {
      const interval = setInterval(() => {
        setCurrentGalleryIndex((prev) =>
          prev === galleries.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [galleries.length]);

  // Auto slide for events
  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) =>
          prev === events.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  // Auto slide for communities
  useEffect(() => {
    if (communities.length > 0) {
      const interval = setInterval(() => {
        setCurrentCommunityIndex((prev) =>
          prev === communities.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [communities.length]);

  const nextGallery = () => {
    setCurrentGalleryIndex((prev) =>
      prev === galleries.length - 1 ? 0 : prev + 1
    );
  };

  const prevGallery = () => {
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? galleries.length - 1 : prev - 1
    );
  };

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextCommunity = () => {
    setCurrentCommunityIndex((prev) =>
      prev === communities.length - 1 ? 0 : prev + 1
    );
  };

  const prevCommunity = () => {
    setCurrentCommunityIndex((prev) =>
      prev === 0 ? communities.length - 1 : prev - 1
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center px-6 md:px-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Komunitas Kota <span className="text-blue-600">Semarang</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Satu kota, banyak komunitas. Temukan wadahmu, perluas jaringan, dan
            berkontribusi untuk Semarang yang lebih maju, inklusif, dan penuh
            kolaborasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <button className="cursor-pointer px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Lihat Komunitas
              </button>
            </Link>
            <Link to="/event">
              <button className="cursor-pointer px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200">
                Lihat Agenda
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* Komunitas Section - Judul di kiri, Card di kanan */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Judul dan Deskripsi - Kiri */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Komunitas di Semarang
              </h2>
              <div className="w-24 h-1 bg-blue-600 mb-6"></div>
              <p className="text-lg text-gray-600 mb-8">
                Bergabunglah dengan beragam komunitas di Kota Semarang yang
                aktif dalam berbagai bidang.
              </p>
              {communities.length > 0 && (
                <Link to="/register">
                  <button className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                    Lihat Semua Komunitas
                  </button>
                </Link>
              )}
            </div>

            {/* Card Slider Komunitas - Kanan */}
            <div>
              {communities.length > 0 ? (
                <div className="relative">
                  {(() => {
                    const community = communities[currentCommunityIndex];
                    return (
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                        {/* Community Image */}
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
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
                                  className="w-16 h-16 mx-auto mb-2 opacity-80"
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
                                <p className="text-lg font-semibold opacity-90">
                                  {community.name}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Category Badge */}
                          {community.category && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                                {community.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-semibold text-xl text-gray-900 mb-4">
                            {community.name}
                          </h3>

                          {/* Community Details */}
                          <div className="space-y-3 mb-4">
                            {/* Member Count */}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                              </div>
                              <span>
                                <span className="font-semibold text-blue-600">
                                  {community.memberCount || 0}
                                </span>{" "}
                                Member
                              </span>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span>
                                Dibuat: {formatDate(community.createdAt)}
                              </span>
                            </div>

                            {/* Social Link */}
                            {community.socialLink && (
                              <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                                <a
                                  href={community.socialLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium truncate"
                                >
                                  Media Sosial
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Community Creator Info */}
                          {community.email && (
                            <div className="p-3 bg-gray-50 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-3 h-3 text-white"
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
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  Kontak Pengelola
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p className="truncate">
                                  <span className="font-medium">Email:</span>{" "}
                                  {community.email}
                                </p>
                                {community.phone_number && (
                                  <p>
                                    <span className="font-medium">
                                      WhatsApp:
                                    </span>{" "}
                                    {community.phone_number}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Navigation */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {currentCommunityIndex + 1} dari{" "}
                              {communities.length}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={prevCommunity}
                                className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              >
                                <svg
                                  className="w-4 h-4"
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
                              </button>
                              <button
                                onClick={nextCommunity}
                                className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-gray-400 mb-4 text-4xl">👥</div>
                  <p className="text-gray-500 mb-4">
                    Belum ada komunitas terdaftar
                  </p>
                  <Link to="/register-community">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm">
                      Daftarkan Komunitas Pertama
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Galeri Komunitas - Card di kiri, Judul di kanan */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Card Slider - Kiri */}
            <div className="order-2 md:order-1">
              {galleries.length > 0 ? (
                <div className="relative">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                    <img
                      src={galleries[currentGalleryIndex].imageUrl}
                      alt={galleries[currentGalleryIndex].name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">
                        {galleries[currentGalleryIndex].title}
                      </h3>

                      {/* Community Name Badge */}
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                        {galleries[currentGalleryIndex].communityName}
                      </div>

                      {/* Upload Date */}
                      <p className="text-sm text-gray-500 mb-4">
                        Diunggah:{" "}
                        {new Date(
                          galleries[currentGalleryIndex].uploadedAt
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          {currentGalleryIndex + 1} dari {galleries.length}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={prevGallery}
                            className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                          <button
                            onClick={nextGallery}
                            className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-gray-400 mb-4 text-4xl">📸</div>
                  <p className="text-gray-500">Galeri akan segera hadir...</p>
                </div>
              )}
            </div>

            {/* Judul dan Deskripsi - Kanan */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Kegiatan Komunitas
              </h2>
              <div className="w-24 h-1 bg-blue-600 mb-6"></div>
              <p className="text-lg text-gray-600 mb-8">
                Momen-momen kolaborasi dari komunitas di Semarang yang penuh
                inspirasi.
              </p>
              {galleries.length > 0 && (
                <Link to="/gallery">
                  <button className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                    Lihat Semua Galeri
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Agenda Komunitas - Judul di kiri, Card di kanan */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Judul dan Deskripsi - Kiri */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Agenda Komunitas
              </h2>
              <div className="w-24 h-1 bg-blue-600 mb-6"></div>
              <p className="text-lg text-gray-600 mb-8">
                Jangan lewatkan agenda komunitas di Kota Semarang. Bergabunglah
                dalam berbagai kegiatan menarik yang akan memperkaya pengalaman
                dan memperluas jaringan Anda.
              </p>
              {events.length > 0 && (
                <Link to="/event">
                  <button className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                    Lihat Semua Agenda
                  </button>
                </Link>
              )}
            </div>

            {/* Card Slider - Kanan */}
            <div>
              {events.length > 0 ? (
                <div className="relative">
                  {(() => {
                    const event = events[currentEventIndex];
                    const formattedDate = new Date(
                      event.date
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    return (
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100">
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";
                            }}
                          />

                          {/* Event Date Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                              <div className="text-xs font-semibold text-gray-600 text-center">
                                {new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <div className="text-xs text-gray-500 text-center">
                                {new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    month: "short",
                                  }
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Community Badge */}
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                              {event.communityName}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-semibold text-xl text-gray-900 mb-3 line-clamp-2">
                            {event.title}
                          </h3>

                          {/* Event Details */}
                          <div className="space-y-3 mb-4">
                            {/* Date */}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span className="font-medium">
                                {formattedDate}
                              </span>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-gray-500"
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
                              </div>
                              <span>
                                Dibuat:{" "}
                                {new Date(event.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          {event.description && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {event.description}
                              </p>
                            </div>
                          )}

                          {/* Countdown Timer */}
                          <div className="bg-blue-50 rounded-lg p-4 text-center mb-4">
                            <p className="text-sm font-medium text-blue-700 mb-1">
                              Mulai Dalam:
                            </p>
                            <CountdownTimer targetDate={event.date} />
                          </div>

                          {/* Navigation */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {currentEventIndex + 1} dari {events.length}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={prevEvent}
                                className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              >
                                <svg
                                  className="w-4 h-4"
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
                              </button>
                              <button
                                onClick={nextEvent}
                                className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                  <div className="text-gray-400 mb-4 text-4xl">📅</div>
                  <p className="text-gray-500">
                    Belum ada agenda komunitas yang akan datang...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ingin Gabung Komunitas Di Semarang?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Bergabunglah ke Komunitas sesuai dengan minatu dan bakatmu!
          </p>
          <Link to="/register">
            <button className="cursor-pointer px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Daftar Komunitas Sekarang
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
