import { FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UploadThesisModal from "../components/UploadThesisModal";
import UploadCSVModal from "../components/UploadCSVModal";
import axios from "axios";

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
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [podaci, setPodaci] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/theses");
      console.log("API DATA:", response.data);
      console.log("Broj radova:", response.data.length);
      setPodaci(response.data);
    } catch (err) {
      console.error("Greška pri učitavanju radova:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleDownload = (fileUrl: string, fileName: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    
    console.log("📊 Year Stats:", yearStats);
    return yearStats;
  };

  const yearStats = getStatsByYear();
  const years = Object.keys(yearStats).map(Number).sort((a, b) => b - a);
  const maxThesesInYear = Math.max(...Object.values(yearStats).map(stat => stat.total), 1);
  
  console.log("📅 Years:", years);
  console.log("📈 Max theses in year:", maxThesesInYear);

  // Test podaci za prikaz (privremeno)
  const mentorStats = [
    ["Prof. Marković", 25],
    ["Prof. Petrović", 18],
    ["Prof. Jovanović", 10],
    ["Prof. Nikolić", 8],
    ["Prof. Đorđević", 6]
  ];

  const committeeStats = [
    ["Prof. Nikolić", 20],
    ["Prof. Marković", 15],
    ["Prof. Jovanović", 12],
    ["Prof. Petrović", 10],
    ["Prof. Đorđević", 8]
  ];

  const gradeStats = [
    { grade: "A", count: 20 },
    { grade: "B", count: 35 },
    { grade: "C", count: 25 },
    { grade: "D", count: 10 },
    { grade: "E", count: 5 },
    { grade: "F", count: 2 }
  ];

  const averageGrade = "8.45";

  const topicStats = [
    ["Machine Learning", 15],
    ["Data Science", 12],
    ["Cybersecurity", 10],
    ["Web Development", 8],
    ["Mobile Development", 7],
    ["Cloud Computing", 6],
    ["Artificial Intelligence", 5],
    ["Blockchain", 4],
    ["IoT", 3],
    ["DevOps", 2]
  ];

  const keywordStats = [
    ["AI", 30],
    ["Data Mining", 20],
    ["Machine Learning", 18],
    ["Security", 15],
    ["Blockchain", 10],
    ["Cloud", 9],
    ["Mobile", 8],
    ["Web", 7],
    ["IoT", 6],
    ["DevOps", 5],
    ["React", 4],
    ["Node.js", 4],
    ["Python", 3],
    ["Java", 3],
    ["Docker", 2]
  ];

  // Filtriranje
  const filtrirani = podaci.filter((p) => {

    const ime = p.ime || "";
    const prezime = p.prezime || "";
    const naziv = p.naziv || "";

    const matchesSearch =
      ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      naziv.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = thesisTypeFilter === "all" || p.type === thesisTypeFilter;

    return matchesSearch && matchesType;
  });

  // Sortiranje
  const sortirani = [...filtrirani].sort((a, b) => {
  switch (sortBy) {

    case "datum-asc":
      return new Date(a.year).getTime() - new Date(b.year).getTime();

    case "datum-desc":
      return new Date(b.year).getTime() - new Date(a.year).getTime();

    case "ime-asc":
      return (a.first_name || "").localeCompare(b.first_name || "");

    case "prezime-asc":
      return (a.last_name || "").localeCompare(b.last_name || "");

    case "naziv-asc":
      return (a.title || "").localeCompare(b.title || "");

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
        
        {/* Left side - Filter and CSV Upload buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Button */}
          <div className="relative flex-1 sm:flex-initial">
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

          {/* CSV Upload Button (Admin only) */}
          {isAdmin && (
            <button 
              onClick={() => setShowCsvModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#50C878] text-white rounded-md hover:bg-[#3da860] transition-colors shadow-sm whitespace-nowrap"
            >
              📄 Upload CSV
            </button>
          )}
        </div>

        {/* Right side - Search */}
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
                <thead className="bg-[#355070] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Ime</th>
                    <th className="px-6 py-3 text-left font-semibold">Prezime</th>
                    <th className="px-6 py-3 text-left font-semibold">Naziv diplomskog rada</th>
                    <th className="px-6 py-3 text-left font-semibold">Datum diplomiranja</th>

                  {isAdmin && (
                    <th className="px-6 py-3 text-left font-semibold">
                      Akcije
                    </th>
                  )}
                </tr>
              </thead>
<tbody>
  {sortirani.map((p, idx) => (
    <tr key={idx} className="border-b hover:bg-gray-50">
      <td className="px-6 py-3">{p.first_name}</td>
      <td className="px-6 py-3">{p.last_name}</td>
      <td className="px-6 py-3">
        {p.fileUrl ? (
          <a
            href={p.fileUrl}
            download
            className="hover:underline cursor-pointer"
          >
            {p.title}
          </a>
          ) : (
          <span>{p.title}</span>
          )}
      </td>
      <td className="px-6 py-3">{p.year}</td>

      {isAdmin && (
        <td className="px-6 py-3">
          <button
            onClick={() => {
            setSelectedThesis(p);
            setShowUploadModal(true);
            }}
            className="bg-[#355070] text-white px-4 py-1 rounded-md hover:bg-[#2b4058]"
          >
            📤 Otpremi
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

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#294a70] mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Učitavanje podataka...</p>
                </div>
              </div>
            ) : podaci.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <span className="text-6xl mb-4 block">📚</span>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Nema podataka</h3>
                <p className="text-gray-500">Trenutno nema diplomskih radova u bazi.</p>
              </div>
            ) : (
              <>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Total Theses */}
              <div className="bg-white border-2 border-[#294a70] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Ukupno radova</h3>
                  <span className="text-3xl">📚</span>
                </div>
                <p className="text-5xl font-bold text-[#294a70]">{podaci.length}</p>
              </div>

              {/* Bachelors */}
              <div className="bg-white border-2 border-blue-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Osnovne studije</h3>
                  <span className="text-3xl">🎓</span>
                </div>
                <p className="text-5xl font-bold text-blue-600">
                  {podaci.filter(p => p.type === "bachelors").length}
                </p>
              </div>

              {/* Masters */}
              <div className="bg-white border-2 border-green-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Master studije</h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-5xl font-bold text-green-600">
                  {podaci.filter(p => p.type === "masters").length}
                </p>
              </div>

              {/* Specialist */}
              <div className="bg-white border-2 border-purple-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Specijalističke</h3>
                  <span className="text-3xl">⭐</span>
                </div>
                <p className="text-5xl font-bold text-purple-600">
                  {podaci.filter(p => p.type === "specialist").length}
                </p>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                <span>📈</span> Grafički prikaz po godinama
              </h3>
              
              {years.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Nema podataka za prikaz grafikona</p>
                </div>
              ) : (
              <div className="overflow-x-auto">
              <div className="flex items-end justify-between gap-3 md:gap-4 h-96 border-l-4 border-b-4 border-[#294a70] pl-4 pb-4 bg-gradient-to-t from-gray-50 to-white rounded-bl-lg min-w-max"
                   style={{ minWidth: years.length > 10 ? `${years.length * 80}px` : 'auto' }}
              >
                {years.sort((a, b) => a - b).map(year => {
                  const stats = yearStats[year];
                  const maxHeight = 320; // maksimalna visina u pikselima (povećano za više radova)
                  const barHeight = (stats.total / Math.max(maxThesesInYear, 10)) * maxHeight;
                  
                  return (
                    <div key={year} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar */}
                      <div className="w-full flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-[#294a70] via-[#3d5a7f] to-[#5a7fa0] rounded-t-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative group border-2 border-[#294a70] flex items-start justify-center pt-2"
                          style={{ 
                            height: `${Math.max(barHeight, 40)}px`
                          }}
                        >
                          <span className="text-sm md:text-base font-bold text-white">{stats.total}</span>
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block bg-[#294a70] text-white text-xs rounded-lg py-3 px-4 whitespace-nowrap z-10 shadow-xl border-2 border-white">
                            <div className="font-bold mb-2 text-sm border-b border-white/30 pb-1">{year}. godina</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                                <span>Osnovne: {stats.bachelors}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                <span>Master: {stats.masters}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                                <span>Spec.: {stats.specialist}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Year Label */}
                      <span className="text-xs md:text-sm font-bold text-[#294a70] mt-2 bg-gray-100 px-3 py-1 rounded-full">{year}</span>
                    </div>
                  );
                })}
              </div>
              </div>
              )}
              
              {/* Legend */}
              <div className="mt-8 flex flex-wrap gap-6 justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 border-2 border-blue-700 rounded shadow-sm"></div>
                  <span className="text-sm font-semibold text-gray-700">Osnovne studije</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 border-2 border-green-700 rounded shadow-sm"></div>
                  <span className="text-sm font-semibold text-gray-700">Master studije</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 border-2 border-purple-700 rounded shadow-sm"></div>
                  <span className="text-sm font-semibold text-gray-700">Specijalističke studije</span>
                </div>
              </div>
            </div>

            {/* Detailed Statistics Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
              <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                <span>📋</span> Detaljna tabela statistike
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#294a70] to-[#3d5a7f] text-white">
                      <th className="px-4 py-3 text-left font-semibold border-r border-white/20">Godina</th>
                      <th className="px-4 py-3 text-center font-semibold border-r border-white/20">Osnovne studije</th>
                      <th className="px-4 py-3 text-center font-semibold border-r border-white/20">Master studije</th>
                      <th className="px-4 py-3 text-center font-semibold border-r border-white/20">Specijalističke</th>
                      <th className="px-4 py-3 text-center font-semibold">Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map((year, index) => {
                      const stats = yearStats[year];
                      return (
                        <tr 
                          key={year} 
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-4 py-3 font-bold text-[#294a70] border-b border-gray-200">
                            {year}. godina
                          </td>
                          <td className="px-4 py-3 text-center border-b border-gray-200">
                            <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
                              {stats.bachelors}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center border-b border-gray-200">
                            <span className="inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                              {stats.masters}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center border-b border-gray-200">
                            <span className="inline-block bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
                              {stats.specialist}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center border-b border-gray-200">
                            <span className="inline-block bg-[#294a70] text-white font-bold px-4 py-1 rounded-full">
                              {stats.total}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Total Row */}
                    <tr className="bg-gradient-to-r from-[#294a70] to-[#3d5a7f] text-white font-bold">
                      <td className="px-4 py-4 text-left">UKUPNO</td>
                      <td className="px-4 py-4 text-center text-lg">
                        {podaci.filter(p => p.type === "bachelors").length}
                      </td>
                      <td className="px-4 py-4 text-center text-lg">
                        {podaci.filter(p => p.type === "masters").length}
                      </td>
                      <td className="px-4 py-4 text-center text-lg">
                        {podaci.filter(p => p.type === "specialist").length}
                      </td>
                      <td className="px-4 py-4 text-center text-xl">
                        {podaci.length}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistika mentora */}
            {mentorStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                  <span>👨‍🏫</span> Statistika mentora
                </h3>
                <div className="space-y-3">
                  {mentorStats.map(([mentor, count], index) => {
                    const maxCount = mentorStats[0][1];
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={mentor} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 bg-[#294a70] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-700 group-hover:text-[#294a70] transition-colors">{mentor}</span>
                            <span className="text-[#294a70] font-bold">{count} radova</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#294a70] to-[#3d5a7f] h-full rounded-full transition-all duration-500 group-hover:from-[#3d5a7f] group-hover:to-[#294a70]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Statistika članova komisija */}
            {committeeStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                  <span>👥</span> Statistika članova komisija
                </h3>
                <div className="space-y-3">
                  {committeeStats.map(([member, count], index) => {
                    const maxCount = committeeStats[0][1];
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={member} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">{member}</span>
                            <span className="text-green-600 font-bold">{count} radova</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-green-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Statistika ocjena i prosječna ocjena */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Statistika ocjena */}
              {gradeStats.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fadeIn">
                  <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                    <span>📊</span> Statistika ocjena
                  </h3>
                  <div className="space-y-4">
                    {gradeStats.map(({ grade, count }) => {
                      const totalGrades = gradeStats.reduce((sum, g) => sum + g.count, 0);
                      const percentage = (count / totalGrades) * 100;
                      const gradeColors: { [key: string]: string } = {
                        'A': 'from-green-500 to-green-600',
                        'B': 'from-blue-500 to-blue-600',
                        'C': 'from-yellow-500 to-yellow-600',
                        'D': 'from-orange-500 to-orange-600',
                        'E': 'from-red-400 to-red-500',
                        'F': 'from-red-600 to-red-700'
                      };
                      return (
                        <div key={grade} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-[#294a70] w-8 group-hover:scale-110 transition-transform">{grade}</span>
                              <span className="text-gray-600">({percentage.toFixed(1)}%)</span>
                            </div>
                            <span className="font-bold text-[#294a70] group-hover:scale-110 transition-transform">{count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`bg-gradient-to-r ${gradeColors[grade]} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prosječna ocjena */}
              <div className="bg-gradient-to-br from-[#294a70] to-[#3d5a7f] rounded-xl shadow-lg p-6 md:p-8 flex flex-col justify-center items-center text-white animate-fadeIn">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>⭐</span> Prosječna ocjena
                </h3>
                <div className="text-center">
                  <div className="text-8xl font-bold mb-4 drop-shadow-lg">{averageGrade}</div>
                  <p className="text-gray-200 text-lg mb-2">od 10.00</p>
                  <div className="mt-6 flex justify-center gap-2">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-12 rounded-full transition-all duration-300 ${
                          i < Math.floor(parseFloat(averageGrade)) 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white/30'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistika tema */}
            {topicStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                  <span>🎯</span> Statistika tema rada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topicStats.map(([topic, count], index) => {
                    const maxCount = topicStats[0][1];
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={topic} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-700 flex-1 group-hover:text-purple-600 transition-colors">{topic}</span>
                          <span className="text-purple-600 font-bold group-hover:scale-110 transition-transform">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Statistika ključnih riječi */}
            {keywordStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                  <span>🔑</span> Statistika ključnih riječi
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {keywordStats.map(([keyword, count]) => {
                    const maxCount = keywordStats[0][1];
                    const size = Math.max(14, Math.min(32, (count / maxCount) * 32));
                    return (
                      <div 
                        key={keyword}
                        className="bg-gradient-to-r from-[#294a70] to-[#3d5a7f] text-white px-4 py-2 rounded-full hover:shadow-xl transition-all hover:scale-110 cursor-pointer hover:from-[#3d5a7f] hover:to-[#294a70]"
                        style={{ fontSize: `${size}px` }}
                      >
                        <span className="font-semibold">{keyword}</span>
                        <span className="ml-2 text-xs opacity-80">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
            </>
            )}
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

      <UploadCSVModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUploadSuccess={fetchTheses}
      />
    </div>
  );
}