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
  const [role, setRole] = useState(false);
  const [show, setShow] = useState(true);

  // Saat mount pertama, ambil data dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("user"); // Pastikan sesuai key saat login
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserName(name || "");
      if (role) {
        setRole(true);
        if (role === "COMMUNITY") {
          setShow(false);
        }
      }
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="w-screen bg-transparent">
      <div className="p-4">
        <nav className="w-full bg-[#8A2BE2]/30 backdrop-blur-md sticky top-0 z-10 md:rounded-full rounded-xl shadow-md">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="text-xl font-bold">
              <Link to="/" className="text-2xl text-[#00FFFF] orbitron-regular">
                Kosuco
              </Link>
            </div>

            {show && (
              <div className="space-x-6 md:flex hidden">
                <Link
                  to="/"
                  className="hover:underline text-[#00FFFF] orbitron-regular"
                >
                  Home
                </Link>
                <Link
                  to="/gallery"
                  className="hover:underline text-[#00FFFF] orbitron-regular"
                >
                  Galeri
                </Link>
                <Link
                  to="/event"
                  className="hover:underline text-[#00FFFF] orbitron-regular"
                >
                  Events
                </Link>
                {!isLoggedIn && (
                  <Link
                    to="/register"
                    className="hover:underline text-[#00FFFF] orbitron-regular"
                  >
                    Daftar
                  </Link>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 relative">
              {role === true ? <UserNav /> : <GuestNav />}

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
              <Link
                to="/"
                className="hover:underline text-[#00FFFF] oxanium-regular"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="hover:underline text-[#00FFFF] oxanium-regular"
              >
                Galeri
              </Link>
              <Link
                to="/event"
                className="hover:underline text-[#00FFFF] oxanium-regular"
              >
                Events
              </Link>
              {role === !true ? (
                <>
                  <Link
                    to="/loginregister"
                    className="hover:underline text-[#00FFFF] oxanium-regular"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
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
