import { FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
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
  const [showCsvModal, setShowCsvModal] = useState(false);

  useEffect(() => {
  fetch("http://localhost:4000/api/theses")
    .then(res => res.json())
    .then(data => {
    console.log("API DATA:", data);
    setPodaci(data);
})
    .catch(err => console.error(err));
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

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:4000/api/theses/upload-csv", {
      method: "POST",
      body: formData
    });

   const data = await response.json();
   alert("Uspješno dodato " + data.count + " radova");

  } catch (error) {
    console.error("Greška pri uploadu:", error);
  }


};

  const [podaci, setPodaci] = useState<any[]>([]);



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
      return (a.datum || 0) - (b.datum || 0);

    case "datum-desc":
      return (b.datum || 0) - (a.datum || 0);

    case "ime-asc":
      return (a.ime || "").localeCompare(b.ime || "");

    case "prezime-asc":
      return (a.prezime || "").localeCompare(b.prezime || "");

    case "naziv-asc":
      return (a.naziv || "").localeCompare(b.naziv || "");

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

        {/* CSV Upload Button (Admin only) */}
        {isAdmin && (
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id="csvUpload"
            />

            <button
              onClick={() => document.getElementById("csvUpload")?.click()}
              className="flex items-center gap-2 px-3 py-2 -ml-110 bg-[#50C878] text-white rounded-md hover:bg-[#e6951a] transition-colors"
            >
            <FaUpload />
            <span>Upload CSV</span>
            </button>
          </div>
        )}

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
      <td className="px-6 py-3">{p.title}</td>
      <td className="px-6 py-3">{p.year}</td>

      {isAdmin && (
        <td className="px-6 py-3">
          <button
            onClick={() =>
              handleDownload(p.file_url, `${p.last_name}-${p.first_name}.pdf`)
            }
            className="bg-[#355070] text-white px-4 py-1 rounded-md hover:bg-[#2b4058]"
          >
            ⬆ Otpremi
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
              <div className="bg-white border-2 border-[#294a70] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Ukupno radova</h3>
                  <span className="text-3xl">📚</span>
                </div>
                <p className="text-5xl font-bold text-[#294a70] mb-2">{podaci.length}</p>
                <p className="text-sm text-gray-500">Svi tipovi studija</p>
              </div>

              {/* Bachelors */}
              <div className="bg-white border-2 border-blue-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Osnovne studije</h3>
                  <span className="text-3xl">🎓</span>
                </div>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {podaci.filter(p => p.type === "bachelors").length}
                </p>
                <p className="text-sm text-gray-500">
                  {((podaci.filter(p => p.type === "bachelors").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>

              {/* Masters */}
              <div className="bg-white border-2 border-green-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Master studije</h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-5xl font-bold text-green-600 mb-2">
                  {podaci.filter(p => p.type === "masters").length}
                </p>
                <p className="text-sm text-gray-500">
                  {((podaci.filter(p => p.type === "masters").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>

              {/* Specialist */}
              <div className="bg-white border-2 border-purple-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">Specijalističke</h3>
                  <span className="text-3xl">⭐</span>
                </div>
                <p className="text-5xl font-bold text-purple-600 mb-2">
                  {podaci.filter(p => p.type === "specialist").length}
                </p>
                <p className="text-sm text-gray-500">
                  {((podaci.filter(p => p.type === "specialist").length / podaci.length) * 100).toFixed(1)}% od ukupno
                </p>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#294a70] mb-6 flex items-center gap-2">
                <span>📈</span> Grafički prikaz po godinama
              </h3>
              
              <div className="flex items-end justify-between gap-3 md:gap-4 h-80 border-l-4 border-b-4 border-[#294a70] pl-4 pb-4 bg-gradient-to-t from-gray-50 to-white rounded-bl-lg">
                {years.sort((a, b) => a - b).map(year => {
                  const stats = yearStats[year];
                  const heightPercentage = (stats.total / maxThesesInYear) * 100;
                  
                  return (
                    <div key={year} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar */}
                      <div className="w-full flex flex-col items-center">
                        <span className="text-sm md:text-base font-bold text-[#294a70] mb-2 bg-white px-2 py-1 rounded shadow-sm">{stats.total}</span>
                        <div 
                          className="w-full bg-gradient-to-t from-[#294a70] via-[#3d5a7f] to-[#5a7fa0] rounded-t-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer relative group border-2 border-[#294a70]"
                          style={{ height: `${heightPercentage}%`, minHeight: '50px' }}
                        >
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