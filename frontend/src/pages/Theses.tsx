import { FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UploadThesisModal from "../components/UploadThesisModal";
import api from "../services/api";

export default function DiplomskiRadovi() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("defense_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilter, setShowFilter] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);
  const [thesisTypeFilter, setThesisTypeFilter] = useState<string>("all");
  const [theses, setTheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheses();
  }, [searchTerm, sortBy, sortOrder, thesisTypeFilter]); // Add dependencies to auto-refresh

  const fetchTheses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/theses", {
        params: {
          search: searchTerm,
          type: thesisTypeFilter,
          sortBy: sortBy, // Pass sort param to backend
          sortOrder: sortOrder
        }
      });
      setTheses(response.data.theses);
    } catch (error) {
      console.error("Failed to fetch theses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mapped for display - backend field names might differ slightly, adjust if needed
  // Backend returns: title, student_first_name, student_last_name, defense_date, etc.
  // Frontend expectation: ime, prezime, naziv, datum
  const displayTheses = theses.map(t => ({
    ...t,
    // Fallback to "Unknown" if name is missing
    ime: t.student_first_name || "Unknown",
    prezime: t.student_last_name || "User",
    naziv: t.title || "Untitled Thesis",
    datum: t.defense_date ? new Date(t.defense_date).toLocaleDateString("de-DE") : "N/A", // Format as DD.MM.YYYY
    fileUrl: t.document_url
  }));

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
                  onClick={() => { setSortBy("defense_date"); setSortOrder("desc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "defense_date" && sortOrder === "desc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Datum (najnoviji prvo)
                </button>
                <button
                  onClick={() => { setSortBy("defense_date"); setSortOrder("asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "defense_date" && sortOrder === "asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Datum (najstariji prvo)
                </button>
                <button
                  onClick={() => { setSortBy("student_name"); setSortOrder("asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "student_name" && sortOrder === "asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Ime (A-Z)
                </button>
                <button
                  onClick={() => { setSortBy("student_last_name"); setSortOrder("asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "student_last_name" && sortOrder === "asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
                >
                  Prezime (A-Z)
                </button>
                <button
                  onClick={() => { setSortBy("title"); setSortOrder("asc"); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-3 text-sm text-white transition-all ${sortBy === "title" && sortOrder === "asc" ? "bg-[#1f3a5a] font-semibold" : "hover:bg-[#1f3a5a]"}`}
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
                  {loading ? (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="text-center py-8">Učitavanje...</td>
                    </tr>
                  ) : displayTheses.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} className="text-center py-8">Nema rezultata.</td>
                    </tr>
                  ) : (
                    displayTheses.map((p, idx) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Thesis Modal */}
      <UploadThesisModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedThesis(null);
          // Refresh list after upload
          fetchTheses();
        }}
        thesisContext={selectedThesis}
      />
    </div>
  );
}