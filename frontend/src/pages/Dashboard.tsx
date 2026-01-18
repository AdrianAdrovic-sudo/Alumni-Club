import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminService from "../services/adminService";
import StatsCards from "../components/admin/StatsCards";
import UserManagement from "../components/admin/UserManagement";
import ContentManagement from "../components/admin/ContentManagement";
import AdminInquiries from "../components/admin/AdminInquiries";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPosts: number;
  totalEvents: number;
  totalComments: number;
  recentRegistrations: number;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "content" | "inquiries"
  >("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role === "admin" && activeTab === "overview") {
      loadStats();
    }
  }, [user, activeTab]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await AdminService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Greška pri učitavanju statistike:", error);
      alert("Greška pri učitavanju statistike kontrolne table");
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Provjera autentifikacije...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {isAdmin ? "Administratorska kontrolna tabla" : "Korisnička kontrolna tabla"}
          </h1>
          <p className="text-lg text-gray-600">
            {isAdmin
              ? "Dobrodošli u administratorski panel"
              : "Dobrodošli na vašu ličnu kontrolnu tablu"}
          </p>
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="bg-gray-50 rounded-xl shadow-lg p-4 mb-8 border border-gray-200">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "overview"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Pregled
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "users"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Upravljanje korisnicima
              </button>

              <button
                onClick={() => setActiveTab("content")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "content"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Upravljanje sadržajem
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "inquiries"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Upiti
              </button>
            </nav>
          </div>
        )}

        {/* Admin Content */}
        {isAdmin && (
          <div className="mb-8">
            {activeTab === "overview" && (
              <div>
                {statsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Učitavanje statistike...
                    </p>
                  </div>
                ) : stats ? (
                  <StatsCards stats={stats} />
                ) : null}
              </div>
            )}

            {activeTab === "users" && <UserManagement />}
            {activeTab === "content" && <ContentManagement />}
            {activeTab === "inquiries" && <AdminInquiries />}
          </div>
        )}

        {/* User Profile */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Vaš profil
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Korisničko ime:</span>
              <span>{user.username}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Email adresa:</span>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Ime i prezime:</span>
              <span>
                {user.first_name} {user.last_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Godina upisa:</span>
              <span>{user.enrollment_year}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Zanimanje:</span>
              <span>{user.occupation || "Nije navedeno"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Uloga:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role === "admin" ? "Administrator" : "Korisnik"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition duration-200"
        >
          Odjavi se
        </button>
      </div>
    </div>
  );
}
