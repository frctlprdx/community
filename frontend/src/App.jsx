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
import ApplyEvent from "./pages/ApplyEvent";
import AppliedEventCommunity from "./pages/AppliedEventCommunity";
import { useEffect, useRef, useState } from "react";

// backsound taruh di folder public, panggil pakai path
const backsound = "/neon-dreams-90s-synthwave-344049.mp3";

function App() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.2; // volume 20%

    // Trigger play saat user pertama kali klik
    const handleUserInteraction = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log("Autoplay diblokir:", err));
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  // Toggle mute/unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log("Play error:", err));
    }
  };

  return (
    <Router>
      {/* Audio tag, loop agar musik terus berjalan */}
      <audio ref={audioRef} src={backsound} loop preload="auto" />

      <div className="min-h-screen w-screen">
        {/* Audio Controls - Floating Button */}
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? (
              // Icon speaker off
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.894 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.894l3.489-3.797zm7.924 1.638a.75.75 0 011.06 0 8.5 8.5 0 010 12.02.75.75 0 11-1.06-1.06 7 7 0 000-9.9.75.75 0 010-1.06z" clipRule="evenodd" />
                <path d="M15.657 6.343a.75.75 0 011.06 0 4.5 4.5 0 010 6.364.75.75 0 11-1.06-1.06 3 3 0 000-4.244.75.75 0 010-1.06z" />
                <path d="M3.5 2.5a.5.5 0 00-.5.5v14a.5.5 0 001 0v-14a.5.5 0 00-.5-.5z" />
                <path d="M13.5 2.5L2.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              // Icon speaker on
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.894 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.894l3.489-3.797zm7.924 1.638a.75.75 0 011.06 0 8.5 8.5 0 010 12.02.75.75 0 11-1.06-1.06 7 7 0 000-9.9.75.75 0 010-1.06z" clipRule="evenodd" />
                <path d="M15.657 6.343a.75.75 0 011.06 0 4.5 4.5 0 010 6.364.75.75 0 11-1.06-1.06 3 3 0 000-4.244.75.75 0 010-1.06z" />
              </svg>
            )}
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300"
            title={isPlaying ? 'Pause Musik' : 'Play Musik'}
          >
            {isPlaying ? (
              // Pause icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              // Play icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

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
          <Route path="/appliedevent" element={<ApplyEvent />} />

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
            <Route path="appliedevent" element={<AppliedEventCommunity />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;