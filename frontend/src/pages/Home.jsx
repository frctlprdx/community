function Home() {
  return (
    <div className="w-screen min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-blue-300 text-white">
        <div className="text-center px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Selamat Datang di Komunitas Kami
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Tempat berkumpulnya orang-orang dengan visi dan semangat yang sama.
          </p>
          <button className="cursor-pointer bg-white text-blue-300 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition">
            Gabung Sekarang
          </button>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami adalah komunitas yang fokus pada pengembangan diri, kolaborasi,
            dan berbagi pengetahuan. Di sini, kamu bisa belajar hal baru, ikut
            proyek seru, dan bertemu dengan orang-orang hebat.
          </p>
        </div>
      </section>

      {/* Showcase Preview */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Kegiatan & Karya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/kegiatan1.jpg"
                alt="Kegiatan 1"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl">Workshop UI/UX</h3>
                <p className="text-gray-600 text-sm">
                  Belajar desain antarmuka bersama mentor profesional.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/kegiatan2.jpg"
                alt="Kegiatan 2"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl">Community Project</h3>
                <p className="text-gray-600 text-sm">
                  Kolaborasi membangun aplikasi untuk masyarakat.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/kegiatan3.jpg"
                alt="Kegiatan 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl">Diskusi Mingguan</h3>
                <p className="text-gray-600 text-sm">
                  Saling berbagi ilmu dan pengalaman setiap pekan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Tertarik Bergabung?</h2>
        <p className="mb-6 text-lg">
          Mari jadi bagian dari komunitas yang mendukung pertumbuhanmu.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
          Daftar Sekarang
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-gray-100">
        &copy; {new Date().getFullYear()} Komunitas Kita. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
