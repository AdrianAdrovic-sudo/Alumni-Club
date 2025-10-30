import '../css/Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useState } from 'react';

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1>Kontaktirajte Nas</h1>
        <p className="hero-subtitle">Rado ćemo odgovoriti na sva vaša pitanja</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <h2>Informacije</h2>
          <div className="info-cards">
            <div className="adress">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Adresa</h3>
              <p>Univerzitet Mediteran</p>
              <p>Fakultet za informacione tehnologije</p>
              <p>Josipa Broza bb, Podgorica</p>
            </div>

            <div className="phone">
              <div className="info-icon">
                <FaPhone />
              </div>
              <h3>Telefon</h3>
              <p>+382 20 409 204</p>
              <p>Fax: +382 20 409 232</p>
            </div>

            <div className="email">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p>info@alumni-fit.com</p>
              <p>support@alumni-fit.com</p>
            </div>

            <div className="working-hours">
              <div className="info-icon">
                <FaClock />
              </div>
              <h3>Radno vrijeme</h3>
              <p>Ponedeljak - Petak</p>
              <p>11:00 - 17:00</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Pošaljite nam poruku</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Ime i Prezime</label>
             <input type="text" placeholder="Vaše ime i prezime" required/>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email adresa</label>
              <input
                type="email"placeholder="vasa@email.com" required/>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Naslov</label>
              <input type="text"placeholder="Naslov poruke"required/>
            </div>

            <div className="form-group">
              <label htmlFor="message">Poruka</label>
              <textarea id="message" placeholder="Vaša poruka..."/>
            </div>

            <button type="submit" className="submit-btn">
              Pošalji Poruku
            </button>
          </form>
        </div>

        <div className="map-section">
          <h2>Gdje se nalazimo</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.971565345187!2d19.267979976505572!3d42.42834013078447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb6802d0cc3b%3A0x6dc41d7a0bc12a45!2sUniverzitet%20Mediteran%20Podgorica!5e0!3m2!1sen!2s!4v1761667141132!5m2!1sen!2s"
              width="100%"
              height="450"
              loading="lazy"
              title="Lokacija Univerziteta Mediteran"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;