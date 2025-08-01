import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";

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
          <Route path="/admin" element= {<Admin />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
