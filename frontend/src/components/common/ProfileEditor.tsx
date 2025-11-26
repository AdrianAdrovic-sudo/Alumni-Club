// components/ProfileEditor.tsx
import React, { useState, useEffect } from 'react';

interface Profile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
}

const ProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    id: '',
    name: '',
    email: '',
    username: '',
    bio: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Simulate API call to get user profile
      const response = await fetch('/api/profile');
      if (response.ok) {
        const userProfile = await response.json();
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  if (!isEditing) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Name:</label>
            <p className="mt-1">{profile.name}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Email:</label>
            <p className="mt-1">{profile.email}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Username:</label>
            <p className="mt-1">{profile.username}</p>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Bio:</label>
            <p className="mt-1">{profile.bio || 'No bio provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({...profile, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;