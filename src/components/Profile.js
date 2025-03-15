import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication error or no user:', authError?.message || 'No user logged in');
        navigate('/login');
        return;
      }
      setUser(user);
      console.log('Logged in user:', user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, loan_application_status')
        .eq('id', user.id)
        .single();
      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      } else {
        setProfile(profileData);
        console.log('Profile data:', profileData);
      }

      if (profileData?.role === 'lender') {
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', user.id)
          .single();
        if (walletError) {
          console.error('Error fetching wallet:', walletError.message);
        } else {
          setWallet(walletData);
          console.log('Wallet data:', walletData);
        }
      } else if (profileData?.role === 'borrower') {
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('*')
          .eq('name', (await supabase.from('profiles').select('email').eq('id', user.id).single()).data.email.split('@')[0])
          .eq('status', 'pending');
        if (loansError) {
          console.error('Error fetching loans:', loansError.message);
        } else {
          setLoans(loansData);
          console.log('Loans data:', loansData);
        }
      }
    };
    getUserData();
  }, [navigate]);

  if (!user) return <p className="container mx-auto py-16 text-center">Please log in to view your profile.</p>;

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-8 text-center">My Profile</h2>
      {profile && profile.role === 'lender' && wallet && (
        <div className="max-w-md mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-heading font-semibold text-afrilend-green">Lender Dashboard</h3>
          <p className="text-gray-600 mt-2">Wallet Balance: ${wallet.balance}</p>
          <button
            onClick={() => navigate('/loans')}
            className="mt-4 bg-afrilend-green text-white py-2 px-4 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
          >
            Fund a Loan
          </button>
        </div>
      )}
      {profile && profile.role === 'borrower' && (
        <div className="max-w-md mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-heading font-semibold text-afrilend-green">Borrower Dashboard</h3>
          <p className="text-gray-600 mt-2">Application Status: {profile.loan_application_status || 'Not applied'}</p>
          {loans.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Your Loan Requests</h4>
              {loans.map(loan => (
                <div key={loan.id} className="mt-2 p-2 bg-white rounded">
                  <p>Amount: ${loan.amount}</p>
                  <p>Purpose: {loan.purpose}</p>
                  <p>Status: {loan.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4">No loan requests submitted yet.</p>
          )}
          <button
            onClick={() => navigate('/apply-loan')}
            className="mt-4 bg-afrilend-green text-white py-2 px-4 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
          >
            Apply for a Loan
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;