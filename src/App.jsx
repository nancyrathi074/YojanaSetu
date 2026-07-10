import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FindSchemes from "./pages/FindSchemes";
import Dashboard from "./pages/Dashboard";
import SchemeDetails from "./pages/SchemeDetails";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
      <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schemes" element={<FindSchemes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details" element={<SchemeDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;