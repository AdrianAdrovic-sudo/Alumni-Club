import React, { useState, useEffect } from 'react';
import AdminService from '../../services/adminService';
import { generateUsername } from '../utils/UsernameGenerator';

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
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [bulkImportLoading, setBulkImportLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
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
      
      const backendFilters = {
        role: filters.role || undefined,
        search: filters.search || undefined,
        is_active: filters.is_active === '' ? undefined : filters.is_active === 'true'
      };
      
      const data = await AdminService.getUsers(backendFilters, pagination.page, pagination.limit);
      setUsers(data.users || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      });
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users. Please check the console for details.');
      setUsers([]);
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

  const handleBulkImport = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setBulkImportLoading(true);
    
    console.log('Raw CSV data:', csvData);
    
    // Parse CSV data
    const rows = csvData.split('\n').filter(row => row.trim());
    console.log('Rows found:', rows.length);
    
    if (rows.length < 2) {
      alert('No data found in CSV. Please check the format.');
      return;
    }

    // Parse headers and map to our field names
    const headers = rows[0].split(',').map(header => 
      header.trim().replace(/"/g, '').toLowerCase()
    );
    console.log('CSV Headers:', headers);

    // Get existing usernames for collision checking
    const existingUsernames = users.map(user => user.username);
    const usersToCreate = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',').map(field => field.trim().replace(/"/g, ''));
      console.log(`Processing row ${i}:`, row);
      
      if (row.length < 3) {
        console.warn(`Skipping row ${i} - not enough columns`);
        continue;
      }

      // Create user data object from CSV row
      const userData: any = {};
      headers.forEach((header, index) => {
        userData[header] = row[index];
      });

      console.log('Parsed user data:', userData);

      // Map CSV columns to our field names
      const firstName = userData['ime'] || '';
      const lastName = userData['prezime'] || '';
      const email = userData['email'] || '';

      // Validate required fields
      if (firstName && lastName && email) {
        const username = generateUsername(firstName, lastName, [
          ...existingUsernames, 
          ...usersToCreate.map(u => u.username)
        ]);
        
        usersToCreate.push({
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
          password: 'alumni123', // Default password
          enrollment_year: new Date().getFullYear(), // Current year - FIXED: removed enrollmentYear variable
          role: 'user',
          occupation: '' // Default empty occupation
        });
        
        console.log(`Added user: ${firstName} ${lastName}`);
      } else {
        console.warn(`Skipping row ${i} - missing required fields:`, { firstName, lastName, email });
      }
    }

    console.log('Users to create:', usersToCreate);

    if (usersToCreate.length === 0) {
      alert('No valid users found. Please check your CSV format.\n\nRequired columns: Ime, Prezime, Email');
      return;
    }

    // Create users in batch
    let successCount = 0;
    let errorCount = 0;

    for (const userData of usersToCreate) {
      try {
        await AdminService.createUser(userData);
        successCount++;
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
        errorCount++;
      }
    }

    setShowBulkImportModal(false);
    setCsvData('');
    loadUsers();
    
    if (errorCount > 0) {
      alert(`Import completed with ${successCount} successes and ${errorCount} errors. Check console for details.`);
    } else {
      alert(`Successfully imported ${successCount} users!`);
    }
    
  } catch (error: any) {
    console.error('Error in bulk import:', error);
    alert(`Error during bulk import: ${error.message}`);
  } finally {
    setBulkImportLoading(false);
  }
};

  const handleFirstNameChange = (firstName: string) => {
    const updatedData = { ...createUserData, first_name: firstName };
    
    if (firstName && createUserData.last_name) {
      const existingUsernames = users.map(user => user.username);
      updatedData.username = generateUsername(firstName, createUserData.last_name, existingUsernames);
    }
    
    setCreateUserData(updatedData);
  };

  const handleLastNameChange = (lastName: string) => {
    const updatedData = { ...createUserData, last_name: lastName };
    
    if (createUserData.first_name && lastName) {
      const existingUsernames = users.map(user => user.username);
      updatedData.username = generateUsername(createUserData.first_name, lastName, existingUsernames);
    }
    
    setCreateUserData(updatedData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Header with Create Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBulkImportModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Bulk Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Create User
          </button>
        </div>
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

      {/* Create User Modal - FIXED */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.first_name}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.last_name}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.email}
                    onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-50"
                    value={createUserData.username}
                    onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                    placeholder="Auto-generated from name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated, but you can modify if needed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.password}
                    onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                    placeholder="Set initial password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.enrollment_year}
                    onChange={(e) => setCreateUserData({ ...createUserData, enrollment_year: parseInt(e.target.value) || new Date().getFullYear() })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={createUserData.occupation}
                    onChange={(e) => setCreateUserData({ ...createUserData, occupation: e.target.value })}
                    placeholder="Optional - user can set later"
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

      {/* Bulk Import Modal - FIXED */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Bulk Import Users</h3>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Export Google Forms responses as CSV</li>
                <li>Ensure CSV has columns for: <strong>First Name, Last Name, Email</strong></li>
                <li>Usernames will be auto-generated as firstName.lastName</li>
                <li>All users will be created with default password "alumni123"</li>
              </ol>
              <div className="mt-3 text-sm">
                <strong className="text-gray-800">Example CSV format:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs text-gray-800 border">
                  Timestamp,Ime,"Prezime,Email{'\n'}
                  2025/11/26 5:46:06 PM GMT+1,John,Doe,john.doe@example.com{'\n'}
                  2025/11/26 5:46:06 PM GMT+1,Jane,Smith,jane.smith@example.com
                </pre>
              </div>
            </div>

            <form onSubmit={handleBulkImport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste CSV Data:
                </label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-700 bg-white"
                  placeholder="Paste your CSV data here..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setCsvData('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkImportLoading || !csvData.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {bulkImportLoading ? 'Importing...' : 'Import Users'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}