import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#324D6B] text-white w-full py-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-[1200px] mx-auto">
        
        {/* Lijeva strana */}
        <div className="flex flex-col">
          <div className="font-semibold mb-2">Ovdje se nalazimo</div>

          <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 w-[280px] h-[160px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.971565345187!2d19.267979976505572!3d42.42834013078447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb6802d0cc3b%3A0x6dc41d7a0bc12a45!2sUniverzitet%20Mediteran%20Podgorica!5e0!3m2!1sen!2s!4v1761667141132!5m2!1sen!2s"
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="flex items-center gap-3 text-2xl">
            <a href="#" className="hover:text-gray-300"><FaFacebook /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-300"><FaYoutube /></a>
          </div>
        </div>

        {/* Desna strana */}
        <div className="flex flex-col">
          <div className="font-semibold mb-2">Kontaktirajte nas</div>

          <div className="font-medium mb-2">Adresa:</div>
          <div className="text-[0.95em] mb-3">
            Mediteran University <br />
            Fakultet za informacije tehnologije <br />
            Lorem Street 123, Podgorica, Crna Gora
          </div>

          <div className="font-medium mb-1">
            Telefon:<br />
            <span className="text-[0.95em]">+382 20 400 200</span>
          </div>

          <div className="font-medium mb-1">
            Fax:<br />
            <span className="text-[0.95em]">+382 20 400 233</span>
          </div>

          <div className="font-medium mb-1">
            E-mail:<br />
            <span className="text-[0.95em]">info@email.com</span>
          </div>
        </div>

      </div>

      <div className="text-sm text-center mt-6 opacity-90">
        Zajedno gradimo budućnost. Alumni FIT 2025.
      </div>
    </footer>
  );
}

export default Footer;
