import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth(); // Add loading from context
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Proveravam autentifikaciju...</p>
        </div>
      </div>
    );
  }

  // Show nothing or redirect if no user (handled by useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome to your administration panel</p>
        </div>

        {/* ... rest of your dashboard content ... */}
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-blue-100 pb-2">
            Your Profile
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Username:</span>
              <span className="text-gray-900">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="text-gray-900">{user.first_name} {user.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Enrollment Year:</span>
              <span className="text-gray-900">{user.enrollment_year}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Occupation:</span>
              <span className="text-gray-900">{user.occupation || 'Not specified'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Role:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition duration-200"
        >
          Odjavi se
        </button>
      </div>
    </div>
  );
}