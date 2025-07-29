import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="w-screen bg-transparent">
      <div className="p-4">
        <nav className="w-full bg-white/30 backdrop-blur-md sticky top-0 z-10 md:rounded-full rounded-xl shadow-md">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="text-xl font-bold">
              <a href="/" className="text-2xl">
                Kosuco
              </a>
            </div>

            <div className="space-x-6 md:flex hidden">
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/gallery" className="hover:underline">
                Galeri
              </a>
              <a href="/register" className="hover:underline">
                Daftar
              </a>
            </div>

            <div className="flex items-center gap-4">
              {isLogin ? (
                <Link to="/profile" className="md:block hidden text-2xl">
                  <CgProfile />
                </Link>
              ) : (
                <Link
                  to="/loginregister"
                  className="md:block hidden hover:underline"
                >
                  Login
                </Link>
              )}

              {/* Tombol toggle login (hanya untuk testing sementara) */}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="hidden md:block text-sm text-gray-600 hover:underline"
              >
                {isLogin ? "Logout" : "Set Login"}
              </button>

              {/* Tombol burger-menu mobile */}
              <button
                className="md:hidden block text-2xl text-gray-800 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <IoCloseSharp /> : <GiHamburgerMenu />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="flex flex-col items-center gap-2 px-6 pb-4 md:hidden">
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/gallery" className="hover:underline">
                Galeri
              </a>
              <a href="/register" className="hover:underline">
                Daftar
              </a>

              {isLogin ? (
                <a href="/loginregister" className="hover:underline">
                  Login
                </a>
              ) : (
                <a href="/profile" className="">
                  Edit Profile
                </a>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
