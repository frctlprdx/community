import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function CommunitySidebar() {
  const [isOpen, setIsOpen] = useState(false); // default terbuka di desktop

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-[#1B1B3A] text-white p-2 rounded mt-22 cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-[calc(100vh-64px)] bg-black w-64 text-white p-6 z-40 transition-transform duration-300 ease-in-out pt-20
        ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <h2 className="text-2xl text-[#00FFFF] font-bold mb-6">Komunitas</h2>
        <nav className="flex flex-col gap-4">
          <Link
            to="/community/members"
            className="hover:bg-[#8A2BE2] p-2 rounded transition duration-200 text-[#00FFFF]"
            onClick={() => setIsOpen(false)}
          >
            Anggota
          </Link>
          <Link
            to="/community/events"
            className="hover:bg-[#8A2BE2] p-2 rounded transition duration-200 text-[#00FFFF]"
            onClick={() => setIsOpen(false)}
          >
            Event
          </Link>
          <Link
            to="/community/galleries"
            className="hover:bg-[#8A2BE2] p-2 rounded transition duration-200 text-[#00FFFF]"
            onClick={() => setIsOpen(false)}
          >
            Galeri
          </Link>
        </nav>
      </aside>

      {/* Spacer untuk geser konten saat sidebar terbuka */}
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"}`} />
    </>
  );
}
