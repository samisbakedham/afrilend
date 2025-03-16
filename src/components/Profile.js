import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, stripePromise } from '../utils/supabaseClient';
import LendingHistory from './LendingHistory';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loans, setLoans] = useState([]);
  const [fundedAmounts, setFundedAmounts] = useState({});
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [totalFunded, setTotalFunded] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Profile.js: useEffect triggered');
    const getUserData = async () => {
      try {
        console.log('Fetching user data...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Authentication error:', authError?.message || 'No user logged in');
          setError('Please log in to view your profile.');
          navigate('/login');
          return;
        }
        setUser(user);
        console.log('User fetched:', user);

        console.log('Fetching profile data...');
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
        console.log('Profile data:', profileData);

        if (profileData?.role === 'lender') {
          console.log('Fetching wallet data...');
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
          console.log('Wallet data:', walletData);

          console.log('Fetching loan supports for total funded...');
          const { data: supports, error: supportError } = await supabase
            .from('loan_supports')
            .select('amount')
            .eq('user_id', user.id)
            .eq('status', 'pending');
          if (supportError) {
            console.error('Error fetching loan supports:', supportError.message);
            setTotalFunded(0); // Fallback to 0 if fetch fails
          } else {
            const total = supports ? supports.reduce((sum, support) => sum + support.amount, 0) : 0;
            setTotalFunded(total);
            console.log('Total funded:', total);
          }
        } else if (profileData?.role === 'borrower') {
          console.log('Fetching borrower email data...');
          const { data: emailData, error: emailError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single();
          if (emailError) {
            console.error('Error fetching borrower email:', emailError.message);
            setError('Failed to load borrower email.');
            return;
          }
          console.log('Borrower email:', emailData);

          console.log('Fetching borrower loans...');
          const { data: loansData, error: loansError } = await supabase
            .from('loans')
            .select('*')
            .eq('name', emailData.email.split('@')[0]);
          if (loansError) {
            console.error('Error fetching borrower loans:', loansError.message);
            setError('Failed to load borrower loans.');
            return;
          }
          setLoans(loansData || []);
          console.log('Borrower loans:', loansData);

          const fundedData = {};
          for (const loan of loansData || []) {
            const { data: supports, error: supportError } = await supabase
              .from('loan_supports')
              .select('amount')
              .eq('loan_id', loan.id)
              .eq('status', 'pending');
            if (supportError) {
              console.error('Error fetching loan supports for borrower:', supportError.message);
              fundedData[loan.id] = 0; // Fallback to 0 if fetch fails
              continue;
            }
            const totalFunded = supports ? supports.reduce((sum, support) => sum + support.amount, 0) : 0;
            fundedData[loan.id] = totalFunded;
          }
          setFundedAmounts(fundedData);
          console.log('Funded amounts for borrower loans:', fundedData);
        }
      } catch (err) {
        console.error('Unexpected error in getUserData:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    };
    getUserData();
  }, [navigate]);

  const handleDeposit = async () => {
    setLoading(true);
    setError(null);
    const stripe = await stripePromise;
    const { error: sessionError, data: session } = await supabase.rpc('create_stripe_session', {
      p_user_id: user.id,
      p_amount: parseFloat(depositAmount) * 100, // Convert to cents
    });
    if (sessionError) {
      console.error('Session creation error:', sessionError.message);
      setError('Failed to create payment session.');
      setLoading(false);
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.session_id,
    });
    if (result.error) {
      console.error('Stripe checkout error:', result.error.message);
      setError('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0 || amount > (wallet?.balance || 0)) {
      setError('Please enter a valid amount within your balance.');
      return;
    }
    setLoading(true);
    setError(null);
    if (window.confirm(`Confirm withdrawing $${amount}?`)) {
      const { error } = await supabase.rpc('create_stripe_withdrawal', {
        p_user_id: user.id,
        p_amount: amount * 100, // Convert to cents
      });
      if (error) {
        console.error('Withdrawal error:', error.message);
        setError('Failed to initiate withdrawal. Please try again.');
      } else {
        setWallet({ ...wallet, balance: (wallet.balance || 0) - amount });
        setWithdrawalAmount('');
        setSuccess('Withdrawal initiated! Funds will be transferred soon.');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
    setLoading(false);
  };

  console.log('Rendering Profile with state:', { user, profile, wallet, loans, error, loading, success });

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
              <div className="bg-afrilend-gray p-4 rounded-lg mb-4 text-center">
                <p className="text-lg text-gray-800">Wallet Balance: <span className="font-bold text-xl">${wallet.balance.toFixed(2)}</span></p>
              </div>
              <div className="bg-afrilend-gray p-4 rounded-lg mb-6 text-center">
                <p className="text-lg text-gray-800">Total Funded: <span className="font-bold text-xl">${totalFunded.toFixed(2)}</span></p>
              </div>
              <div className="space-y-6">
                <Elements stripe={stripePromise}>
                  <CheckoutForm amount={depositAmount} setAmount={setDepositAmount} onDeposit={handleDeposit} loading={loading} />
                </Elements>
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <input
                    type="number"
                    placeholder="Withdrawal amount"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    disabled={loading}
                    required
                  />
                  <button
                    type="submit"
                    className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading || !wallet?.balance || wallet.balance === 0}
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                </form>
              </div>
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
                      <p>Funded: ${(fundedAmounts[loan.id] || 0).toFixed(2)}</p>
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