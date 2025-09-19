import { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import logo from "../assets/logo ksc revisi.png";
import GuestNav from "./GuestNav";
import UserNav from "./UserNav";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const baseMenu = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Galeri" },
    { to: "/event", label: "Events" },
    { to: "/register", label: "Gabung" }, // ubah daftar -> gabung
  ];

  return (
    <>
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 mt-3 bg-white/80 backdrop-blur-md shadow-lg sm:rounded-full rounded-lg">
          <nav className="flex justify-between items-center px-6 py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-2xl font-bold">
                Komunitas Kota Semarang
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {baseMenu.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth navigation */}
              {isLoggedIn ? <UserNav /> : <GuestNav />}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition"
            >
              {isOpen ? <IoCloseSharp /> : <GiHamburgerMenu />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Content */}
          <div className="absolute top-20 left-3 right-3 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="flex flex-col py-4">
              {baseMenu.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition"
                >
                  {item.label}
                </Link>
              ))}

              <div className="px-6 pt-2">
                {isLoggedIn ? (
                  <UserNav mobile onClose={() => setIsOpen(false)} />
                ) : (
                  <GuestNav mobile onClose={() => setIsOpen(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
