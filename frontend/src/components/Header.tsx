import "../css/Header.css"
import { Link } from "react-router-dom";

// Dummy session data
const currentUser = "Marin"; //Neka bude admin, stavi "" za logged out

function Header() {

   const isAdmin = currentUser;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <a href="/Home" className="logo-link">
            <img src="/src/assets/akfit.png" alt="Udruzenje Logo" className="logo-img" />
          </a>
        </div>

        <nav className="nav-menu">
          <Link to="/Blog" className="nav-link">Blog</Link>
          <Link to="/AlumniDirectory" className="nav-link">Alumnisti</Link>
          <Link to="/AboutUs" className="nav-link">O nama</Link>
          <a href="/Contact" className="nav-link">Kontakt</a>
        </nav>

        <div className="signup-container">
          {isAdmin ? (
            <Link to="/dashboard">
              <button className="dashboard-btn">Dashboard</button>
            </Link>
          ) : (
          <Link to="/login">
            <button className="signup-btn">Prijavi se</button>
          </Link>
          )
        }
          <div className="diagonal-bg" />
        </div>
      </div>
    </header>
  );
}

export default Header;
