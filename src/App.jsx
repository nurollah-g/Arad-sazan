import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AboutUs from "./Aboutus";
import OurWork from "./Ourwork";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/OurWork" element={<OurWork />} />
      </Routes>
    </Router>
  );
}

export default App;
