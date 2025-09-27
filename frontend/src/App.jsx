import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import GalleryDetail from "./pages/GalleryDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CommunityDetail from "./pages/CommunityDetail";
import RegisterCommunity from "./pages/RegisterCommunity";
import RegisterMember from "./pages/RegisterMember";
import CommunityLayout from "./layouts/CommunityLayouts";
import CommunityEvents from "./pages/CommunityEvents";
import CommunityGalleries from "./pages/CommunityGalleries";
import CommunityMembers from "./pages/CommunityMember";
import AddCommunityEvent from "./pages/AddCommunityEvent";
import EventParticipants from "./pages/EventParticipant";
import EditEvent from "./pages/EditEvent";
import AllEvents from "./pages/AllEvents";
import EventDetail from "./pages/EventDetail";
import AddCommunityGallery from "./pages/AddCommunityGallery";
import EditCommunityGallery from "./pages/EditCommunityGallery";
import LoginHistory from "./pages/LoginHistory";
import HistoryDetail from "./pages/HistoryDetail";
import ApplyEvent from "./pages/ApplyEvent";
import AppliedEventCommunity from "./pages/AppliedEventCommunity";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen">
        <div className="sticky top-5 z-50">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event" element={<AllEvents />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registermember" element={<RegisterMember />} />
          <Route path="/registercommunity" element={<RegisterCommunity />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/appliedevent" element={<ApplyEvent />} />
          <Route path="/profile" element={<Profile />} />

          {/* Route untuk detail komunitas - TAMBAHAN BARU */}
          <Route path="/community/:name" element={<CommunityDetail />} />

          {/* Community dashboard routes */}
          <Route path="/community" element={<CommunityLayout />}>
            <Route path="events" element={<CommunityEvents />} />
            <Route path="events/add" element={<AddCommunityEvent />} />
            <Route path="galleries/add" element={<AddCommunityGallery />} />
            <Route path="events/edit/:eventId" element={<EditEvent />} />
            <Route
              path="gallery/edit/:galleryId"
              element={<EditCommunityGallery />}
            />
            <Route
              path="eventsparticipants/:id"
              element={<EventParticipants />}
            />
            <Route path="galleries" element={<CommunityGalleries />} />
            <Route path="members" element={<CommunityMembers />} />
            <Route path="historylogin" element={<LoginHistory />} />
            <Route path="history/:id" element={<HistoryDetail />} />
            <Route path="appliedevent" element={<AppliedEventCommunity />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
