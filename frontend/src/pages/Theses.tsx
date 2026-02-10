import { FaSearch, FaFilter, FaUpload, FaSpinner, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UploadThesisModal from "../components/UploadThesisModal";
import api from "../services/api";

interface Thesis {
  id: number;
  first_name: string;
  last_name: string;
  thesis_title: string;
  thesis_document_url: string;
  thesis_type: string;
  defense_date: string | null;
}

export default function DiplomskiRadovi() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("datum-desc");
  const [showFilter, setShowFilter] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);
  const [thesisTypeFilter, setThesisTypeFilter] = useState<string>("all");

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/theses");
      setTheses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching theses:", err);
      setError("Greška prilikom učitavanja diplomskih radova. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj diplomski rad? Dokument će biti trajno uklonjen, a naslov rada povezan sa studentom će biti postavljen na '/'.")) {
      return;
    }

    try {
      await api.delete(`/theses/${id}`);
      await fetchTheses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting thesis:", err);
      alert("Greška prilikom brisanja diplomskog rada.");
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl}`;

      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Greška prilikom preuzimanja fajla.");
    }
  };

  // Filtriranje
  const filtrirani = theses.filter((p) => {
    const matchesSearch =
      p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.thesis_title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = thesisTypeFilter === "all" || p.thesis_type === thesisTypeFilter;

    return matchesSearch && matchesType;
  });

  // Sortiranje
  const sortirani = [...filtrirani].sort((a, b) => {
    switch (sortBy) {
      case "datum-asc":
        return new Date(a.defense_date || 0).getTime() - new Date(b.defense_date || 0).getTime();
      case "datum-desc":
        return new Date(b.defense_date || 0).getTime() - new Date(a.defense_date || 0).getTime();
      case "ime-asc":
        return a.first_name.localeCompare(b.first_name);
      case "prezime-asc":
        return a.last_name.localeCompare(b.last_name);
      case "naziv-asc":
        return (a.thesis_title || "").localeCompare(b.thesis_title || "");
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

      <div className="w-full flex-1 flex flex-col items-center justify-start px-4 md:px-8 py-8">
        <div className="w-full max-w-6xl">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-[#294a70] mb-4" />
              <p className="text-gray-600">Učitavanje diplomskih radova...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
              {error}
            </div>
          ) : sortirani.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-12 rounded-lg text-center font-medium">
              Nema pronađenih diplomskih radova.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block shadow-md rounded-2xl overflow-hidden bg-white">
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse table-auto min-w-[600px]">
                    <thead className="bg-[#294a70] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-base font-semibold">Ime i prezime</th>
                        <th className="px-6 py-4 text-left text-base font-semibold">Naziv diplomskog rada</th>
                        <th className="px-6 py-4 text-left text-base font-semibold">Tip rada</th>
                        <th className="px-6 py-4 text-center text-base font-semibold">Dokument</th>
                        {isAdmin && <th className="px-6 py-4 text-center text-base font-semibold">Akcije</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {sortirani.map((p, idx) => (
                        <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}>
                          <td className="px-6 py-4 text-sm sm:text-base text-gray-800 border-b border-gray-200">
                            {p.first_name} {p.last_name}
                          </td>
                          <td className="px-6 py-4 text-sm sm:text-base text-gray-800 border-b border-gray-200 font-medium">
                            {p.thesis_title || "/"}
                          </td>
                          <td className="px-6 py-4 text-sm sm:text-base text-gray-800 border-b border-gray-200 font-medium">
                            {p.thesis_type === 'bachelors' ? 'Osnovne studije' :
                              p.thesis_type === 'masters' ? 'Master studije' :
                                p.thesis_type === 'specialist' ? 'Specijalističke studije' :
                                  p.thesis_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm sm:text-base text-center border-b border-gray-200">
                            {p.thesis_document_url ? (
                              <button
                                onClick={() => handleDownload(p.thesis_document_url, `${p.last_name}-${p.first_name}.pdf`)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-[#294a70] text-[#294a70] rounded-md hover:bg-[#294a70] hover:text-white transition-all text-sm font-medium"
                              >
                                Preuzmi PDF
                              </button>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Nema dokumenta</span>
                            )}
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 text-sm sm:text-base text-center border-b border-gray-200">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedThesis(p);
                                    setShowUploadModal(true);
                                  }}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                  title="Dodaj/Izmijeni diplomski rad"
                                >
                                  <FaUpload size={12} />
                                  Dodaj
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                                  title="Obriši diplomski rad"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {sortirani.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{p.first_name} {p.last_name}</h3>
                      </div>
                      <span className="text-xs font-bold text-[#294a70]">
                        {p.thesis_type === 'bachelors' ? 'Osnovne studije' :
                          p.thesis_type === 'masters' ? 'Master studije' :
                            p.thesis_type === 'specialist' ? 'Specijalističke studije' :
                              p.thesis_type || 'N/A'}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">
                      {p.thesis_title || "/"}
                    </p>
                    <div className="pt-2 flex gap-2">
                      {p.thesis_document_url ? (
                        <button
                          onClick={() => handleDownload(p.thesis_document_url, `${p.last_name}-${p.first_name}.pdf`)}
                          className="flex-1 flex justify-center items-center px-4 py-2.5 bg-[#294a70] text-white rounded-lg font-semibold text-sm shadow-sm"
                        >
                          Preuzmi PDF
                        </button>
                      ) : (
                        <div className="flex-1 flex justify-center items-center px-4 py-2.5 bg-gray-50 text-gray-400 rounded-lg font-medium text-sm border border-gray-100">
                          Nema dokumenta
                        </div>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedThesis(p);
                              setShowUploadModal(true);
                            }}
                            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm"
                            title="Dodaj"
                          >
                            <FaUpload />
                            Dodaj
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold text-sm"
                            title="Obriši"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
        onSuccess={fetchTheses}
      />
    </div>
  );
}