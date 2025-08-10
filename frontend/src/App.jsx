import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import CommunityLayout from "./layouts/CommunityLayouts";
import CommunityEvents from "./pages/CommunityEvents";
import CommunityGalleries from "./pages/CommunityGalleries";
import CommunityMembers from "./pages/CommunityMember";
import AddCommunityEvent from "./pages/AddCommunityEvent";
import EditEvent from "./pages/EditEvent";
import AllEvents from "./pages/AllEvents";
import AddCommunityGallery from "./pages/AddCommunityGallery";
import EditCommunityGallery from "./pages/EditCommunityGallery";
import LoginHistory from "./pages/LoginHistory";
import { useEffect, useRef } from "react";

// backsound taruh di folder public, panggil pakai path
const backsound = "/neon-dreams-90s-synthwave-344049.mp3";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.0; // volume 20%

    // Trigger play saat user pertama kali klik
    const handleUserInteraction = () => {
      audio.play().catch((err) => console.log("Autoplay diblokir:", err));
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  return (
    <Router>
      {/* Audio tag, loop agar musik terus berjalan */}
      <audio ref={audioRef} src={backsound} loop preload="auto" />

      <div className="min-h-screen w-screen">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event" element={<AllEvents />} />
          <Route path="/loginregister" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/community" element={<CommunityLayout />}>
            <Route path="events" element={<CommunityEvents />} />
            <Route path="events/add" element={<AddCommunityEvent />} />
            <Route path="galleries/add" element={<AddCommunityGallery />} />
            <Route path="events/edit/:eventId" element={<EditEvent />} />
            <Route
              path="gallery/edit/:galleryId"
              element={<EditCommunityGallery />}
            />
            <Route path="galleries" element={<CommunityGalleries />} />
            <Route path="members" element={<CommunityMembers />} />
            <Route path="historylogin" element={<LoginHistory />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
