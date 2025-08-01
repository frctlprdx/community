import CommunitySidebar from "@/components/CommunitySidebar";

export default function CommunityGalleries() {
  return (
    <div className="flex min-h-screen">
      <CommunitySidebar />
      <main className="flex-1 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Galeri Komunitas</h1>
        <p>Kelola galeri dokumentasi komunitas dari berbagai kegiatan.</p>
        {/* Tempatkan komponen grid galeri + tombol tambah foto */}
      </main>
    </div>
  );
}
