import "../css/Header.css"
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <a href="/Home" className="logo-link">
            <img src="/src/assets/akfit.png" alt="Udruzenje Logo" className="logo-img" />
          </a>
        </div>

        {/* Navigacija */}
        <nav className="nav-menu">
          <a href="#" className="nav-link">Udruženje</a>
          <Link to="/AlumniDirectory" className="nav-link">Alumnisti</Link>
          <a href="#" className="nav-link">Oglasi za posao</a>
          <a href="#" className="nav-link">Kontakt</a>
        </nav>

        {/* Prijavi se dugme */}
        <div className="signup-container">
          <button className="signup-btn">Prijavi se</button>
          <div className="diagonal-bg" />
        </div>
      </div>
    </header>
  );
}

export default Header;
