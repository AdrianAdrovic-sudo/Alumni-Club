
function Header () {
  return (
    <header className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="#" className="flex-shrink-0">
        <img src="/src/assets/akfit.png" alt="Udruzenje Logo" className="h-10 w-auto" />
      </a>
        </div>

        {/* Navigacija */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-600 transition">Udruženje</a>
          <a href="#" className="hover:text-blue-600 transition">Alumnisti</a>
          <a href="#" className="hover:text-blue-600 transition">Oglasi za posao</a>
          <a href="#" className="hover:text-blue-600 transition">Kontakt</a>
        </nav>

        {/* Prijavi se dugme + dijagonalni pozadinski deo */}
        <div className="relative">
          <button className="bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition">
            Prijavi se
          </button>
          {/* Diagonalni plavi deo ispod dugmeta */}
          <div className="absolute inset-0 -z-10 bg-blue-800 clip-diagonal transform translate-y-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;