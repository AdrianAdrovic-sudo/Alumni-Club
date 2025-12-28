function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-white">

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white py-16 md:py-24 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          O nama
        </h1>

        <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-xl mx-auto">
          Alumni zajednica Fakulteta za informacione tehnologije
        </p>
      </div>

      {/* WRAPPER */}
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-4">

        {/* SECTION 1 - Kako je nastao */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center mb-16 md:mb-24">
          <div className="space-y-5 text-justify">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70]">
              Kako je nastao Alumni Klub
            </h2>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Alumni FIT je nastao kao projekat koji su realizovali studenti 3. godine Fakulteta za 
            informacione tehnologije na Univerzitetu Mediteran. Projekat je razvijen u okviru predmeta 
            Distribuirani razvoj softvera, sa ciljem da kreira platformu koja će dugoročno služiti 
            povezivanju bivših studenata i akademske zajednice. Svjesni da diplome predstavljaju tek početak jednog putovanja, 
            shvatili smo koliko je važno održavati mostove između prošlosti, sadašnjosti i budućnosti našeg fakulteta. 
            Danas, Alumni Klub FIT predstavlja dinamičnu zajednicu stručnjaka iz IT industrije koji dijele zajedničko 
            iskustvo obrazovanja na FIT-u.
            </p>
          </div>
          
          {/* Slika studenti za računarima */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
              alt="Studenti za računarima"
              className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#294a70]/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* SECTION 2 - Naša Misija (REVERSED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center mb-16 md:mb-24">
          {/* Slika networking/saradnja */}
          <div className="relative lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop" 
              alt="Profesionalno umrežavanje"
              className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#294a70]/20 to-transparent rounded-2xl"></div>
          </div>

          <div className="space-y-5 text-justify lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70]">
              Naša Misija
            </h2>

            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Alumni FIT je platforma koja povezuje bivše studente Fakulteta informacionih tehnologija, 
            omogućavajući im da grade trajne profesionalne odnose, razmjenjuju iskustva i doprinose 
            razvoju buduće generacije IT stručnjaka. Vjerujemo u snagu zajednice i želimo da svaki 
            alumni član ima pristup resursima koji će mu pomoći u karijeri, mogućnost da ostane u 
            kontaktu sa kolegama i priliku da vrati fakultetu kroz mentorstvo i podršku trenutnim studentima. 
            Naša vizija je da stvorimo zajednicu u kojoj uspjeh jednog postaje inspiracija za sve.
            </p>
          </div>
        </div>

        {/* SECTION 3 - Šta Nudimo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center mb-16 md:mb-24">
          <div className="space-y-5 text-justify">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70]">
              Šta Nudimo
            </h2>

            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Kroz našu platformu možete pronaći stare kolege, pratiti njihovu karijeru i uspostaviti 
            nove profesionalne kontakte. 
            Učestvujte u programima mentorstva gdje možete prenijeti svoje znanje studentima ili, ako 
            ste fresh graduate, dobiti podršku od iskusnijih kolega. 
            Kao alumni član, imate priliku da aktivno učestvujete u razvoju fakulteta kroz gostujuća predavanja, 
            učešće u kurikulumu, stipendijske programe i podršku studentskim projektima.
            </p>
          </div>

          {/* Slika mentorstvo/predavanje */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop" 
              alt="Mentorstvo i edukacija"
              className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#294a70]/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 my-20">
          {[
            { number: "500+", label: "Alumni članova" },
            { number: "50+", label: "Kompanija" },
            { number: "20+", label: "Država" },
            { number: "15+", label: "Godina tradicije" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white p-8 md:p-10 rounded-2xl text-center shadow-md transition-transform hover:-translate-y-2"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffab1f] mb-2">
                {item.number}
              </h3>
              <p className="text-sm sm:text-base opacity-90">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        

        {/* VALUES */}
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#294a70] text-center mb-14">
            Naše Vrijednosti
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🤝", title: "Povezanost", text: "Gradimo mostove između generacija i profesionalaca" },
              { icon: "💡", title: "Inovacija", text: "Podsticanje kreativnosti i novih ideja" },
              { icon: "🎓", title: "Obrazovanje", text: "Kontinuirano učenje i razvoj" },
              { icon: "🌟", title: "Izvrsnost", text: "Težnja ka vrhunskim rezultatima" },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white p-8 md:p-10 rounded-2xl text-center border-2 border-gray-200 
                           hover:border-[#ffab1f] shadow-sm hover:shadow-xl 
                           transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#294a70] mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;