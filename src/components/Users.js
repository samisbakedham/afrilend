import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, total_loans_funded, borrowers_impacted')
          .eq('role', 'lender');
        if (error) {
          console.error('Error fetching users:', error.message);
          setError('Failed to load user data.');
          return;
        }
        setUsers(data);
        console.log('Users fetched:', data);
      } catch (err) {
        console.error('Unexpected error in fetchUsers:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center">Loading users...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto bg-kiva-bg p-8">
      <h2 className="text-4xl font-bold text-kiva-green mb-8 text-center">Community Leaders</h2>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-kiva-text">{user.name || 'Anonymous Lender'}</h3>
            <p className="text-sm text-gray-600">Loans Funded: {user.total_loans_funded || 0}</p>
            <p className="text-sm text-gray-600">Borrowers Impacted: {user.borrowers_impacted || 0}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="w-full mt-6 bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default Users;