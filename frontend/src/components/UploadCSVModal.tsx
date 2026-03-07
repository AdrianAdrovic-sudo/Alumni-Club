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

      const response = await fetch("http://localhost:4000/api/theses/upload-csv", {
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold mb-1">Napomena:</p>
        <p>CSV fajl mora imati sljedeće kolone:</p>

        <div className="bg-gray-100 p-3 mt-2 rounded text-sm leading-6">
          <div><b>first_name</b> – ime studenta</div>
          <div><b>last_name</b> – prezime studenta</div>
          <div><b>title</b> – naziv rada</div>
          <div><b>type</b> – bachelors / masters</div>
          <div><b>year</b> – godina</div>
          <div><b>file_url</b> – link na rad</div>
        </div>

        <p className="mt-2">Primjer:</p>

        <pre className="bg-gray-100 p-3 rounded text-xs mt-3 whitespace-pre-wrap">
          first_name,last_name,title,type,year,file_url
          Marko,Markovic,Informacioni sistem biblioteke,bachelors,2021,https://example.com/rad1.pdf
          Ana,Petrovic,Web aplikacija za ucenje,masters,2022,https://example.com/rad2.pdf
          Ivan,Jovanovic,Sistem za upravljanje projektima,bachelors,2020,https://example.com/rad3.pdf
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