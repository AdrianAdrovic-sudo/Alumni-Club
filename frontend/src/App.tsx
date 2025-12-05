import React from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import AlumniDirectory from "./pages/AlumniDirectory";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Theses from "./pages/Theses";
import Messages from './components/messages/Messages';
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicRoute from "./components/common/PublicRoute";
import AdminRoute from "./components/common/AdminRoute";
import MyProfile from "./pages/MyProfile";
import MyProfileEdit from "./pages/MyProfileEdit";
import ResetPassword from "./pages/ResetPassword";
import PublicProfile from "./pages/PublicProfile";
import AddBlog from "./pages/AddBlog";
// NEW

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
            <Route path="/AddBlog" element={<AddBlog />} />

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
            <Route path="/MyProfile" element={<MyProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/MyProfileEdit" element={<MyProfileEdit />} />




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