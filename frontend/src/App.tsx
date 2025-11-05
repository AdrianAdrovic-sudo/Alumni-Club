import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import { Routes, Route } from "react-router-dom";
import AlumniDirectory from "./pages/AlumniDirectory";
import Blog from "./pages/Blog.tsx";
import Login from "./pages/Login.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";


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
            <Route path="/Login" element={<Login />} />
            <Route path="/AboutUs" element={<AboutUs/>} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}