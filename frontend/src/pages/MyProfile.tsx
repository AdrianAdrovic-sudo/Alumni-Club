import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Camera, Save, Eye, EyeOff, Upload, X } from "lucide-react";

export default function MyProfile() {
  const [profileData, setProfileData] = useState({
    ime: "",
    prezime: "",
    godinaZavrsetka: "",
    mjestoRada: "",
    firma: "",
    javniProfil: true,
  });

  const [profilnaSlika, setProfilnaSlika] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilnaSlika(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const removeCv = () => {
    setCvFile(null);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Nema tokena – korisnik vjerovatno nije ulogovan.");
        return;
      }

      // 1) TEKSTUALNI PODACI → PUT /api/profile (JSON)
      const podaciProfila = {
        ime: profileData.ime,
        prezime: profileData.prezime,
        godinaZavrsetka: profileData.godinaZavrsetka,
        mjestoRada: profileData.mjestoRada,
        firma: profileData.firma,
        javniProfil: profileData.javniProfil,
      };

      console.log("Šaljem profil na backend:", podaciProfila);

      const respProfil = await fetch("http://localhost:4000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(podaciProfila),
      });

      if (!respProfil.ok) {
        console.error(
          "Greška pri čuvanju profila:",
          respProfil.status,
          await respProfil.text()
        );
        return;
      }

      const updated = await respProfil.json();
      console.log("Ažuriran profil sa backend-a:", updated);

      // 2) CV FAJL → POST /api/users/me/cv (multipart/form-data)
      if (cvFile) {
        const cvFormData = new FormData();
        cvFormData.append("cv", cvFile);

        const respCv = await fetch("http://localhost:4000/api/users/me/cv", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: cvFormData,
        });

        if (!respCv.ok) {
          console.error(
            "Greška pri upload-u CV-a:",
            respCv.status,
            await respCv.text()
          );
        } else {
          const cvResult = await respCv.json();
          console.log("CV uploadovan:", cvResult);
        }
      }

      // 3) PROFILNA SLIKA → POST /api/users/me/avatar (multipart/form-data)
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatarFile);

        const respAvatar = await fetch(
          "http://localhost:4000/api/users/me/avatar",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: avatarData,
          }
        );

        if (!respAvatar.ok) {
          console.error(
            "Greška pri upload-u slike:",
            respAvatar.status,
            await respAvatar.text()
          );
        } else {
          const avatarResult = await respAvatar.json();
          console.log("Profilna slika uploadovana:", avatarResult);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Network/JS greška u handleSubmit:", err);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 17 }, (_, i) => currentYear - i);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center">
        <h1 className="text-5xl mb-4 font-bold">Moj Profil</h1>
        <p className="text-xl opacity-90">Pregled svog alumni profila</p>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-5">
        <form
          onSubmit={handleSubmit}
          className="bg-[#f9f9f9] p-10 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-300 border-4 border-white shadow-xl">
                {profilnaSlika ? (
                  <img
                    src={profilnaSlika}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#294a70] to-[#324D6B]">
                    <Camera className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#ffab1f] rounded-full p-3 cursor-pointer shadow-lg border-4 border-white hover:bg-[#ff9500] transition-all hover:scale-110">
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Klikni na kameru za promjenu slike
            </p>
          </div>

        <div className="flex flex-col items-center mb-10">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl border-4 border-white">
            {profileData.profilnaSlika ? (
              <img
                src={profileData.profilnaSlika}
                className="w-full h-full object-cover"
                alt="Profil"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <User size={80} />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-4 text-[#294a70]">
            {profileData.ime} {profileData.prezime}
          </h2>
        </div>

          <div className="mb-6">
            <label className="block text-base font-semibold text-black mb-2">
              Godina diplomiranja *
            </label>
            <select
              name="godinaZavrsetka"
              value={profileData.godinaZavrsetka}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black text-base focus:outline-none focus:border-[#ffab1f] bg-white transition-colors"
            >
              <option className="text-black" value="">
                Izaberite godinu
              </option>
              {years.map((year) => (
                <option className="text-black" key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <Item icon={<Mail />} label="Email" value={profileData.email} />

          <div className="mb-6">
            <label className="block text-base font-semibold text-[#294a70] mb-2">
              CV (PDF)
            </label>
            {cvFile ? (
              <div className="flex items-center justify-between px-5 py-4 bg-white rounded-lg border-2 border-gray-300">
                <div className="flex items-center gap-3">
                  <Upload className="w-10 h-10 text-[#ffab1f]" />
                  <span className="text-sm text-gray-800 font-medium">
                    {cvFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCv}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-10 px-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:border-[#ffab1f] hover:bg-[#fffbf5] transition-all">
                <Upload className="w-10 h-10 text-[#ffab1f] mb-3" />
                <span className="text-base text-gray-700">
                  Klikni za upload CV-a
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg mb-6 border-2 border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-[#294a70]">
                Vidljivost profila
              </span>
              {profileData.javniProfil ? (
                <Eye className="w-6 h-6 text-[#ffab1f]" />
              ) : (
                <EyeOff className="w-6 h-6 text-[#ffab1f]" />
              )}
            </div>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() =>
                  setProfileData((prev) => ({ ...prev, javniProfil: false }))
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg text-sm font-semibold transition-all ${
                  !profileData.javniProfil
                    ? "border-[#ffab1f] bg-[#ffab1f] text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-[#ffab1f] hover:bg-[#fffbf5]"
                }`}
              >
                <EyeOff className="w-5 h-5" />
                Privatan
              </button>
              <button
                type="button"
                onClick={() =>
                  setProfileData((prev) => ({ ...prev, javniProfil: true }))
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg text-sm font-semibold transition-all ${
                  profileData.javniProfil
                    ? "border-[#ffab1f] bg-[#ffab1f] text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-[#ffab1f] hover:bg-[#fffbf5]"
                }`}
              >
                <Eye className="w-5 h-5" />
                Javan
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {profileData.javniProfil
                ? "Tvoj profil je vidljiv svim članovima Alumni kluba"
                : "Tvoj profil je privatan i vidljiv samo tebi"}
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-8 bg-gradient-to-r from-[#294a70] to-[#324D6B] text-white rounded-lg text-base font-semibold hover:from-[#ffab1f] hover:to-[#ff9500] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            Sačuvaj promjene
          </button>

          <Item icon={<Briefcase />} label="Firma" value={profileData.firma} />

          <Item
            icon={<User />}
            label="Vidljivost profila"
            value={profileData.javniProfil ? "Javan" : "Privatan"}
          />

          {profileData.cvFileName && (
            <Item
              icon={<FileText />}
              label="CV"
              value={profileData.cvFileName}
            />
          )}

        </div>

        <button
          onClick={() => navigate("/MyProfileEdit")}
          className="mt-8 w-full py-4 bg-gradient-to-r from-[#294a70] to-[#324D6B] text-white 
          font-semibold rounded-xl shadow-md hover:from-[#ffab1f] hover:to-[#ff9500] transition-all"
        >
          Izmijenite profil
        </button>
      </div>
    </div>
  );
}

function Item({ icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-[#ffab1f]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-[#294a70]">{value || "—"}</p>
      </div>
    </div>
  );
}
