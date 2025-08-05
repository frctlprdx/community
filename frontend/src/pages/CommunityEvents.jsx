import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommunityEvents() {
  const [role, setRole] = useState("");
  const [community, setCommunity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("user")
    setRole(storedRole);
    setCommunity(storedName);

    // Jika bukan COMMUNITY, redirect ke home
    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      {role === "COMMUNITY" && (
        <div className="w-full">
          Anggota {community}
        </div>
      )}
    </>
  );
}
