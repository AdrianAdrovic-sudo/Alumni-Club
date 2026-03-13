import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  thesis: any;
}

const EditThesisModal: React.FC<EditThesisModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  thesis,
}) => {
  const [loading, setLoading] = useState(false);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<any[]>([]);
  const [alumniSearch, setAlumniSearch] = useState("");
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    title: "",
    subtitle: "",
    title_language: "cg",
    additional_title: "",
    additional_subtitle: "",
    additional_title_language: "",
    type: "bachelors",
    year: new Date().getFullYear(),
    file_url: "",
    mentor: "",
    committee_members: "",
    grade: "",
    topic: "",
    keywords: "",
    language: "",
    abstract: "",
    defense_date: "",
    defense_time: "",
    user_id: "",
  });

  // Učitaj alumni listu
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("/api/alumni/directory");
        if (response.data && Array.isArray(response.data.users)) {
          const filteredAlumni = response.data.users.filter((u: any) => u.role !== "admin");
          setAlumni(filteredAlumni);
        }
      } catch (err) {
        console.error("Greška pri učitavanju alumnista:", err);
      }
    };
    if (isOpen) {
      fetchAlumni();
    }
  }, [isOpen]);

  // Popuni formu sa podacima rada
  useEffect(() => {
    if (thesis) {
      const defenseDate = thesis.defense_date ? new Date(thesis.defense_date) : null;
      
      setFormData({
        first_name: thesis.first_name || "",
        last_name: thesis.last_name || "",
        title: thesis.title || "",
        subtitle: thesis.subtitle || "",
        title_language: thesis.title_language || "cg",
        additional_title: thesis.additional_title || "",
        additional_subtitle: thesis.additional_subtitle || "",
        additional_title_language: thesis.additional_title_language || "",
        type: thesis.type || "bachelors",
        year: thesis.year || new Date().getFullYear(),
        file_url: thesis.fileUrl || "",
        mentor: thesis.mentor || "",
        committee_members: thesis.committee_members || "",
        grade: thesis.grade || "",
        topic: thesis.topic || "",
        keywords: thesis.keywords || "",
        language: thesis.language || "",
        abstract: thesis.abstract || "",
        defense_date: defenseDate ? defenseDate.toISOString().split('T')[0] : "",
        defense_time: defenseDate ? defenseDate.toTimeString().slice(0, 5) : "",
        user_id: thesis.user_id || "",
      });

      // Postavi trenutnog alumnistu ako postoji
      if (thesis.user_id) {
        const currentAlumni = alumni.find((a: any) => a.id === thesis.user_id);
        if (currentAlumni) {
          setSelectedAlumni(currentAlumni);
          setAlumniSearch(`${currentAlumni.first_name} ${currentAlumni.last_name}`);
        }
      } else {
        setSelectedAlumni(null);
        setAlumniSearch("");
      }
    }
  }, [thesis, alumni]);

  // Filter alumni based on search
  useEffect(() => {
    if (alumniSearch.trim() === "") {
      setFilteredAlumni(alumni.slice(0, 10)); // Prikaži prvih 10
    } else {
      const searchLower = alumniSearch.toLowerCase();
      const filtered = alumni.filter((a: any) => {
        const fullName = `${a.first_name} ${a.last_name}`.toLowerCase();
        const email = a.email.toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
      setFilteredAlumni(filtered.slice(0, 10)); // Max 10 rezultata
    }
  }, [alumniSearch, alumni]);

  const handleAlumniSelect = (alumnus: any) => {
    setSelectedAlumni(alumnus);
    setAlumniSearch(`${alumnus.first_name} ${alumnus.last_name}`);
    setFormData({ ...formData, user_id: alumnus.id });
    setShowAlumniDropdown(false);
  };

  const handleAlumniClear = () => {
    setSelectedAlumni(null);
    setAlumniSearch("");
    setFormData({ ...formData, user_id: "" });
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Kombinuj datum i vrijeme
      let defense_datetime = null;
      if (formData.defense_date && formData.defense_time) {
        defense_datetime = `${formData.defense_date}T${formData.defense_time}:00`;
      }

      const payload = {
        ...formData,
        defense_date: defense_datetime,
        user_id: formData.user_id ? Number(formData.user_id) : null,
      };

      const token = localStorage.getItem("token");
      await axios.put(`/api/theses/${thesis.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Rad uspješno ažuriran!");
      onEditSuccess();
      onClose();
    } catch (error: any) {
      console.error("Greška pri ažuriranju rada:", error);
      alert(error.response?.data?.message || "Greška pri ažuriranju rada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#294a70]">✏️ Edituj rad</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Alumnista */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Alumnista (vlasnik rada)
            </label>
            <div className="relative">
              <input
                type="text"
                value={alumniSearch}
                onChange={(e) => {
                  setAlumniSearch(e.target.value);
                  setShowAlumniDropdown(true);
                }}
                onFocus={() => setShowAlumniDropdown(true)}
                placeholder="Počni kucati ime, prezime ili email..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#294a70] pr-20"
              />
              {selectedAlumni && (
                <button
                  type="button"
                  onClick={handleAlumniClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Ukloni
                </button>
              )}
              
              {/* Dropdown sa rezultatima */}
              {showAlumniDropdown && filteredAlumni.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredAlumni.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      onClick={() => handleAlumniSelect(alumnus)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-semibold text-gray-800">
                        {alumnus.first_name} {alumnus.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{alumnus.email}</div>
                      {alumnus.enrollment_year && (
                        <div className="text-xs text-gray-400">Generacija: {alumnus.enrollment_year}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedAlumni 
                ? `Izabran: ${selectedAlumni.first_name} ${selectedAlumni.last_name} (${selectedAlumni.email})`
                : "Kucaj da pretražiš alumniste ili ostavi prazno"}
            </p>
          </div>

          {/* Ime i prezime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ime *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prezime *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Naslov */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Naziv rada *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Podnaslov i jezik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Podnaslov</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jezik naslova *</label>
              <select
                name="title_language"
                value={formData.title_language}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="cg">Crnogorski (cg)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
          </div>

          {/* Dodatni naslov */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-700">Prevod naslova (opciono)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-2">Dodatni naslov</label>
                <input
                  type="text"
                  name="additional_title"
                  value={formData.additional_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dodatni podnaslov</label>
                <input
                  type="text"
                  name="additional_subtitle"
                  value={formData.additional_subtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jezik dodatnog naslova</label>
              <select
                name="additional_title_language"
                value={formData.additional_title_language}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Izaberi --</option>
                <option value="cg">Crnogorski (cg)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
          </div>

          {/* Tip i godina */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tip rada *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="bachelors">Bachelors</option>
                <option value="masters">Masters</option>
                <option value="specialist">Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Godina *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max="2100"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* PDF link */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">PDF Link</label>
            <input
              type="text"
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              placeholder="https://example.com/rad.pdf"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Mentor */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Mentor *</label>
            <input
              type="text"
              name="mentor"
              value={formData.mentor}
              onChange={handleChange}
              required
              placeholder="Prof. dr Ivan Petrović"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Članovi komisije */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Članovi komisije</label>
            <input
              type="text"
              name="committee_members"
              value={formData.committee_members}
              onChange={handleChange}
              placeholder="Prof. dr Ivan Petrović, Doc. dr Ana Jovanović"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Ocjena i jezik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ocjena</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Izaberi --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jezik rada</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Izaberi --</option>
                <option value="cg">Crna Gora</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Tema */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tema rada *</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              placeholder="Machine Learning"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Ključne riječi */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Ključne riječi *</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              required
              placeholder="AI, Machine Learning, Neural Networks"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Odvojene zarezom</p>
          </div>

          {/* Sažetak */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Sažetak</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Datum odbrane */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Datum i vrijeme odbrane</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="defense_date"
                value={formData.defense_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="time"
                name="defense_time"
                value={formData.defense_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#294a70] text-white rounded-lg hover:bg-[#1f3a5a] disabled:opacity-50"
            >
              {loading ? "Čuvanje..." : "Sačuvaj izmjene"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditThesisModal;
