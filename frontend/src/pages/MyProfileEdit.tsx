
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, Briefcase, MapPin, User, BookOpen, Save, X } from "lucide-react";

export default function MyProfileEdit() {
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
    profilnaSlikaFile: null as File | null,
    cvFileName: "",
    cvFile: null as File | null,
    diplomskiFileName: "",
  });

  const smjerOpcije = {
    "Osnovne studije": ["Softversko inženjerstvo", "Informaciono-komunikacione tehnologije"],
    "Master studije": ["Informaciono-komunikacione tehnologije", "Softverski inženjering", "Informatika u obrazovanju"],
    "Specijalističke studije": ["Informacione tehnologije"],
  };

  // UCITAVANJE PODATAKA SA BACKENDA
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const resp = await fetch("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();

        setFormData(prev => ({
          ...prev,
          ime: data.first_name || "",
          prezime: data.last_name || "",
          email: data.email || "",
          pozicija: data.position || "",
          nivoStudija: data.study_level || "",
          smjer: data.study_direction || "",
          godinaZavrsetka: data.enrollment_year || "",
          mjestoRada: data.work_location || "",
          firma: data.occupation || "",
          javniProfil: data.is_public ?? false,
          profilnaSlika: data.profile_picture
            ? `http://localhost:4000${data.profile_picture}`
            : "",
        }));
      } catch (err) {
        console.error("loadProfile error:", err);
      }
    }

    loadProfile();
  }, []);

  // HANDLERI
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "nivoStudija") {
      setFormData(prev => ({ ...prev, nivoStudija: value, smjer: "" }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, profilnaSlikaFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilnaSlika: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      cvFile: file,
      cvFileName: file.name,
    }));
  };

  // SLANJE NA BACKEND
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    // 1) Tekstualni podaci
    await fetch("http://localhost:4000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        pozicija: formData.pozicija,
        nivoStudija: formData.nivoStudija,
        smjer: formData.smjer,
        firma: formData.firma,
        mjestoRada: formData.mjestoRada,
        godinaZavrsetka: formData.godinaZavrsetka,
        javniProfil: formData.javniProfil,
      }),
    });

    // 2) Avatar upload
    if (formData.profilnaSlikaFile) {
      const fd = new FormData();
      fd.append("avatar", formData.profilnaSlikaFile);

      await fetch("http://localhost:4000/api/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
    }

    // 3) CV upload
    if (formData.cvFile) {
      const fd = new FormData();
      fd.append("cv", formData.cvFile);

      await fetch("http://localhost:4000/api/users/me/cv", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
    }

    navigate("/MyProfile");
  };

  const handleCancel = () => navigate("/MyProfile");

  return (
    <>
      <div className="w-full min-h-screen bg-white">
        <div className="bg-linear-to-br from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center">
          <h1 className="text-5xl mb-4 font-bold">Izmijenite profil</h1>
          <p className="text-xl opacity-90">Ažurirajte svoje podatke</p>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-5">
          {/* PROFILNA */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-[#ffab1f]/30">
                {formData.profilnaSlika ? (
                  <img src={formData.profilnaSlika} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={90} />
                  </div>
                )}
              </div>
            </div>

            <label className="mt-6 px-8 py-3 bg-linear-to-br from-[#ffab1f] to-[#ff9500] text-white font-bold rounded-full cursor-pointer">
              Promijenite sliku
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* FORMA */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-6">

            <FormField icon={<User />} label="Ime" name="ime" value={formData.ime} onChange={handleChange} />
            <FormField icon={<User />} label="Prezime" name="prezime" value={formData.prezime} onChange={handleChange} />
            <FormField icon={<Mail />} label="Email" name="email" value={formData.email} onChange={handleChange} />
            <FormField icon={<Briefcase />} label="Pozicija" name="pozicija" value={formData.pozicija} onChange={handleChange} />

            <FormSelect icon={<BookOpen />} label="Nivo studija" name="nivoStudija" value={formData.nivoStudija} onChange={handleChange} options={Object.keys(smjerOpcije)} />

            {formData.nivoStudija && (
              <FormSelect
              icon={<BookOpen />}
              label="Smjer"
              name="smjer"
              value={formData.smjer}
              onChange={handleChange}
              options={formData.nivoStudija ? smjerOpcije[formData.nivoStudija] : []}
              disabled={!formData.nivoStudija}
              />
            )}

            <FormField icon={<BookOpen />} label="Godina diplomiranja" name="godinaZavrsetka" type="number" value={formData.godinaZavrsetka} onChange={handleChange} />

            <FormField icon={<MapPin />} label="Mjesto rada" name="mjestoRada" value={formData.mjestoRada} onChange={handleChange} />
            <FormField icon={<Briefcase />} label="Firma" name="firma" value={formData.firma} onChange={handleChange} />

            {/* CV */}
            <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
              <div className="text-[#ffab1f]"><FileText /></div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-2">CV</label>
              </div>

              <label className="px-5 py-2.5 bg-white text-[#294a70] font-bold text-sm rounded-xl cursor-pointer border border-gray-200 hover:bg-gray-50 transition">
                Dodaj CV
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} className="hidden" />
              </label>
            </div>

            {/* VIDLJIVOST */}
            <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
              <div className="text-[#ffab1f]"><User /></div>

              <div className="flex-1">
                <label className="text-xs text-gray-500 font-semibold uppercase block mb-2">Vidljivost profila</label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, javniProfil: false }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                      !formData.javniProfil ? "bg-[#ffab1f] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Privatan
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, javniProfil: true }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                      formData.javniProfil ? "bg-[#ffab1f] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Javan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SAVE / CANCEL — KAO PRIVATAN/JAVAN */}
          <div className="flex gap-5 mt-10">

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all bg-[#ffab1f] text-white shadow-md hover:scale-105"
            >
              <div className="flex items-center justify-center gap-2">
                <Save size={18} />
                Sačuvaj izmjene
              </div>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <div className="flex items-center justify-center gap-2">
                <X size={18} />
                Otkaži
              </div>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}



//
// UI Helper Components
//

function FormField({ icon, label, name, type = "text", value, onChange, placeholder }: any) {
  return (
    <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
      <div className="text-[#ffab1f]">{icon}</div>
      <div className="flex-1">
        <label className="text-xs text-gray-500 font-semibold uppercase block mb-2">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-lg font-bold text-[#294a70] bg-transparent border-none focus:outline-none"
        />
      </div>
    </div>
  );
}

function FormSelect({ icon, label, name, value, onChange, options, disabled }: any){
  return (
    <div className="flex items-center gap-4 bg-linear-to-br from-gray-50 to-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
      <div className="text-[#ffab1f]">{icon}</div>
      <div className="flex-1">
        <label className="text-xs text-gray-500 font-semibold uppercase block mb-2">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full text-lg font-bold bg-transparent border-none focus:outline-none
            ${disabled ? "text-gray-400 cursor-not-allowed" : "text-[#294a70]"}`}
        >
          <option value="" disabled>Izaberite...</option>
          {options.map((op: string) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
