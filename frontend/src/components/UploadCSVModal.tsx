import React, { useState } from "react";

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Molimo izaberite CSV fajl.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("/api/theses/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload nije uspio.");
      }

      alert("CSV uspješno uploadovan!");
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Greška pri uploadu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold mb-1">Napomena:</p>
        <p>CSV fajl mora imati sljedeće kolone:</p>

        <div className="bg-gray-100 p-3 mt-2 rounded text-sm leading-6 max-h-64 overflow-y-auto">
          <div className="mb-2 font-bold text-[#294a70]">Obavezne kolone:</div>
          <div><b>first_name</b> – ime studenta</div>
          <div><b>last_name</b> – prezime studenta</div>
          <div><b>title</b> – naziv rada</div>
          <div><b>type</b> – bachelors / masters / specialist</div>
          <div><b>year</b> – godina</div>
          <div><b>file_url</b> – link na rad</div>
          
          <div className="mt-3 mb-2 font-bold text-[#294a70]">Opcione kolone (za statistiku):</div>
          <div><b>mentor</b> – mentor (npr. "Prof. dr Ivan Petrović")</div>
          <div><b>committee_members</b> – članovi komisije, odvojeni zarezom</div>
          <div><b>grade</b> – ocjena (A, B, C, D, E, F)</div>
          <div><b>topic</b> – tema rada</div>
          <div><b>keywords</b> – ključne riječi, odvojene zarezom</div>
          <div><b>language</b> – jezik rada (npr. "English", "Serbian", "Bosnian")</div>
          <div><b>abstract</b> – sažetak rada</div>
        </div>

        <p className="mt-2">Primjer:</p>

        <pre className="bg-gray-100 p-3 rounded text-xs mt-3 whitespace-pre-wrap overflow-x-auto">
first_name,last_name,title,type,year,file_url,mentor,committee_members,grade,topic,keywords,language,abstract
Marko,Markovic,Primena masinskog ucenja,bachelors,2024,https://example.com/rad1.pdf,Prof. dr Ivan Petrovic,"Prof. dr Ivan Petrovic, Doc. dr Ana Jovanovic",A,Machine Learning,"AI, Machine Learning",English,"Ovaj rad istrazuje primenu..."
        </pre>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Izaberite CSV fajl
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border rounded-md w-full p-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Otkaži
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-[#355070] text-white rounded-md hover:bg-[#2b4058]"
          >
            {loading ? "Upload..." : "Upload CSV"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadCSVModal;