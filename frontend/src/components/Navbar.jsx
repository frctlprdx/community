// Navbar.tsx

import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import GuestNav from "./GuestNav";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Saat mount pertama, ambil data dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("user"); // Pastikan sesuai key saat login
      setIsLoggedIn(!!token);
      setUserName(name || "");
    }
  }, []);

  // Reaktif terhadap perubahan localStorage (misalnya logout dari tab lain)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      setUserName(name || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  

  return (
    <div className="w-screen bg-transparent">
      <div className="p-4">
        <nav className="w-full bg-[#8A2BE2]/30 backdrop-blur-md sticky top-0 z-10 md:rounded-full rounded-xl shadow-md">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="text-xl font-bold">
              <Link to="/" className="text-2xl text-[#00FFFF]">
                Kosuco
              </Link>
            </div>

            <div className="space-x-6 md:flex hidden">
              <Link to="/" className="hover:underline text-[#00FFFF]">Home</Link>
              <Link to="/gallery" className="hover:underline text-[#00FFFF]">Galeri</Link>
              {!isLoggedIn && (
                <Link to="/loginregister" className="hover:underline text-[#00FFFF]">Daftar</Link>
              )}
            </div>

            <div className="flex items-center gap-4 relative">
              {isLoggedIn ? (
                <UserNav/>
              ) : (
                <GuestNav/>
              )}

              <button
                aria-label="Menu"
                className="md:hidden block text-2xl text-gray-800 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <IoCloseSharp className="text-[#00FFFF]" />
                ) : (
                  <GiHamburgerMenu className="text-[#00FFFF]" />
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="flex flex-col items-center gap-2 px-6 pb-4 md:hidden">
              <Link to="/" className="hover:underline text-[#00FFFF]">Home</Link>
              <Link to="/gallery" className="hover:underline text-[#00FFFF]">Galeri</Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/loginregister" className="hover:underline text-[#00FFFF]">Daftar</Link>
                  <Link to="/loginregister" className="hover:underline text-[#00FFFF]">Login</Link>
                </>
              ) : (
                <>
                  <span className="text-[#00FFFF]">Hi, {userName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-[#FF6B6B] font-semibold hover:underline"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
