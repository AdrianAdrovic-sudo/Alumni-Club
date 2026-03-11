import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AddThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddThesisModal({ isOpen, onClose }: AddThesisModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Alumnista polja
  const [selectExistingAlumni, setSelectExistingAlumni] = useState(true);
  const [selectedAlumniId, setSelectedAlumniId] = useState("");
  const [newAlumniFirstName, setNewAlumniFirstName] = useState("");
  const [newAlumniLastName, setNewAlumniLastName] = useState("");

  // Polja za naslov
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleLanguage, setTitleLanguage] = useState("en");
  const [additionalTitle, setAdditionalTitle] = useState("");
  const [additionalSubtitle, setAdditionalSubtitle] = useState("");
  const [additionalTitleLanguage, setAdditionalTitleLanguage] = useState("");

  // Ostala polja
  const [thesisType, setThesisType] = useState("bachelors");
  const [year, setYear] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [mentor, setMentor] = useState("");
  const [committeeMembers, setCommitteeMembers] = useState("");
  const [grade, setGrade] = useState("");
  const [language, setLanguage] = useState("en");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [abstract, setAbstract] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Funkcionalnost dodavanja rada će biti implementirana kasnije.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#294a70]">Dodaj diplomski rad</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alumnista sekcija - samo za admina */}
          {isAdmin && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg text-[#294a70] mb-4">Alumnista</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectExistingAlumni}
                      onChange={() => setSelectExistingAlumni(true)}
                      className="text-[#294a70]"
                    />
                    <span>Izaberi postojećeg</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!selectExistingAlumni}
                      onChange={() => setSelectExistingAlumni(false)}
                      className="text-[#294a70]"
                    />
                    <span>Dodaj novog</span>
                  </label>
                </div>

                {selectExistingAlumni ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Izaberi alumnistu
                    </label>
                    <select
                      value={selectedAlumniId}
                      onChange={(e) => setSelectedAlumniId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                    >
                      <option value="">-- Izaberi alumnistu --</option>
                      {/* Lista alumnista će biti učitana dinamički */}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ime <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAlumniFirstName}
                        onChange={(e) => setNewAlumniFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        placeholder="Unesite ime"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prezime <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAlumniLastName}
                        onChange={(e) => setNewAlumniLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                        placeholder="Unesite prezime"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Naslov sekcija */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-[#294a70] mb-4">Naslov rada</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Naziv rada <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Unesite naziv rada"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Podnaslov (opciono)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Unesite podnaslov"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jezik naslova <span className="text-red-500">*</span>
                </label>
                <select
                  value={titleLanguage}
                  onChange={(e) => setTitleLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  required
                >
                  <option value="en">English</option>
                  <option value="cg">Crna Gora</option>
                </select>
              </div>

              <div className="border-t border-gray-300 pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Dodatni naslov (opciono)</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dodatni naslov
                    </label>
                    <input
                      type="text"
                      value={additionalTitle}
                      onChange={(e) => setAdditionalTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                      placeholder="Unesite dodatni naslov"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dodatni podnaslov
                    </label>
                    <input
                      type="text"
                      value={additionalSubtitle}
                      onChange={(e) => setAdditionalSubtitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                      placeholder="Unesite dodatni podnaslov"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jezik dodatnog naslova
                    </label>
                    <select
                      value={additionalTitleLanguage}
                      onChange={(e) => setAdditionalTitleLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                    >
                      <option value="">-- Izaberi jezik --</option>
                      <option value="en">English</option>
                      <option value="cg">Crna Gora</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Osnovni podaci */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-[#294a70] mb-4">Osnovni podaci</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tip rada <span className="text-red-500">*</span>
                </label>
                <select
                  value={thesisType}
                  onChange={(e) => setThesisType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  required
                >
                  <option value="bachelors">Osnovne studije</option>
                  <option value="masters">Master studije</option>
                  <option value="specialist">Specijalističke studije</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Godina <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jezik rada <span className="text-red-500">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  required
                >
                  <option value="en">English</option>
                  <option value="cg">Crna Gora</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ocjena
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                >
                  <option value="">-- Izaberi ocjenu --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PDF link
              </label>
              <input
                type="url"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                placeholder="https://example.com/thesis.pdf"
              />
            </div>
          </div>

          {/* Mentor i komisija */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-[#294a70] mb-4">Mentor i komisija</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mentor
                </label>
                <input
                  type="text"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Ime i prezime mentora"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Članovi komisije
                </label>
                <input
                  type="text"
                  value={committeeMembers}
                  onChange={(e) => setCommitteeMembers(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Odvojeni zarezom (npr. Ime Prezime, Ime Prezime)"
                />
              </div>
            </div>
          </div>

          {/* Tema, ključne riječi i sažetak */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-[#294a70] mb-4">Dodatne informacije</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tema
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Tema rada"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ključne riječi
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70]"
                  placeholder="Odvojene zarezom (npr. AI, Machine Learning, Python)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sažetak (Abstract)
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#294a70] min-h-[120px]"
                  placeholder="Unesite sažetak rada"
                />
              </div>
            </div>
          </div>

          {/* Dugmad */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#294a70] text-white rounded-lg hover:bg-[#1f3a5a] transition-colors font-semibold"
            >
              Dodaj rad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
