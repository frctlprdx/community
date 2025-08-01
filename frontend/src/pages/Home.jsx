function Home() {
  return (
    <div className="w-screen min-h-screen bg-[#0F0F0F] text-[#CCCCCC]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#0F0F0F] text-[#00FFFF]">
        <div className="text-center px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-[0_0_3px_#00FFFF]">
            Selamat Datang di Komunitas Kami
          </h1>
          <p className="text-lg md:text-xl mb-6 text-[#CCCCCC]">
            Tempat berkumpulnya orang-orang dengan visi dan semangat yang sama.
          </p>
          <button className="cursor-pointer bg-[#8A2BE2] text-[#00FFFF] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#00FFFF] hover:text-[#8A2BE2] transition drop-shadow-[0_0_6px_#8A2BE2]">
            Gabung Sekarang
          </button>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-16 px-6 md:px-20 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#00FFFF] drop-shadow-[0_0_5px_#00FFFF]">Tentang Kami</h2>
          <p className="text-[#AAAAAA] leading-relaxed">
            Kami adalah komunitas yang fokus pada pengembangan diri, kolaborasi,
            dan berbagi pengetahuan. Di sini, kamu bisa belajar hal baru, ikut
            proyek seru, dan bertemu dengan orang-orang hebat.
          </p>
        </div>
      </section>

      {/* Showcase Preview */}
      <section className="py-16 px-6 md:px-20 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#FF00FF] drop-shadow-[0_0_3px_#FF00FF]">
            Kegiatan & Karya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg bg-[#1A1A1A] border border-[#8A2BE2] hover:shadow-[0_0_10px_#8A2BE2] transition">
                <img
                  src={`/images/kegiatan${i}.jpg`}
                  alt={`Kegiatan ${i}`}
                  className="w-full h-48 object-cover grayscale hover:grayscale-0 transition"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-xl text-[#00FFFF]">Judul Kegiatan {i}</h3>
                  <p className="text-[#CCCCCC] text-sm">
                    Deskripsi singkat tentang kegiatan ke-{i} dalam komunitas.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4 drop-shadow-[0_0_10px_#FFFFFF]">Tertarik Bergabung?</h2>
        <p className="mb-6 text-lg text-[#EEEEEE]">
          Mari jadi bagian dari komunitas yang mendukung pertumbuhanmu.
        </p>
        <button className="bg-black text-[#00FFFF] font-semibold px-6 py-3 rounded-full border border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition">
          Daftar Sekarang
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#AAAAAA] bg-[#1A1A1A] border-t border-[#333]">
        &copy; {new Date().getFullYear()} Komunitas Kita. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
