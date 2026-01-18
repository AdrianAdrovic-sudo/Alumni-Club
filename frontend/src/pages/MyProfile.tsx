import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {

  Mail,
  Briefcase,
  User,
  MapPin,
  BookOpen,
} from "lucide-react";

type ProfileData = {
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  nivoStudija: string;
  smjer: string;
  godinaZavrsetka: string;
  mjestoRada: string;
  firma: string;
  javniProfil: boolean;
};

export default function MyProfile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData>({
    ime: "",
    prezime: "",
    email: "",
    pozicija: "",
    nivoStudija: "",
    smjer: "",
    godinaZavrsetka: "",
    mjestoRada: "",
    firma: "",
    javniProfil: true,
  });

  const [profilnaSlika, setProfilnaSlika] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const resp = await fetch("http://localhost:4000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) return;

        const data = await resp.json();

        setProfileData({
          ime: data.first_name || "",
          prezime: data.last_name || "",
          email: data.email || "",
          pozicija: data.position || "",
          nivoStudija: data.study_level || "",
          smjer: data.study_direction || "",
          godinaZavrsetka: String(data.enrollment_year || ""),
          mjestoRada: data.work_location || "",
          firma: data.occupation || "",
          javniProfil: data.is_public ?? true,
        });

        if (data.profile_picture) {
          setProfilnaSlika(`http://localhost:4000${data.profile_picture}`);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, []);

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

  const removeCv = () => setCvFile(null);

 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        first_name: profileData.ime,
        last_name: profileData.prezime,
        enrollment_year: profileData.godinaZavrsetka,
        work_location: profileData.mjestoRada,
        occupation: profileData.firma,
        is_public: profileData.javniProfil,
      }),
      });

      // Upload avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        await fetch("http://localhost:4000/api/users/me/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      // Upload CV
      if (cvFile) {
        const cvData = new FormData();
        cvData.append("cv", cvFile);

        await fetch("http://localhost:4000/api/users/me/cv", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: cvData,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 17 }, (_, i) => currentYear - i);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-linear-to-r from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center">
        <h1 className="text-5xl mb-4 font-bold">Moj Profil</h1>
        <p className="text-xl opacity-90">Pregled svog alumni profila</p>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-5">
        <form
          onSubmit={handleSubmit}
          className="bg-[#f9f9f9] p-10 rounded-2xl shadow-lg space-y-8"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-300 border-4 border-white shadow-xl">
              {profilnaSlika ? (
                <img
                  src={profilnaSlika}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-[#294a70] to-[#324D6B]">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Ime + prezime */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mt-4 text-[#294a70]">
              {profileData.ime} {profileData.prezime}
            </h2>
          </div>

          {/* EMAIL */}
          <Item icon={<Mail />} label="Email" value={profileData.email} />

          {/* POZICIJA */}
          <Item icon={<Briefcase />} label="Pozicija" value={profileData.pozicija} />

          {/* NIVO STUDIJA */}
          <Item icon={<BookOpen />} label="Nivo studija" value={profileData.nivoStudija} />

          {/* SMJER */}
          <Item icon={<BookOpen />} label="Smjer" value={profileData.smjer} />

          {/* GODINA DIPLOMIRANJA */}
          <Item icon={<BookOpen />} label="Godina diplomiranja" value={profileData.godinaZavrsetka} />

          {/* MJESTO RADA */}
          <Item icon={<MapPin />} label="Mjesto rada" value={profileData.mjestoRada} />

          {/* FIRMA */}
          <Item icon={<Briefcase />} label="Firma" value={profileData.firma} />

                 

          {saved && (
            <p className="text-center text-sm text-green-600 mt-2">
              Promjene sačuvane.
            </p>
          )}
        </form>

        {/* EDIT BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/MyProfileEdit")}
          className="mt-8 w-full py-4 bg-linear-to-r from-[#294a70] to-[#324D6B] text-white font-semibold rounded-xl shadow-md hover:from-[#ffab1f] hover:to-[#ff9500] transition-all"
        >
          Izmijenite profil
        </button>
      </div>
    </div>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-[#ffab1f]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-[#294a70]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}