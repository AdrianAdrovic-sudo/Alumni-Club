import React, { useState, useEffect } from 'react';
import AdminService from '../../services/adminService';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  enrollment_year: number;
  occupation: string;
  is_active: boolean;
  created_at: string;
  _count: {
    posts: number;
    comments: number;
    event_registration: number;
  };
}

interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  enrollment_year: number;
  role: string;
  occupation: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    is_active: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20, // Increased from 10 to 20 to show more users
    total: 0,
    pages: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    enrollment_year: new Date().getFullYear(),
    role: 'user',
    occupation: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Convert empty strings to undefined for the backend
      const backendFilters = {
        role: filters.role || undefined,
        search: filters.search || undefined,
        is_active: filters.is_active === '' ? undefined : filters.is_active
      };
      
      const data = await AdminService.getUsers(backendFilters, pagination.page, pagination.limit);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await AdminService.deactivateUser(userId);
        loadUsers();
        alert('User deactivated successfully');
      } catch (error: any) {
        console.error('Error deactivating user:', error);
        alert(`Error deactivating user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleActivate = async (userId: number) => {
    try {
      await AdminService.activateUser(userId);
      loadUsers();
      alert('User activated successfully');
    } catch (error: any) {
      console.error('Error activating user:', error);
      alert(`Error activating user: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await AdminService.deleteUser(userId);
        loadUsers();
        alert('User deleted successfully');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        alert(`Error deleting user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      await AdminService.createUser(createUserData);
      setShowCreateModal(false);
      setCreateUserData({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        enrollment_year: new Date().getFullYear(),
        role: 'user',
        occupation: ''
      });
      loadUsers();
      alert('User created successfully');
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Error creating user: ${error.response?.data?.message || error.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={filters.is_active}
            onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilters({ role: '', search: '', is_active: '' });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Enrollment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Activity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.enrollment_year}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>Posts: {user._count.posts}</div>
                        <div>Events: {user._count.event_registration}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {user.is_active ? (
                            <button
                              onClick={() => handleDeactivate(user.id)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition text-gray-700"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition text-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.first_name}
                    onChange={(e) => setCreateUserData({ ...createUserData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.last_name}
                    onChange={(e) => setCreateUserData({ ...createUserData, last_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.email}
                    onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.username}
                    onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.password}
                    onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.enrollment_year}
                    onChange={(e) => setCreateUserData({ ...createUserData, enrollment_year: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.role}
                    onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createUserData.occupation}
                    onChange={(e) => setCreateUserData({ ...createUserData, occupation: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}