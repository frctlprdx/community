// Navbar.tsx

import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import GuestNav from "./GuestNav";
import logo from "../assets/logo ksc revisi.png";

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
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 pulse-fast">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
              <Link
                to="/"
                className="text-3xl text-[#00FFFF] font-bold orbitron-regular"
              >
                Kosuco
              </Link>
            </div>

            {/* Desktop Nav Links */}
            {show && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-[#00FFFF] orbitron-regular hover:underline hover:opacity-80 transition"
                >
                  Home
                </Link>
                <Link
                  to="/gallery"
                  className="text-[#00FFFF] orbitron-regular hover:underline hover:opacity-80 transition"
                >
                  Galeri
                </Link>
                <Link
                  to="/event"
                  className="text-[#00FFFF] orbitron-regular hover:underline hover:opacity-80 transition"
                >
                  Events
                </Link>
                {!isLoggedIn && (
                  <Link
                    to="/register"
                    className="text-[#00FFFF] orbitron-regular hover:underline hover:opacity-80 transition"
                  >
                    Daftar
                  </Link>
                )}
              </div>
            )}

            {/* Right Side Nav (UserNav / GuestNav) + Hamburger */}
            <div className="flex items-center gap-4 relative">
              {role === true ? <UserNav /> : <GuestNav />}

              {/* Hamburger Menu */}
              <button
                aria-label="Menu"
                className="md:hidden block text-2xl text-[#00FFFF] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <IoCloseSharp /> : <GiHamburgerMenu />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="md:hidden flex flex-col items-center gap-3 px-6 pb-4">
              <Link
                to="/"
                className="text-[#00FFFF] oxanium-regular hover:underline hover:opacity-80 transition"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="text-[#00FFFF] oxanium-regular hover:underline hover:opacity-80 transition"
              >
                Galeri
              </Link>
              <Link
                to="/event"
                className="text-[#00FFFF] oxanium-regular hover:underline hover:opacity-80 transition"
              >
                Events
              </Link>
              {!isLoggedIn ? (
                <Link
                  to="/loginregister"
                  className="text-[#00FFFF] oxanium-regular hover:underline hover:opacity-80 transition"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-[#FF6B6B] font-semibold hover:underline"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
