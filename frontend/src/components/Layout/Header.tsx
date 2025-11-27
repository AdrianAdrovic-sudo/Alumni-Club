import "../../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isAdmin = user?.role === "admin";
  const isRegularUser = user?.role === "user";

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <a href="/Home" className="logo-link">
            <img
              src="/src/assets/akfit.png"
              alt="Udruzenje Logo"
              className="logo-img"
            />
          </a>
        </div>

        <nav className="nav-menu">
          <Link to="/Blog" className="nav-link">
            Blog
          </Link>
          <Link to="/AlumniDirectory" className="nav-link">
            Alumnisti
          </Link>
          <Link to="/AboutUs" className="nav-link">
            O nama
          </Link>
          <Link to="/Contact" className="nav-link">
            Kontakt
          </Link>
          <Link to="/Theses" className="nav-link">
            Diplomski radovi
          </Link>
        </nav>

        <div className="signup-container">
          {user ? (
            <div className="user-menu">
              <span className="welcome-text">
                Dobrodošao/la, {user.username}!
              </span>

              {/* Inbox */}
              <Link to="/messages" className="messages-btn">
                Inbox
              </Link>

              {/* MyProfile samo za običnog usera */}
              {isRegularUser && (
                <Link to="/MyProfile" className="profile-btn">
                  <button className="dashboard-btn">MyProfile</button>
                </Link>
              )}

              {/* Admin Dashboard */}
              {isAdmin && (
                <Link to="/Dashboard">
                  <button className="dashboard-btn">Dashboard</button>
                </Link>
              )}

              <button className="signup-btn" onClick={handleLogout}>
                Odjavi se
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="signup-btn">Prijavi se</button>
            </Link>
          )}
          <div className="diagonal-bg" />
        </div>
      </div>
    </header>
  );
}

export default Header;
