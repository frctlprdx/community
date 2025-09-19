import { CgProfile } from "react-icons/cg";
import { useState, useEffect, useRef } from "react";

function UserNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        aria-label="Profile"
        className="text-2xl text-gray-700 hover:text-blue-600 transition md:block hidden cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <CgProfile />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-10 right-0 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-40 z-20">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 transition font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserNav;
