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
    setOpen(false);
  }

  const isAdmin = user?.role === "admin";
  const isRegularUser = user?.role === "user";

  const navLink =
    "relative text-[#294a70] transition-all duration-300 hover:text-[#1d3652] hover:-translate-y-[2px] " +
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#294a70] " +
    "after:transition-all after:duration-300 hover:after:w-full";

  const buttonStyle =
    "px-3 py-1.5 border-2 border-[#294a70] rounded-full text-[#294a70] hover:bg-[#eef2ff] text-sm transition-colors whitespace-nowrap";

  const authButton =
    "px-4 py-2 rounded-full bg-[#294a70] text-white font-medium hover:bg-[#1d3652] transition text-sm";

  return (
    <header className="bg-white shadow-lg border-b-[3px] border-[#ffab1f] fixed top-0 w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">

          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/Home">
              <img
                src="/src/assets/akfit.png"
                alt="Logo"
                className="h-12 sm:h-14 lg:h-16 w-auto"
              />
            </Link>
          </div>

          {/* DESKTOP NAV - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 font-medium">
            <Link className={navLink} to="/AboutUs">O nama</Link>
            <Link className={navLink} to="/AlumniDirectory">Alumnisti</Link>
            <Link className={navLink} to="/Blog">Blog</Link>
            <Link className={navLink} to="/Contact">Kontakt</Link>
            <Link className={navLink} to="/Theses">Diplomski radovi</Link>
          </nav>

          {/* DESKTOP USER SECTION - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 ml-auto text-[#294a70]">
            {user ? (
              <div className="flex items-center gap-2 xl:gap-3">
                <span className="text-sm xl:text-base font-semibold whitespace-nowrap">
                  Dobrodošao/la, <span className="font-bold">{user.username}</span>!
                </span>

                <Link to="/messages" className={buttonStyle}>Inbox</Link>

                {isRegularUser && (
                  <Link to="/MyProfile" className={buttonStyle}>Profil</Link>
                )}

                {isAdmin && (
                  <Link to="/Dashboard" className={buttonStyle}>Dashboard</Link>
                )}

                <span
                  onClick={handleLogout}
                  className={authButton + " cursor-pointer"}
                >
                  Odjavi se
                </span>
              </div>
            ) : (
              <Link to="/login" className={authButton}>
                Prijavi se
              </Link>
            )}
          </div>

          {/* MOBILE/TABLET BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#294a70] ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE/TABLET MENU */}
      {open && (
        <div className="lg:hidden bg-white shadow-xl border-t border-gray-200 animate-slideDown">
          <nav className="flex flex-col p-4 gap-2 text-[#294a70] font-medium max-h-[calc(100vh-80px)] overflow-y-auto">

            {/* Navigation Links */}
            <Link
              onClick={() => setOpen(false)}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              to="/Blog"
            >
              Blog
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              to="/AlumniDirectory"
            >
              Alumnisti
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              to="/AboutUs"
            >
              O nama
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              to="/Contact"
            >
              Kontakt
            </Link>
            <Link
              onClick={() => setOpen(false)}
              className="py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              to="/Theses"
            >
              Diplomski radovi
            </Link>

            {/* User Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="px-2 py-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-base">
                      {user.username}
                    </span>
                  </div>

                  <Link
                    onClick={() => setOpen(false)}
                    to="/messages"
                    className="w-full text-center py-2.5 px-4 border-2 border-[#294a70] rounded-full hover:bg-[#eef2ff] transition"
                  >
                    Inbox
                  </Link>

                  {isRegularUser && (
                    <Link 
                      onClick={() => setOpen(false)} 
                      to="/MyProfile" 
                      className="w-full text-center py-2.5 px-4 border-2 border-[#294a70] rounded-full hover:bg-[#eef2ff] transition"
                    >
                      Moj Profil
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      onClick={() => setOpen(false)}
                      to="/Dashboard"
                      className="w-full text-center py-2.5 px-4 border-2 border-[#294a70] rounded-full hover:bg-[#eef2ff] transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 rounded-full bg-[#294a70] text-white font-medium hover:bg-[#1d3652] transition"
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <Link
                  onClick={() => setOpen(false)}
                  to="/login"
                  className="w-full text-center py-2.5 px-4 rounded-full bg-[#294a70] text-white font-medium hover:bg-[#1d3652] transition"
                >
                  Prijavi se
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;