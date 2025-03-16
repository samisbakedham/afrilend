import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const ProfileSettings = ({ userId, profile, onUpdate }) => {
  const [profilePicture, setProfilePicture] = useState(profile?.profile_picture || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture: profilePicture, bio })
        .eq('id', userId);
      if (error) {
        console.error('Error updating profile:', error.message);
        setError('Failed to update profile: ' + error.message);
        return;
      }
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      onUpdate({ profile_picture: profilePicture, bio });
    } catch (err) {
      console.error('Error in handleSubmit:', err.message);
      setError('An unexpected error occurred: ' + err.message);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-afrilend-green mb-4">Profile Settings</h3>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-afrilend-green text-center mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            type="text"
            id="profilePicture"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            placeholder="Enter image URL"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            rows="4"
            placeholder="Tell us about yourself"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;