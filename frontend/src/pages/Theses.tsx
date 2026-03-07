import { FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UploadThesisModal from "../components/UploadThesisModal";

export default function DiplomskiRadovi() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<"search" | "statistics">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("datum-desc");
  const [showFilter, setShowFilter] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);
  const [thesisTypeFilter, setThesisTypeFilter] = useState<string>("all");

  const handleDownload = (fileUrl: string, fileName: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const podaci = [
    { ime: "Miloš", prezime: "Žižić", naziv: "Informacioni sistem Rent-a cara", datum: "10.07.2009.", fileUrl: "/theses/zizic-milos.pdf", type: "bachelors", year: 2009 },
    { ime: "Tripo", prezime: "Matijević", naziv: "Prikupljanje činjenica za informacioni sistem studentske službe", datum: "10.07.2010.", fileUrl: "/theses/matijevic-tripo.pdf", type: "masters", year: 2010 },
    { ime: "Zoran", prezime: "Ćorović", naziv: "Model, objekti i veze informacionog sistema studentske službe", datum: "10.07.2010.", fileUrl: "/theses/corovic-zoran.pdf", type: "bachelors", year: 2010 },
    { ime: "Dženan", prezime: "Strujić", naziv: "Relacioni model informacionog sistema studentske službe", datum: "10.07.2015.", fileUrl: "/theses/strujic-dzenan.pdf", type: "specialist", year: 2015 },
    { ime: "Novak", prezime: "Radulović", naziv: "Forme i izvještaj informacionog sistema studentske službe", datum: "10.07.2015.", fileUrl: "/theses/radulovic-novak.pdf", type: "masters", year: 2015 },
    { ime: "Igor", prezime: "Pekić", naziv: "Sigurnost informacionog sistema studentske službe", datum: "10.07.2018.", fileUrl: "/theses/pekic-igor.pdf", type: "bachelors", year: 2018 },
    { ime: "Ana", prezime: "Jovanović", naziv: "Web aplikacija za studentsku službu", datum: "10.07.2020.", fileUrl: "/theses/jovanovic-ana.pdf", type: "specialist", year: 2020 },
    { ime: "Jelena", prezime: "Marković", naziv: "Implementacija informacionog sistema studentske službe", datum: "10.07.2022.", fileUrl: "/theses/markovic-jelena.pdf", type: "masters", year: 2022 },
    { ime: "Marko", prezime: "Nikolić", naziv: "Testiranje informacionog sistema studentske službe", datum: "10.07.2023.", fileUrl: "/theses/nikolic-marko.pdf", type: "bachelors", year: 2023 },
    { ime: "Ivana", prezime: "Stojanović", naziv: "Održavanje informacionog sistema studentske službe", datum: "10.07.2024.", fileUrl: "/theses/stojanovic-ivana.pdf", type: "specialist", year: 2024 },
  ];

  // Calculate statistics
  const getStatsByYear = () => {
    const yearStats: { [key: number]: { total: number; bachelors: number; masters: number; specialist: number } } = {};
    
    podaci.forEach(thesis => {
      if (!yearStats[thesis.year]) {
        yearStats[thesis.year] = { total: 0, bachelors: 0, masters: 0, specialist: 0 };
      }
      yearStats[thesis.year].total++;
      if (thesis.type === 'bachelors') yearStats[thesis.year].bachelors++;
      if (thesis.type === 'masters') yearStats[thesis.year].masters++;
      if (thesis.type === 'specialist') yearStats[thesis.year].specialist++;
    });
    
    return yearStats;
  };

  const yearStats = getStatsByYear();
  const years = Object.keys(yearStats).map(Number).sort((a, b) => b - a);
  const maxThesesInYear = Math.max(...Object.values(yearStats).map(stat => stat.total));

  // Filtriranje
  const filtrirani = podaci.filter((p) => {
    const matchesSearch =
      p.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.naziv.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = thesisTypeFilter === "all" || p.type === thesisTypeFilter;

    return matchesSearch && matchesType;
  });

  // Sortiranje
  const sortirani = [...filtrirani].sort((a, b) => {
    switch (sortBy) {
      case "datum-asc":
        return new Date(a.datum.split('.').reverse().join('-')).getTime() - new Date(b.datum.split('.').reverse().join('-')).getTime();
      case "datum-desc":
        return new Date(b.datum.split('.').reverse().join('-')).getTime() - new Date(a.datum.split('.').reverse().join('-')).getTime();
      case "ime-asc":
        return a.ime.localeCompare(b.ime);
      case "prezime-asc":
        return a.prezime.localeCompare(b.prezime);
      case "naziv-asc":
        return a.naziv.localeCompare(b.naziv);
      default:
        return 0;
    }
  });

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white px-4 py-12 md:py-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4
                       bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent
                       drop-shadow-2xl">
          Diplomski radovi
        </h1>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light max-w-3xl mx-auto">
          Pregledajte bazu diplomskih radova naših studenata. Koristite
          pretragu da biste brzo pronašli radove po imenu, prezimenu ili
          nazivu rada.
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 border border-gray-200">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 px-6 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "search"
                  ? "bg-gradient-to-r from-[#294a70] to-[#324D6B] text-white shadow-md transform scale-105"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              🔍 Pretraga
            </button>
            <button
              onClick={() => setActiveTab("statistics")}
              className={`flex-1 px-6 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "statistics"
                  ? "bg-gradient-to-r from-[#294a70] to-[#324D6B] text-white shadow-md transform scale-105"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              📊 Statistika
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH TAB CONTENT */}
      {activeTab === "search" && (
        <>
          {/* SEARCH & FILTER */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 md:px-16 mt-8">
        {/* Filter Button */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <FaFilter />
            <span>Sortiraj</span>
          </button>

          {showFilter && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-56 bg-[#294a70] rounded-lg shadow-xl overflow-hidden z-50">
              {/* Sort Options */}
              <div className="border-b border-[#1f3a5a] pb-2">
                <div className="px-4 py-2 text-xs text-gray-300 font-semibold uppercase">Sortiraj</div>
                <button
                  onClick={() => { setSortBy("datum-desc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "datum-desc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Datum (najnoviji prvo)
                </button>
                <button
                  onClick={() => { setSortBy("datum-asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "datum-asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Datum (najstariji prvo)
                </button>
                <button
                  onClick={() => { setSortBy("ime-asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "ime-asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Ime (A-Z)
                </button>
                <button
                  onClick={() => { setSortBy("prezime-asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "prezime-asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Prezime (A-Z)
                </button>
                <button
                  onClick={() => { setSortBy("naziv-asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "naziv-asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Naziv rada (A-Z)
                </button>
              </div>

              {/* Thesis Type Filter Options */}
              <div className="pt-2">
                <div className="px-4 py-2 text-xs text-gray-300 font-semibold uppercase">Tip rada</div>
                <button
                  onClick={() => { setThesisTypeFilter("all"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${thesisTypeFilter === "all" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Sve
                </button>
                <button
                  onClick={() => { setThesisTypeFilter("bachelors"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${thesisTypeFilter === "bachelors" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Osnovne studije
                </button>
                <button
                  onClick={() => { setThesisTypeFilter("masters"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${thesisTypeFilter === "masters" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Master studije
                </button>
                <button
                  onClick={() => { setThesisTypeFilter("specialist"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${thesisTypeFilter === "specialist" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Specijalističke studije
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center w-full sm:w-96">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraga po imenu, prezimenu ili nazivu rada..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffab1f] focus:border-[#ffab1f] shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-6xl">
          {/* Info text - moved here above table */}
          <div className="mb-4">
            <p className="text-sm sm:text-base text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              💡 <strong>Savjet:</strong> Kliknite na naziv diplomskog rada da ga preuzmete na svoj uređaj.
            </p>
          </div>
          
          <div className="shadow-md rounded-2xl overflow-hidden bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse table-auto min-w-[600px]">
                <thead className="bg-[#294a70] text-white">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base font-semibold">
                      Ime
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base font-semibold">
                      Prezime
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base font-semibold">
                      Naziv diplomskog rada
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base font-semibold hidden sm:table-cell">
                      Datum diplomiranja
                    </th>
                    {isAdmin && (
                      <th className="px-2 sm:px-4 py-3 text-left text-sm sm:text-base font-semibold">
                        Akcije
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortirani.map((p, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base text-gray-800 border-b border-gray-200">
                        {p.ime}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base text-gray-800 border-b border-gray-200">
                        {p.prezime}
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base text-gray-800 border-b border-gray-200">
                        <button
                          onClick={() => handleDownload(p.fileUrl, `${p.prezime}-${p.ime}.pdf`)}
                          className="text-gray-800 hover:text-[#294a70] cursor-pointer text-left bg-transparent border-none p-0 m-0 font-medium transition-colors hover:underline"
                          title="Kliknite da preuzmete rad"
                        >
                          {p.naziv}
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 py-3 text-sm sm:text-base text-gray-800 border-b border-gray-200 hidden sm:table-cell">
                        {p.datum}
                      </td>
                      {isAdmin && (
                        <td className="px-2 sm:px-4 py-3 text-sm sm:text-base border-b border-gray-200">
                          <button
                            onClick={() => {
                              setSelectedThesis(p);
                              setShowUploadModal(true);
                            }}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors text-sm font-medium"
                          >
                            <FaUpload size={12} />
                            <span className="hidden sm:inline">Otpremi</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* STATISTICS TAB CONTENT */}
      {activeTab === "statistics" && (
        <div className="w-full flex-1 px-4 md:px-8 py-8 bg-gray-50">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#294a70] mb-8">
              📊 Statistika diplomskih radova
            </h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Total Theses */}
              <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Ukupno radova</h3>
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-5xl font-bold text-[#ffab1f] mb-1">{podaci.length}</p>
                <p className="text-xs text-gray-300">Svi tipovi studija</p>
              </div>

              {/* Bachelors */}
              <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Osnovne</h3>
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-5xl font-bold text-[#ffab1f] mb-1">
                  {podaci.filter(p => p.type === "bachelors").length}
                </p>
                <p className="text-xs text-gray-300">
                  {((podaci.filter(p => p.type === "bachelors").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>

              {/* Masters */}
              <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Master</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-5xl font-bold text-[#ffab1f] mb-1">
                  {podaci.filter(p => p.type === "masters").length}
                </p>
                <p className="text-xs text-gray-300">
                  {((podaci.filter(p => p.type === "masters").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>

              {/* Specialist */}
              <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Specijalističke</h3>
                  <span className="text-2xl">⭐</span>
                </div>
                <p className="text-5xl font-bold text-[#ffab1f] mb-1">
                  {podaci.filter(p => p.type === "specialist").length}
                </p>
                <p className="text-xs text-gray-300">
                  {((podaci.filter(p => p.type === "specialist").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>
            </div>

            {/* Statistics by Year */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                <span>📅</span> Statistika po godinama
              </h3>
              
              <div className="space-y-6">
                {years.map(year => {
                  const stats = yearStats[year];
                  const percentage = (stats.total / maxThesesInYear) * 100;
                  
                  return (
                    <div key={year} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      {/* Year Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-[#294a70]">{year}. godina</h4>
                        <span className="text-2xl font-bold text-[#ffab1f]">{stats.total} radova</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-8 mb-4 overflow-hidden shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-[#294a70] to-[#ffab1f] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Breakdown by Type */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">Osnovne studije</p>
                          <p className="text-2xl font-bold text-[#294a70]">{stats.bachelors}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-xs text-gray-600 mb-1">Master studije</p>
                          <p className="text-2xl font-bold text-[#294a70]">{stats.masters}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <p className="text-xs text-gray-600 mb-1">Specijalističke</p>
                          <p className="text-2xl font-bold text-[#294a70]">{stats.specialist}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                <span>📈</span> Grafički prikaz
              </h3>
              
              <div className="flex items-end justify-between gap-4 h-80 border-l-2 border-b-2 border-gray-300 pl-4 pb-4">
                {years.sort((a, b) => a - b).map(year => {
                  const stats = yearStats[year];
                  const heightPercentage = (stats.total / maxThesesInYear) * 100;
                  
                  return (
                    <div key={year} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar */}
                      <div className="w-full flex flex-col items-center">
                        <span className="text-sm font-bold text-[#294a70] mb-2">{stats.total}</span>
                        <div 
                          className="w-full bg-gradient-to-t from-[#294a70] to-[#ffab1f] rounded-t-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer relative group"
                          style={{ height: `${heightPercentage}%`, minHeight: '40px' }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                            <div className="font-semibold mb-1">{year}. godina</div>
                            <div>Osnovne: {stats.bachelors}</div>
                            <div>Master: {stats.masters}</div>
                            <div>Spec.: {stats.specialist}</div>
                          </div>
                        </div>
                      </div>
                      {/* Year Label */}
                      <span className="text-sm font-semibold text-gray-700 mt-2">{year}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                  <span className="text-sm text-gray-700">Osnovne studije</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span className="text-sm text-gray-700">Master studije</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                  <span className="text-sm text-gray-700">Specijalističke studije</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#294a70] rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-[#294a70] mb-2">Napomena</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Statistika se automatski ažurira na osnovu dostupnih diplomskih radova u bazi. 
                    Grafički prikaz pokazuje distribuciju radova po godinama, dok detaljni pregled 
                    omogućava uvid u broj radova po tipu studija za svaku godinu pojedinačno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Thesis Modal */}
      <UploadThesisModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedThesis(null);
        }}
        thesisContext={selectedThesis}
      />
    </div>
  );
}