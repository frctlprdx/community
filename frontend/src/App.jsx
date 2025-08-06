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

function App() {
  return (
    <Router>
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
            <Route path="events/edit/:eventId" element={<EditEvent />} />
            <Route path="galleries" element={<CommunityGalleries />} />
            <Route path="members" element={<CommunityMembers />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
