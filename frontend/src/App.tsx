import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import { Routes, Route } from "react-router-dom";
import AlumniDirectory from "./pages/AlumniDirectory";
import Blog from "./pages/Blog.tsx";
import Login from "./pages/Login.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import Contact from "./pages/Contact.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Theses from "./pages/Theses.tsx";


export default function App() {
  return (
    <div className="bg-[#324D6B] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full pt-16 pb-32 bg-[#324D6B]">
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/AlumniDirectory" element={<AlumniDirectory />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/AboutUs" element={<AboutUs/>} />
            <Route path="/Contact" element={<Contact/>} />
            <Route path="/Dashboard" element={<Dashboard/>} />
            <Route path="/Theses" element={<Theses/>} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}