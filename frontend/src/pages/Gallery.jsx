function Gallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      title: "Kegiatan Komunitas 1",
      date: "10 Juli 2025",
    },
    {
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      title: "Workshop Coding",
      date: "12 Juli 2025",
    },
    {
      src: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf61",
      title: "Gathering Outdoor",
      date: "15 Juli 2025",
    },
    {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692",
      title: "Pelatihan UI/UX",
      date: "18 Juli 2025",
    },
    {
      src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      title: "Hackathon Internal",
      date: "20 Juli 2025",
    },
    {
      src: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf61",
      title: "Nobar Bareng",
      date: "22 Juli 2025",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#bg-[#0F0F0F]] via-[#bg-[#0F0F0F]] to-[#24243e] text-white py-12 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#FF00FF] oxanium-regular">
        Galeri Komunitas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 audiowide-regular">
        {images.map((item, index) => (
          <div
            key={index}
            className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 border border-pink-500 hover:scale-105"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-64 object-cover brightness-90 hover:brightness-110 transition-all duration-300"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-cyan-300">{item.title}</h3>
              <p className="text-sm text-purple-400">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
