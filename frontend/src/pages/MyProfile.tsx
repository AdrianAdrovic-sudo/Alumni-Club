import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, Briefcase, MapPin, User, BookOpen } from "lucide-react";

export default function MyProfile() {
  const navigate = useNavigate();

  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center">
        <h1 className="text-5xl mb-4 font-bold">Moj Profil</h1>
        <p className="text-xl opacity-90">Pregled svog alumni profila</p>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-5">

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

        <div className="bg-[#f9f9f9] p-8 rounded-2xl shadow-lg space-y-5">

          <Item icon={<Mail />} label="Email" value={profileData.email} />

          <Item icon={<Briefcase />} label="Pozicija" value={profileData.pozicija} />

          <Item icon={<BookOpen />} label="Nivo studija" value={profileData.nivoStudija} />

          <Item icon={<BookOpen />} label="Smjer" value={profileData.smjer} />

          <Item icon={<BookOpen />} label="Godina diplomiranja" value={profileData.godinaZavrsetka} />

          <Item icon={<MapPin />} label="Mjesto rada" value={profileData.mjestoRada} />

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