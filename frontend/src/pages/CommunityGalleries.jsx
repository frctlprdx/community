import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommunityGalleries() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    // Jika bukan COMMUNITY, redirect ke home
    if (storedRole !== "COMMUNITY") {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return <>{role === "COMMUNITY" && <div className="text-white">halo</div>}</>;
}
