import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { FileText, Mail, Briefcase, MapPin, User, BookOpen, Save, X } from "lucide-react";

export default function MyProfileEdit() {
  console.log("Rendering MyProfileEdit");
  const navigate = useNavigate();  
  

  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    pozicija: "",
    nivoStudija: "",
    smjer: "",
    godinaZavrsetka: "",
    mjestoRada: "",
    firma: "",
    javniProfil: false,
    profilnaSlika: "",
    cvFileName: "",
    diplomskiFileName: ""
  });

  const smjerOpcije = {
    "Osnovne studije": [
      "Softversko inženjerstvo",
      "Informaciono-komunikacione tehnologije"
    ],
    "Master studije": [
      "Informaciono-komunikacione tehnologije",
      "Softverski inženjering",
      "Informatika u obrazovanju"
    ],
    "Specijalističke studije": [
      "Informacione tehnologije"
    ]
  };

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
    setFormData({
      ime: profileData.ime || "",
      prezime: profileData.prezime || "",
      email: profileData.email || "",
      pozicija: profileData.pozicija || "",
      nivoStudija: profileData.nivoStudija || "",
      smjer: profileData.smjer || "",
      godinaZavrsetka: profileData.godinaZavrsetka || "",
      mjestoRada: profileData.mjestoRada || "",
      firma: profileData.firma || "",
      javniProfil: profileData.javniProfil || false,
      profilnaSlika: profileData.profilnaSlika || "",
      cvFileName: profileData.cvFileName || "",
      diplomskiFileName: profileData.diplomskiFileName || ""
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "nivoStudija") {
      setFormData(prev => ({ ...prev, [name]: value, smjer: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilnaSlika: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, cvFileName: file.name }));
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("profileData", JSON.stringify(formData));
    navigate("/MyProfile"); 
  };

  const handleCancel = () => {
    navigate("/MyProfile");  
  };

  

  return (
      <div className="w-full min-h-screen bg-white">
      <div className="bg-linear-to-br from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center">
        <h1 className="text-5xl mb-4 font-bold">Izmijenite Profil</h1>
        <p className="text-xl opacity-90">Ažurirajte svoje podatke</p>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-5">
          
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-[#ffab1f]/30 transition-all group-hover:scale-105 group-hover:shadow-3xl">
              {formData.profilnaSlika ? (
                <img
                  src={formData.profilnaSlika}
                  className="w-full h-full object-cover"
                  alt="Profil"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-400">
                  <User size={90} />
                </div>
              )}
            </div>
          </div>
          <label className="mt-6 px-8 py-3 bg-linear-to-br from-[#ffab1f] to-[#ff9500] text-white font-bold rounded-full cursor-pointer hover:from-[#ff9500] hover:to-[#ffab1f] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            Promijenite sliku
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-6">
          
          <FormField
            icon={<User />}
            label="Ime"
            name="ime"
            type="text"
            value={formData.ime}
            onChange={handleChange}
            required
            placeholder="Unesite ime..."
            
          />

          <FormField
            icon={<User />}
            label="Prezime"
            name="prezime"
            type="text"
            value={formData.prezime}
            onChange={handleChange}
            required
            placeholder="Unesite prezime..."
          />

          <FormField
            icon={<Mail />}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Unesite email..."
          />

          <FormField
            icon={<Briefcase />}
            label="Pozicija"
            name="pozicija"
            type="text"
            value={formData.pozicija}
            onChange={handleChange}
            placeholder="Unesite poziciju..."
          />

          <FormSelect
            icon={<BookOpen />}
            label="Nivo studija"
            name="nivoStudija"
            value={formData.nivoStudija}
            onChange={handleChange}
            options={["Osnovne studije", "Master studije", "Specijalističke studije"]}
            required
          />

          {formData.nivoStudija && (
            <FormSelect
              icon={<BookOpen />}
              label="Smjer"
              name="smjer"
              value={formData.smjer}
              onChange={handleChange}
              options={smjerOpcije[formData.nivoStudija as keyof typeof smjerOpcije] || []}
              required
            />
          )}

          <FormField
            icon={<BookOpen />}
            label="Godina diplomiranja"
            name="godinaZavrsetka"
            type="number"
            value={formData.godinaZavrsetka}
            onChange={handleChange}
            min="2009"
            max={new Date().getFullYear()}
            placeholder="Unesite godinu diplomiranja..."
          />

          <FormField
            icon={<MapPin />}
            label="Mjesto rada"
            name="mjestoRada"
            type="text"
            value={formData.mjestoRada}
            onChange={handleChange}
            placeholder="Unesite mjesto rada..."
          />

          <FormField
            icon={<Briefcase />}
            label="Firma"
            name="firma"
            type="text"
            value={formData.firma}
            onChange={handleChange}
            placeholder="Unesite naziv firme..."
          />


          
          <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffab1f]/30 transition-all group">
          <div className="text-[#ffab1f] group-hover:scale-110 transition-transform">
            <FileText />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-2">CV</label>
            <p className="text-lg font-bold text-[#294a70]">
            </p>
          </div>
          <label className="px-5 py-2.5 text-white font-bold text-sm
                            bg-linear-to-br from-[#294a70] to-[#3a5a80]
                            hover:from-[#ffab1f] hover:to-[#ff9500]
                            rounded-xl
                            transform transition hover:scale-105
                            shadow-md hover:shadow-lg cursor-pointer">
            Postavite CV
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVUpload}
              className="hidden"
            />
            </label>
            </div>

   <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffab1f]/30 transition-all group">
  <div className="text-[#ffab1f] group-hover:scale-110 transition-transform">
    <User />
  </div>
  <div className="flex-1">
    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-2">Vidljivost profila</label>
    <div className="flex gap-3">
      <button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, javniProfil: false }))}
  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all
    ${!formData.javniProfil 
      ? "bg-[#ffab1f] text-white shadow-md" 
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
>
  Privatan
</button>
<button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, javniProfil: true }))}
  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all
    ${formData.javniProfil 
      ? "bg-[#ffab1f] text-white shadow-md" 
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
>
  Javan
</button>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      {formData.javniProfil 
        ? "Drugi alumnisti mogu vidjeti tvoj profil" 
        : "Tvoj profil je sakriven od drugih alumnista"}
    </p>
  </div>
</div>

        </div>

        <div className="flex gap-5 mt-10">
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 bg-linear-to-br from-[#294a70] via-[#3a5a80] to-[#294a70] text-white 
            font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl hover:from-[#ffab1f] hover:via-[#ff9500] hover:to-[#ffab1f] 
            transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Save size={22} />
            Sačuvaj izmjene
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-4 bg-linear-to-br from-gray-200 to-gray-300 text-gray-700 font-bold text-lg rounded-2xl 
            shadow-lg hover:shadow-xl hover:from-gray-300 hover:to-gray-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <X size={22} />
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  icon,
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  min,
  max,
  placeholder
}: {
  icon: any;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string;
  max?: number;
  placeholder?: string;
}) {
    return (
    <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffab1f]/30 transition-all group">
      <div className="text-[#ffab1f] group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-2">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className="w-full text-lg font-bold text-[#294a70] bg-transparent border-none 
          focus:outline-none focus:ring-0 placeholder-gray-300 [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
          style={{
            colorScheme: type === 'number' ? 'light' : 'normal'
          }}
        />
      </div>
    </div>
  );
}

function FormSelect({
  icon,
  label,
  name,
  value,
  onChange,
  options,
  required = false
}: {
  icon: any;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-[#ffab1f]/30 transition-all group">
      <div className="text-[#ffab1f] group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-2">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full text-lg font-bold text-[#294a70] bg-transparent border-none 
          focus:outline-none focus:ring-0 cursor-pointer"
        >
          <option value="" disabled>Izaberite...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}