import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import LendingHistory from './LendingHistory';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loans, setLoans] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication error or no user:', authError?.message || 'No user logged in');
        setError('Please log in to view your profile.');
        navigate('/login');
        return;
      }
      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, loan_application_status')
        .eq('id', user.id)
        .single();
      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        setError('Failed to load profile data.');
        return;
      }
      setProfile(profileData);

      if (profileData?.role === 'lender') {
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', user.id)
          .single();
        if (walletError) {
          console.error('Error fetching wallet:', walletError.message);
          setError('Failed to load wallet data.');
          return;
        }
        setWallet(walletData || { balance: 0 });
      } else if (profileData?.role === 'borrower') {
        const { data: emailData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();
        const { data: loansData } = await supabase
          .from('loans')
          .select('*')
          .eq('name', emailData.email.split('@')[0])
          .eq('status', 'pending');
        setLoans(loansData || []);
      }
    };
    getUserData();
  }, [navigate]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setLoading(true);
    setError(null);
    if (window.confirm(`Confirm depositing $${amount}?`)) {
      const { error } = await supabase.rpc('deposit_to_wallet', { p_user_id: user.id, p_amount: amount });
      if (error) {
        console.error('Deposit error:', error.message);
        setError('Failed to deposit. Please try again.');
      } else {
        setWallet({ ...wallet, balance: (wallet.balance || 0) + amount });
        setDepositAmount('');
        setSuccess('Deposit successful!');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
    setLoading(false);
  };

  if (error) return <p className="container mx-auto py-16 text-center text-red-600">{error}</p>;
  if (!user) return <p className="container mx-auto py-16 text-center">Please log in to view your profile.</p>;

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-bold text-afrilend-green mb-8 text-center">My Profile</h2>
      {profile ? (
        <>
          {profile.role === 'lender' && wallet ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 border border-gray-200 transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-semibold text-afrilend-green mb-4 text-center">Lender Dashboard</h3>
              <div className="bg-afrilend-gray p-4 rounded-lg mb-6 text-center">
                <p className="text-lg text-gray-800">Wallet Balance: <span className="font-bold text-xl">${wallet.balance.toFixed(2)}</span></p>
              </div>
              <form onSubmit={handleDeposit} className="space-y-4 mb-6">
                <input
                  type="number"
                  placeholder="Deposit amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  disabled={loading}
                  required
                />
                <button
                  type="submit"
                  className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </form>
              {success && <p className="text-afrilend-green text-center mb-4">{success}</p>}
              <LendingHistory userId={user.id} />
              <button
                onClick={() => navigate('/loans')}
                className="w-full mt-6 bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
              >
                Fund a Loan
              </button>
            </div>
          ) : profile.role === 'borrower' ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 border border-gray-200 transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-semibold text-afrilend-green mb-4 text-center">Borrower Dashboard</h3>
              <p className="text-gray-600 mb-4 text-center">Application Status: {profile.loan_application_status || 'Not applied'}</p>
              {loans.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-2 text-center">Your Loan Requests</h4>
                  {loans.map(loan => (
                    <div key={loan.id} className="p-4 mb-2 bg-gray-50 rounded-lg text-center">
                      <p>Amount: ${loan.amount}</p>
                      <p>Purpose: {loan.purpose}</p>
                      <p>Status: {loan.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-6 text-center">No loan requests submitted yet.</p>
              )}
              <button
                onClick={() => navigate('/apply-loan')}
                className="w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
              >
                Apply for a Loan
              </button>
            </div>
          ) : (
            <p className="text-center">Loading profile...</p>
          )}
        </>
      ) : (
        <p className="text-center">Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;