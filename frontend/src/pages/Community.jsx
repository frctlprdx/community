import { useState } from "react";
import { cn } from "@/lib/utils"; // Jika kamu punya util classNames, ganti dengan classNames biasa kalau tidak.

export default function Community() {
  const [activeTab, setActiveTab] = useState("anggota");

  const renderContent = () => {
    switch (activeTab) {
      case "anggota":
        return <div className="text-white">📋 Daftar Anggota Komunitas</div>;
      case "event":
        return <div className="text-white">📅 Event Komunitas Mendatang</div>;
      case "galeri":
        return <div className="text-white">🖼️ Galeri Kegiatan</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF]">
      {/* Sidebar */}
      <aside className="w-64 bg-black/70 backdrop-blur-lg p-6 text-white shadow-lg hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-center text-pink-400 tracking-wider">
          Community
        </h2>
        <nav className="space-y-4">
          <button
            className={cn(
              "w-full text-left px-4 py-2 rounded-md transition-all font-medium",
              activeTab === "anggota"
                ? "bg-pink-600 text-white"
                : "hover:bg-white/10"
            )}
            onClick={() => setActiveTab("anggota")}
          >
            👥 Anggota
          </button>
          <button
            className={cn(
              "w-full text-left px-4 py-2 rounded-md transition-all font-medium",
              activeTab === "event"
                ? "bg-pink-600 text-white"
                : "hover:bg-white/10"
            )}
            onClick={() => setActiveTab("event")}
          >
            📆 Event
          </button>
          <button
            className={cn(
              "w-full text-left px-4 py-2 rounded-md transition-all font-medium",
              activeTab === "galeri"
                ? "bg-pink-600 text-white"
                : "hover:bg-white/10"
            )}
            onClick={() => setActiveTab("galeri")}
          >
            🖼️ Galeri
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-black/30 backdrop-blur-md">
        <div className="bg-black/40 p-6 rounded-xl shadow-xl border border-purple-500 min-h-[70vh]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
