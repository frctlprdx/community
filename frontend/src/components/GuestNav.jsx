import { Link } from "react-router-dom";

function GuestNav({ mobile = false, onClose }) {
  if (mobile) {
    // Mobile menu style
    return (
      <Link
        to="/loginregister"
        onClick={onClose}
        className="block w-full text-center px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Login
      </Link>
    );
  }

  // Desktop style
  return (
    <Link
      to="/login"
      className="bg-blue-600 py-2 px-4 rounded-full text-gray-200 font-medium transition duration-200"
    >
      Login
    </Link>
  );
}

export default GuestNav;
