import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

function UserNav() {
  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        aria-label="Profile"
        className="text-2xl text-gray-700 hover:text-blue-600 transition md:block hidden cursor-pointer"
      >
        <Link to="/profile">
          <CgProfile />
        </Link>
      </button>
    </div>
  );
}

export default UserNav;
