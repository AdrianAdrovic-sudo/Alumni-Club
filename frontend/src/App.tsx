import React from "react";
import Header from "./components/Layout/Header.tsx";
import Footer from "./components/Layout/Footer.tsx";
import Home from "./pages/Home.tsx";
import { Routes, Route } from "react-router-dom";
import AlumniDirectory from "./pages/AlumniDirectory";
import Blog from "./pages/Blog.tsx";
import Login from "./pages/Login.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import Contact from "./pages/Contact.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Theses from "./pages/Theses.tsx";
import Messages from './components/messages/Messages';
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicRoute from "./components/common/PublicRoute";
import AdminRoute from "./components/common/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-[#324D6B] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full pt-16 pb-32 bg-[#324D6B]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/AlumniDirectory" element={<AlumniDirectory />} />
            <Route path="/Blog" element={<Blog />} />
            
            {/* Protect login route - redirect if already authenticated */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Theses" element={<Theses />} />
            <Route path="/messages" element={<Messages />} />

            <Route
              path="/Dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}