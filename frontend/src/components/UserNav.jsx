import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";

function UserNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <>
      <button
        aria-label="Profile"
        className="text-2xl text-[#00FFFF] md:block hidden cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <CgProfile />
      </button>

      {dropdownOpen && (
        <div className="absolute top-10 right-0 bg-white shadow-md rounded-md py-2 px-4 z-20 text-sm w-36">
          <button
            onClick={handleLogout}
            className="text-[#FF6B6B] hover:underline oxanium-regular cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default UserNav;
