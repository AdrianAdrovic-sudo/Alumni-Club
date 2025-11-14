import "../css/Header.css"
import { Link } from "react-router-dom";

function Header() {
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
          <Link to="/Contact" className="nav-link">Kontakt</Link>
          <Link to="/Theses" className="nav-link">Diplomski radovi</Link>
        </nav>

        <div className="signup-container">
          <Link to="/login">
          <button className="signup-btn">Prijavi se</button>
          </Link>
          <div className="diagonal-bg" />
        </div>
      </div>
    </header>
  );
}

export default Header;
