import { Outlet } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar";

export default function CommunityLayout() {
  return (
    <>
      <CommunitySidebar />
      <main className="min-h-screen flex-1 p-6 pt-20 text-white relative z-0 bg-gradient-to-br from-[#bg-[#0F0F0F]] via-[#bg-[#0F0F0F]] to-[#8A2BE2]">
        <Outlet />
      </main>
    </>
  );
}
