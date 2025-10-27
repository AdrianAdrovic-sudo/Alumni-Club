import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";


function Footer() {
  return (
    <footer className="bg-[#324D6B] text-white w-screen static bottom-0 left-0 z-50">
      <div className="w-full grid md:grid-cols-2 gap-8 px-8">
        {/* Lijeva strana - mapa i social */}
        <div>
          <div className="font-semibold mb-2">Ovdje se nalazimo</div>
          <div className="bg-gray-200 rounded overflow-hidden mb-4 w-[280px] h-[160px]">
            {/* Odavde mozes ubaciti pravi <iframe> za mapu ili sliku */}
            <img src="/src/assets/map-placeholder.png" alt="Mapa" className="w-full h-full object-cover" />
          </div>
          {/* Drustvene mreze */}
          <div className="flex items-center space-x-3">
            {/* react ikonice */}
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
        {/* Desna strana - kontakt informacije */}
        <div>
          <div className="font-semibold mb-2">Kontaktirajte nas</div>
          <div className="mb-2">Adresa:</div>
          <div className="mb-2 text-sm">
            Mediteran University<br />
            Fakultet za informacije tehnologije<br />
            Lorem Street 123, Podgorica, Crna Gora
          </div>
          <div className="mb-2">Telefon:<br /><span className="text-sm">+382 20 400 200</span></div>
          <div className="mb-2">Fax:<br /><span className="text-sm">+382 20 400 233</span></div>
          <div className="mb-2">E-mail:<br /><span className="text-sm">info@email.com</span></div>
        </div>
      </div>
      <div className="text-xs text-center mt-6 opacity-90">
        Zajedno gradimo budućnost. Alumni FIT 2025.
      </div>
    </footer>
  );
}

export default Footer;
