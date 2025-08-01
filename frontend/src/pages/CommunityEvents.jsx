import CommunitySidebar from "../components/CommunitySidebar";

export default function CommunityEvents() {
  return (
    <div className="flex min-h-screen">
      <CommunitySidebar />
      <main className="flex-1 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Event Komunitas</h1>
        <p>Daftar dan manajemen event komunitas akan ditampilkan di sini.</p>
        {/* Tempatkan komponen kalender atau daftar event CRUD di sini */}
      </main>
    </div>
  );
}
