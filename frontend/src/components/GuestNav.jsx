import { Link } from "react-router-dom";

function GuestNav() {
  return (
    <Link
      to="/loginregister"
      className="md:block hidden hover:underline text-[#00FFFF] oxanium-regular"
    >
      Login
    </Link>
  );
}

export default GuestNav;
