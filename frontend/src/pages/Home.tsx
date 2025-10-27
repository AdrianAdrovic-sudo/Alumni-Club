function Home() {
 return (
    <div className="w-full min-h-screen flex flex-col bg-[#324D6B]">
      {/* Hero Section */}
      <div className="relative w-full h-[340px] mb-8 flex items-end justify-center">
        {/* Background image */}
        <img
          src="/src/assets/img1.jpg"
          alt="Graduation Background"
          className="w-full h-full object-cover object-center rounded-b-xl absolute left-0 top-0"
        />

        {/* Sadržaj preko slike (žuti box i laptop) */}
        <div className="relative z-20 w-full flex justify-center">
          <div className="flex gap-24 items-end translate-y-1/2">
            {/* Žuti box malo ulevo */}
            <div>
              <div className="bg-yellow-400 px-6 py-6 rounded-xl max-w-xs drop-shadow-lg text-white flex flex-col items-center">
                <div className="font-bold text-lg mb-1 text-center">Registrujte se i<br />postanite član Alumni kluba</div>
                <input
                  type="text"
                  placeholder="Unesite Vaš mail..."
                  className="my-2 w-full rounded px-2 py-1 text-gray-800"
                />
                <button className="bg-white text-yellow-600 font-semibold px-3 py-1 rounded mt-1 mb-2 hover:bg-yellow-100 transition">
                  Registruj se!
                </button>
                <span className="text-xs">Već imate nalog? <a href="#" className="underline">Prijavite se</a></span>
              </div>
            </div>
            {/* Laptop slika malo udesno */}
            <div>
              <img
                src="/src/assets/laptop.jpg"
                alt="Laptop Presentation"
                className="w-92 h-48 rounded-lg shadow-lg border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>

    {/* Aktuelno Title */}
    <div className="flex flex-col items-center mb-2 w-full pt-36">
        <span className="text-yellow-400 font-bold text-2xl flex items-center">
                Aktuelno
            <svg className="ml-2 w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19V6h6v13"/><circle cx="12" cy="4" r="2"/><ellipse cx="12" cy="20" rx="5" ry="2"/>
            </svg>
        </span>
    </div>


      {/* Vijesti Carousel/Preview */}
      <div className="flex justify-center gap-5 mt-4 flex-wrap w-full">
        {[1,2,3].map((num) => (
          <div key={num} className="flex flex-col items-center bg-white rounded-lg w-[140px] md:w-[170px] shadow p-2 pt-3">
            <div className="w-full h-28 bg-gray-300 rounded flex items-center justify-center text-xl font-bold text-gray-700">
              vijest{num}
            </div>
            <span className="mt-2 text-xs text-gray-600">Opis vijesti...</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;