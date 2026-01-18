import {
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaPhone,
  FaFax,
  FaEnvelope
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#294a70] text-white w-full relative overflow-hidden pt-0">

      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12">

        <div className="text-center mb-10 -mt-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Alumni Klub FIT
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Univerzitet Mediteran - Fakultet za informacione tehnologije
          </p>
          <div className="mt-3 h-1 w-24 mx-auto bg-[#ffab1f]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* MAPA + ADRESA */}
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl overflow-hidden border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.971565345187!2d19.267979976505572!3d42.42834013078447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb6802d0cc3b%3A0x6dc41d7a0bc12a45!2sUniverzitet%20Mediteran%20Podgorica!5e0!3m2!1sen!2s!4v1761667141132!5m2!1sen!2s"
                loading="lazy"
                className="w-full h-[220px]"
              />
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#ffab1f]  rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-bold">Naša adresa</h3>
                  <p className="text-sm text-white/80">
                    Josipa Broza bb <br />
                    Podgorica, Crna Gora
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KONTAKT + DRUŠTVENE MREŽE */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Kontaktirajte nas</h3>

            <div className="space-y-3 mb-8">
              <ContactItem icon={FaPhone} label="Telefon" value="+382 20 409 204" />
              <ContactItem icon={FaFax} label="Fax" value="+382 20 409 232" />
              <ContactItem icon={FaEnvelope} label="E-mail" value="info@email.com" />
            </div>

            {/* INSTAGRAM + FACEBOOK */}
            <div className="pt-6 border-t border-white/20">
              <div className="text-xs uppercase mb-4 text-white/80">
                Društvene mreže
              </div>

              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/usfitum/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg"
                    style={{ backgroundColor: "#c9239fff" }}
                  >
                    <FaInstagram className="text-white text-lg" />
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/FITPodgorica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg"
                    style={{ backgroundColor: "#1877f2" }}
                  >
                    <FaFacebook className="text-white text-lg" />
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/20 text-sm text-white/70 text-center">
          © 2025 Alumni FIT. Zajedno gradimo budućnost.
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/20 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#ffab1f] rounded-xl flex items-center justify-center">
        <Icon className="text-white" />
      </div>
      <div>
        <div className="text-xs text-white/60 uppercase">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

export default Footer;
