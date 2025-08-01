import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  { href: "/community/members", label: "👥 Anggota" },
  { href: "/community/events", label: "📆 Event" },
  { href: "/community/galleries", label: "🖼️ Galeri" },
];

export default function CommunitySidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-black/70 text-white p-6 hidden md:block min-h-screen shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center text-pink-400 tracking-wider">
        Community
      </h2>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <span
              className={`block px-4 py-2 rounded-md font-medium transition-all hover:bg-white/10 ${
                router.pathname === item.href ? "bg-pink-600" : ""
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
