import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <>
      <AdminSidebar />
      <main className="min-h-screen flex-1 p-6 pt-20 text-white relative z-0 ">
        <Outlet />
      </main>
    </>
  );
}
