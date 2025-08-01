import CommunitySidebar from "../components/CommunitySidebar";

export default function CommunityMembers() {
  return (
    <div className="flex min-h-screen">
      <CommunitySidebar />
      <main className="flex-1 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Anggota Komunitas</h1>
        <p>Daftar dan manajemen anggota komunitas akan ditampilkan di sini.</p>
        {/* Tempatkan komponen tabel atau form CRUD di sini */}
      </main>
    </div>
  );
}
