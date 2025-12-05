import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/alumni/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white py-20">Učitavanje...</div>;
  }

  if (!user) {
    return <div className="text-center text-white py-20">Profil nije pronađen.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-[#294a70] text-white py-16 text-center">
        <img
          src={user.profile_picture || "https://via.placeholder.com/120"}
          className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h1 className="mt-4 text-3xl font-bold">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-lg opacity-90">{user.occupation || "Nije navedeno"}</p>
      </div>

      <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
        <PublicInfo label="Email" value={user.email} />
        <PublicInfo label="Zanimanje" value={user.occupation} />
        <PublicInfo label="Godina upisa" value={user.enrollment_year} />
        <PublicInfo
          label="Vidljivost profila"
          value={user.is_public ? "Javan" : "Privatan"}
        />

        {authUser && (
          <button
            onClick={() => navigate(`/messages?to=${user.username}`)}
            className="w-full py-3 bg-[#294a70] text-white rounded-lg font-semibold hover:bg-[#1f3854] transition"
          >
            <Mail className="inline-block mr-2" />
            Kontaktiraj
          </button>
        )}
      </div>
    </div>
  );
}

function PublicInfo({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white p-4 border rounded-xl shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-[#294a70]">
        {value || "Nije navedeno"}
      </p>
    </div>
  );
}
