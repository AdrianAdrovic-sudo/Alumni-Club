// Dashboard.tsx (FULL FIXED)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [profilePicture, setProfilePicture] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "settings" | "users" | "events" | "messages"
  >("overview");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
      return;
    }

    if (user?.profile_picture && API_BASE_URL) {
      setProfilePicture(`${API_BASE_URL}${user.profile_picture}?t=${Date.now()}`);
    }
  }, [user, loading, navigate, API_BASE_URL]);

  useEffect(() => {
    if (user && user.role === "admin" && activeTab === "overview") {
      // your overview logic (if any)
    }
  }, [user, activeTab]);

  async function handleProfilePictureUpload(file: File) {
    try {
      if (!API_BASE_URL) throw new Error("VITE_API_URL is not configured.");
      if (!user) throw new Error("Niste prijavljeni.");

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Greška pri uploadu slike.");
      }

      if (data.profile_picture) {
        const newPictureUrl = `${API_BASE_URL}${data.profile_picture}?t=${Date.now()}`;
        setProfilePicture(newPictureUrl);

        // If your auth context does not refresh user automatically:
        window.location.reload();
      }

      alert("Profilna slika je uspješno ažurirana!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Greška";
      alert(msg);
    }
  }

  if (loading) return <div className="p-6">Učitavanje...</div>;
  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <img
          src={
            user.profile_picture && API_BASE_URL
              ? `${API_BASE_URL}${user.profile_picture}?t=${Date.now()}`
              : "https://via.placeholder.com/100x100?text=Admin"
          }
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <div className="text-2xl font-bold text-[#294a70]">Admin Dashboard</div>
          <div className="text-sm text-gray-600">Prijavljen: {user.username}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {(["overview", "profile", "settings", "users", "events", "messages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-2 rounded-lg border ${
              activeTab === t ? "bg-[#294a70] text-white" : "bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl border bg-white">
        <div className="font-semibold mb-2">Profilna slika</div>
        <div className="flex items-center gap-3">
          <img
            src={profilePicture || "https://via.placeholder.com/100x100?text=Admin"}
            alt="preview"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleProfilePictureUpload(f);
            }}
          />
        </div>
      </div>

      {/* Keep the rest of your dashboard content below as it was */}
    </div>
  );
}
