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
    <section className="min-h-screen bg-white p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Galeri Komunitas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
