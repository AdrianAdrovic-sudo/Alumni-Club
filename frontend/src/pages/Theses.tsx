import { FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UploadThesisModal from "../components/UploadThesisModal";

export default function DiplomskiRadovi() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
    { ime: "Miloš", prezime: "Žižić", naziv: "Informacioni sistem Rent-a cara", datum: "10.07.2009.", fileUrl: "/theses/zizic-milos.pdf", type: "bachelors" },
    { ime: "Tripo", prezime: "Matijević", naziv: "Prikupljanje činjenica za informacioni sistem studentske službe", datum: "10.07.2009.", fileUrl: "/theses/matijevic-tripo.pdf", type: "masters" },
    { ime: "Zoran", prezime: "Ćorović", naziv: "Model, objekti i veze informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/corovic-zoran.pdf", type: "bachelors" },
    { ime: "Dženan", prezime: "Strujić", naziv: "Relacioni model informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/strujic-dzenan.pdf", type: "specialist" },
    { ime: "Novak", prezime: "Radulović", naziv: "Forme i izvještaj informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/radulovic-novak.pdf", type: "masters" },
    { ime: "Igor", prezime: "Pekić", naziv: "Sigurnost informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/pekic-igor.pdf", type: "bachelors" },
    { ime: "Ana", prezime: "Jovanović", naziv: "Web aplikacija za studentsku službu", datum: "10.07.2009.", fileUrl: "/theses/jovanovic-ana.pdf", type: "specialist" },
    { ime: "Jelena", prezime: "Marković", naziv: "Implementacija informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/markovic-jelena.pdf", type: "masters" },
    { ime: "Marko", prezime: "Nikolić", naziv: "Testiranje informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/nikolic-marko.pdf", type: "bachelors" },
    { ime: "Ivana", prezime: "Stojanović", naziv: "Održavanje informacionog sistema studentske službe", datum: "10.07.2009.", fileUrl: "/theses/stojanovic-ivana.pdf", type: "specialist" },
  ];

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
        return new Date(a.datum.split('.').reverse().join('-')) - new Date(b.datum.split('.').reverse().join('-'));
      case "datum-desc":
        return new Date(b.datum.split('.').reverse().join('-')) - new Date(a.datum.split('.').reverse().join('-'));
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
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white px-4 py-16 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Diplomski radovi
        </h1>
        <p className="text-base md:text-lg opacity-90 max-w-3xl mx-auto">
          Pregledajte bazu diplomskih radova naših studenata. Koristite
          pretragu da biste brzo pronašli radove po imenu, prezimenu ili
          nazivu rada.
        </p>
      </div>

      {/* SEARCH & FILTER */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 md:px-16 mt-8">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors"
          >
            <FaFilter />
            <span>Sortiraj</span>
          </button>

          {showFilter && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#294a70] rounded-lg shadow-xl overflow-hidden z-10">
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

          <input
            type="text"
            placeholder="Pretraga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 h-[45px] border border-gray-300 border-l-0 rounded-r-md text-sm md:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffab1f] focus:border-[#ffab1f]"
          />
        </div>
      </div>


      <div className="w-full flex-1 flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-6xl shadow-md rounded-2xl overflow-hidden bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-[#294a70] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Ime
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Prezime
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Naziv diplomskog rada
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Datum diplomiranja
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Actions
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
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.ime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.prezime}
                    </td>
                    <td className="px-4 py-3 pb-[28px] text-sm text-gray-800 border-b border-gray-200">
                      <button
                        onClick={() => handleDownload(p.fileUrl, `${p.prezime}-${p.ime}.pdf`)}
                        className="text-gray-800 hover:text-[#294a70] cursor-pointer text-left bg-transparent border-none p-0 m-0 font-normal transition-colors"
                      >
                        {p.naziv}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.datum}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-sm border-b border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedThesis(p);
                            setShowUploadModal(true);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#294a70] text-white rounded-md hover:bg-[#1f3a5a] transition-colors text-sm font-medium"
                        >
                          <FaUpload size={14} />
                          Upload
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
