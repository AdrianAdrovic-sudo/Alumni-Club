import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";
  const isRegularUser = user?.role === "user";

  return (
    <header className="bg-white shadow-lg border-b-[3px] border-[#ffab1f] fixed top-0 w-full z-50">
      <div className="w-full px-5 py-4 flex items-center justify-between md:justify-between">

        {/* LOGO */}
        <div className="flex-shrink-0">
          <a href="/Home">
            <img
              src="/src/assets/akfit.png"
              alt="Logo"
              className="h-10 w-auto"
            />
          </a>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link className="hover:text-[#294a70] hover:font-semibold" to="/Blog">Blog</Link>
          <Link className="hover:text-[#294a70] hover:font-semibold" to="/AlumniDirectory">Alumnisti</Link>
          <Link className="hover:text-[#294a70] hover:font-semibold" to="/AboutUs">O nama</Link>
          <Link className="hover:text-[#294a70] hover:font-semibold" to="/Contact">Kontakt</Link>
          <Link className="hover:text-[#294a70] hover:font-semibold" to="/Theses">Diplomski radovi</Link>
        </nav>

        {/* USER / LOGIN */}
        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[#294a70] font-medium">
                Dobrodošao/la, {user.username}!
              </span>

              {/* Inbox */}
              <Link to="/messages" className="messages-btn">
                Inbox
              </Link>

              {/* MyProfile samo za običnog usera */}
              {
                isRegularUser && (
                  <Link to="/MyProfile" className="profile-btn">
                    <button className="dashboard-btn">MyProfile</button>
                  </Link>
                )
              }

              {/* Admin Dashboard */}
              {
                isAdmin && (
                  <Link to="/Dashboard">
                    <button className="px-4 py-2 border-2 border-[#294a70] text-[#294a70] rounded-full hover:bg-[#eef2ff]">
                      Dashboard
                    </button>
                  </Link>
                )
              }

              <button className="signup-btn" onClick={handleLogout}>
                Odjavi se
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 border-2 border-[#294a70] text-[#294a70] rounded-full hover:bg-[#eef2ff]">
                Prijavi se
              </button>
            </Link>
          )
          }
        </div >

        {/* MOBILE MENU BUTTON */}
        < button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#294a70] ml-auto"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button >
      </div >

      {/* MOBILE DROPDOWN */}
      {
        open && (
          <div className="md:hidden bg-white shadow-xl border-t border-gray-200 animate-slideDown">
            <nav className="flex flex-col p-4 text-gray-600 font-medium gap-3">
              <Link onClick={() => setOpen(false)} className="py-2" to="/Blog">Blog</Link>
              <Link onClick={() => setOpen(false)} className="py-2" to="/AlumniDirectory">Alumnisti</Link>
              <Link onClick={() => setOpen(false)} className="py-2" to="/AboutUs">O nama</Link>
              <Link onClick={() => setOpen(false)} className="py-2" to="/Contact">Kontakt</Link>
              <Link onClick={() => setOpen(false)} className="py-2" to="/Theses">Diplomski radovi</Link>

              {/* AUTH MOBILE */}
              <div className="mt-4 border-t pt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-[#294a70] font-medium">
                      {user.username}
                    </span>

                    <Link
                      to="/messages"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-center hover:bg-blue-600"
                    >
                      Inbox
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/Dashboard"
                        className="px-4 py-2 border-2 border-[#294a70] text-[#294a70] rounded-full text-center hover:bg-[#eef2ff]"
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border-2 border-[#294a70] text-[#294a70] rounded-full hover:bg-[#eef2ff]"
                    >
                      Odjavi se
                    </button>
                  </div>
                ) : (
                  <Link
                    onClick={() => setOpen(false)}
                    to="/login"
                    className="px-4 py-2 border-2 border-[#294a70] text-[#294a70] rounded-full text-center hover:bg-[#eef2ff]"
                  >
                    Prijavi se
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )
      }
    </header >
  );
}

export default Header;
