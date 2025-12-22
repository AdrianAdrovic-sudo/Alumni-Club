import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="w-full min-h-screen bg-white">

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white py-16 md:py-24 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Kontaktirajte nas
        </h1>
        <p className="text-sm sm:text-base md:text-lg opacity-90">
          Rado ćemo odgovoriti na sva vaša pitanja
        </p>
      </div>

      {/* WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">

        {/* INFO SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70] text-center mb-12">
            Informacije
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">

            {/* CARD TEMPLATE */}
            {[
              {
                icon: <FaMapMarkerAlt />,
                title: "Adresa",
                lines: [
                  "Univerzitet Mediteran",
                  "Fakultet za informacione tehnologije",
                  "Josipa Broza bb, Podgorica",
                ],
              },
              {
                icon: <FaPhone />,
                title: "Telefon",
                lines: ["+382 20 409 204", "Fax: +382 20 409 232"],
              },
              {
                icon: <FaEnvelope />,
                title: "Email",
                lines: ["info@alumni-fit.com", "support@alumni-fit.com"],
              },
              {
                icon: <FaClock />,
                title: "Radno vrijeme",
                lines: ["Ponedeljak - Petak", "11:00 - 17:00"],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-200 
                           text-center transition-all hover:border-[#ffab1f] hover:shadow-xl 
                           hover:-translate-y-1"
              >
                <div className="text-4xl text-[#ffab1f] mb-5">{item.icon}</div>

                <h3 className="text-lg md:text-xl font-semibold text-[#294a70] mb-3">
                  {item.title}
                </h3>

                {item.lines.map((l, idx) => (
                  <p
                    key={idx}
                    className="text-gray-600 text-sm md:text-base leading-relaxed"
                  >
                    {l}
                  </p>
                ))}
              </div>
            ))}

          </div>
        </div>

        {/* FORM SECTION */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70] text-center mb-12">
            Pošaljite nam poruku
          </h2>

          <form className="bg-gray-100 p-6 md:p-10 rounded-2xl shadow-lg">
            
            {/* INPUT GROUPS */}
            {[
              { label: "Ime i Prezime", type: "text", placeholder: "Vaše ime i prezime" },
              { label: "Email adresa", type: "email", placeholder: "vas@email.com" },
              { label: "Naslov", type: "text", placeholder: "Naslov poruke" },
            ].map((field, i) => (
              <div key={i} className="mb-6">
                <label className="block text-[#294a70] font-medium mb-2">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg 
                             text-gray-800 focus:outline-none focus:border-[#ffab1f]
                             transition"
                />
              </div>
            ))}

            {/* TEXTAREA */}
            <div className="mb-6">
              <label className="block text-[#294a70] font-medium mb-2">
                Poruka
              </label>

              <textarea
                placeholder="Vaša poruka..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 
                           focus:outline-none focus:border-[#ffab1f] transition min-h-[140px] resize-y"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-lg
                         bg-gradient-to-br from-[#294a70] to-[#324D6B]
                         hover:from-[#ffab1f] hover:to-[#ff9500]
                         transform transition hover:-translate-y-1
                         shadow-md hover:shadow-xl"
            >
              Pošalji Poruku
            </button>

          </form>
        </div>

        {/* MAP SECTION */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70] text-center mb-12">
            Gdje se nalazimo
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.971565345187!2d19.267979976505572!3d42.42834013078447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb6802d0cc3b%3A0x6dc41d7a0bc12a45!2sUniverzitet%20Mediteran%20Podgorica!5e0!3m2!1sen!2s!4v1761667141132!5m2!1sen!2s"
              className="w-full h-[320px] sm:h-[380px] md:h-[450px]"
              loading="lazy"
              title="Lokacija Univerziteta Mediteran"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
