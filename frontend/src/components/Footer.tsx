import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Lijeva strana */}
        <div className="footer-left">
          <div className="footer-title">Ovdje se nalazimo</div>
          <div className="footer-map">
            {/* Google map link */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.971565345187!2d19.267979976505572!3d42.42834013078447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb6802d0cc3b%3A0x6dc41d7a0bc12a45!2sUniverzitet%20Mediteran%20Podgorica!5e0!3m2!1sen!2s!4v1761667141132!5m2!1sen!2s"
              width="600" height="450" loading="lazy" className="footer-map-img">
             </iframe>
          </div>
          <div className="footer-social">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
        {/* Desna strana */}
        <div className="footer-right">
          <div className="footer-title">Kontaktirajte nas</div>
          <div className="footer-label">Adresa:</div>
          <div className="footer-info">
            Mediteran University<br />
            Fakultet za informacije tehnologije<br />
            Lorem Street 123, Podgorica, Crna Gora
          </div>
          <div className="footer-label">Telefon:<br />
            <span className="footer-info">+382 20 400 200</span>
          </div>
          <div className="footer-label">Fax:<br />
            <span className="footer-info">+382 20 400 233</span>
          </div>
          <div className="footer-label">E-mail:<br />
            <span className="footer-info">info@email.com</span>
          </div>
        </div>
      </div>
      <div className="footer-note">
        Zajedno gradimo budućnost. Alumni FIT 2025.
      </div>
    </footer>
  );
}

export default Footer;
