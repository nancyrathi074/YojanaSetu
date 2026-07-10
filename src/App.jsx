import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";

import FindSchemes from "./pages/FindSchemes";
import SchemeDetails from "./pages/SchemeDetails";
import NotFound from "./pages/NotFound";
import "./App.css";


function App(){

return (

<BrowserRouter>

<Navbar />


<Routes>
<Route
path="/dashboard"
element={<Dashboard />}
/>
<Route path="/" element={<Home />} />
<Route path="*" element={<NotFound />} />
<Route path="/schemes" element={<FindSchemes />} />
<Route path="/details" element={<SchemeDetails />} />


</Routes>


</BrowserRouter>

);

}


export default App;