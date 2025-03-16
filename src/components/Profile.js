import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../utils/supabaseClient';
import LendingHistory from './LendingHistory';
import ProfileSettings from './ProfileSettings';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loans, setLoans] = useState([]);
  const [fundedAmounts, setFundedAmounts] = useState({});
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [totalFunded, setTotalFunded] = useState(0);
  const [lendingHistory, setLendingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    console.log('Profile.js: useEffect triggered for user data');
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
        localStorage.setItem('user_id', user.id);
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          localStorage.setItem('supabase_access_token', session.data.session.access_token);
        }
        console.log('User fetched:', user);

        console.log('Fetching profile data...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, loan_application_status, total_loans_funded, borrowers_impacted, profile_picture, bio, name')
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
          console.log('Wallet data fetched:', walletData);

          console.log('Fetching loan supports for total funded and lending history...');
          const { data: supports, error: supportError } = await supabase
            .from('loan_supports')
            .select('amount, created_at')
            .eq('user_id', user.id)
            .eq('status', 'pending');
          if (supportError) {
            console.error('Error fetching loan supports:', supportError.message);
            setTotalFunded(0);
            setLendingHistory([]);
          } else {
            const total = supports ? supports.reduce((sum, support) => sum + support.amount, 0) : 0;
            setTotalFunded(total);
            console.log('Total funded:', total);

            const history = supports.map(support => ({
              date: new Date(support.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: support.amount / 100,
            }));
            setLendingHistory(history);
            console.log('Lending history:', history);
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
              fundedData[loan.id] = 0;
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

  // Handle payment success redirect
  useEffect(() => {
    console.log('Profile.js: useEffect triggered for redirect handling');
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Search Params:', Object.fromEntries(urlParams));
    const successParam = urlParams.get('success');
    const errorParam = urlParams.get('error');
    const amountParam = urlParams.get('amount');
    if (successParam === 'true') {
      const depositAmount = parseFloat(amountParam) || parseFloat(localStorage.getItem('lastDepositAmount')) || 0;
      console.log('Payment succeeded via redirect, calling handlePaymentSuccess with amount:', depositAmount);
      localStorage.setItem('lastDepositAmount', depositAmount.toString());
      handlePaymentSuccess(depositAmount);
    } else if (errorParam) {
      console.error('Payment error from redirect:', errorParam);
      setError(errorParam);
      toast.error(errorParam, { position: 'top-right' });
    } else if (urlParams.get('cancelled') === 'true') {
      console.log('Payment cancelled via redirect');
      setError('Payment was cancelled.');
      toast.error('Payment was cancelled.', { position: 'top-right' });
    } else {
      console.log('No redirect parameters detected');
    }
  }, []);

  const handleDeposit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid positive amount.');
      toast.error('Please enter a valid positive amount.', { position: 'top-right' });
      setLoading(false);
      return;
    }
    try {
      console.log('Starting handleDeposit with user:', user?.id, 'and amount:', amount);
      const requestBody = { user_id: localStorage.getItem('user_id'), amount: amount * 100 };
      console.log('Request body:', requestBody);
      localStorage.setItem('lastDepositAmount', amount.toString());
      console.log('Stored lastDepositAmount in localStorage:', localStorage.getItem('lastDepositAmount'));

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('Session error:', sessionError?.message || 'No session found');
        setError('Please log in again to continue.');
        toast.error('Please log in again to continue.', { position: 'top-right' });
        setLoading(false);
        return;
      }
      const accessToken = sessionData.session.access_token;
      localStorage.setItem('supabase_access_token', accessToken);
      console.log('Access token:', accessToken);

      console.log('Sending fetch request to Edge Function');
      const response = await fetch('https://iqransnptrzuixvlhbvn.supabase.co/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      console.log('Edge Function Response Status:', response.status, response.statusText);
      const data = await response.json();
      console.log('Edge Function Response Data:', data);
      if (!response.ok || !data.sessionId) {
        const errorMessage = data.error || 'No sessionId returned';
        console.error('Checkout Session error:', errorMessage);
        setError(`Failed to create checkout session: ${errorMessage}`);
        toast.error(`Failed to create checkout session: ${errorMessage}`, { position: 'top-right' });
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/checkout', { state: { sessionId: data.sessionId, amount } });
    } catch (err) {
      console.error('Error in handleDeposit:', err.message, err.stack);
      setError(`An error occurred while initiating the payment: ${err.message}`);
      toast.error(`An error occurred while initiating the payment: ${err.message}`, { position: 'top-right' });
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0 || amount > (wallet?.balance || 0)) {
      setError('Please enter a valid amount within your balance.');
      toast.error('Please enter a valid amount within your balance.', { position: 'top-right' });
      return;
    }
    setLoading(true);
    setError(null);
    if (window.confirm(`Confirm withdrawing $${amount}?`)) {
      try {
        console.log('Initiating withdrawal with user:', user?.id, 'and amount:', amount);
        const requestBody = { user_id: localStorage.getItem('user_id'), amount: amount * 100 };
        console.log('Withdrawal request body:', requestBody);

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          console.error('Session error:', sessionError?.message || 'No session found');
          setError('Please log in again to continue.');
          toast.error('Please log in again to continue.', { position: 'top-right' });
          setLoading(false);
          return;
        }
        const accessToken = sessionData.session.access_token;
        console.log('Access token for withdrawal:', accessToken);

        const response = await fetch('https://iqransnptrzuixvlhbvn.supabase.co/functions/v1/create-payout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        });
        console.log('Payout Edge Function Response Status:', response.status, response.statusText);
        const data = await response.json();
        console.log('Payout Edge Function Response Data:', data);

        if (!response.ok || !data.payoutId) {
          const errorMessage = data.error || 'No payoutId returned';
          console.error('Payout error:', errorMessage);
          setError(`Failed to initiate withdrawal: ${errorMessage}`);
          toast.error(`Failed to initiate withdrawal: ${errorMessage}`, { position: 'top-right' });
          setLoading(false);
          return;
        }

        const newBalance = wallet.balance - amount;
        const { error: updateError } = await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('id', localStorage.getItem('user_id'))
          .single();
        if (updateError) {
          console.error('Error updating wallet balance after withdrawal:', updateError.message);
          setError('Failed to update wallet balance after withdrawal.');
          toast.error('Failed to update wallet balance after withdrawal.', { position: 'top-right' });
          setLoading(false);
          return;
        }

        setWallet({ ...wallet, balance: newBalance });
        setWithdrawalAmount('');
        setSuccess('Withdrawal initiated! Funds will be transferred soon.');
        toast.success('Withdrawal initiated! Funds will be transferred soon.', { position: 'top-right' });
        setTimeout(() => setSuccess(''), 3000);
        console.log('Wallet balance updated after withdrawal to:', newBalance);

        const { data: refreshedWalletData, error: refreshError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', localStorage.getItem('user_id'))
          .single();
        if (refreshError) {
          console.error('Error refreshing wallet data:', refreshError.message);
        } else {
          setWallet(refreshedWalletData);
          console.log('Refreshed wallet data:', refreshedWalletData);
        }
      } catch (err) {
        console.error('Error in handleWithdrawal:', err.message, err.stack);
        setError('An unexpected error occurred during withdrawal: ' + err.message);
        toast.error('An unexpected error occurred during withdrawal: ' + err.message, { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePaymentSuccess = async (amount) => {
    console.log('handlePaymentSuccess called with amount:', amount, 'and user_id:', localStorage.getItem('user_id'));
    try {
      const { data, error: fetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', localStorage.getItem('user_id'))
        .single();
      if (fetchError) {
        console.error('Error fetching current wallet balance:', fetchError.message, fetchError);
        setError('Failed to fetch wallet balance: ' + fetchError.message);
        toast.error('Failed to fetch wallet balance: ' + fetchError.message, { position: 'top-right' });
        return;
      }
      console.log('Current wallet data:', data);
      const currentBalance = data.balance || 0;
      const newBalance = currentBalance + amount;
      console.log('Updating wallet balance from', currentBalance, 'to', newBalance);

      const { error: updateError, data: updatedData } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', localStorage.getItem('user_id'))
        .single();
      if (updateError) {
        console.error('Error updating wallet balance:', updateError.message, updateError);
        setError('Failed to update wallet balance: ' + updateError.message);
        toast.error('Failed to update wallet balance: ' + updateError.message, { position: 'top-right' });
        return;
      }
      console.log('Wallet updated data:', updatedData);
      setWallet(prev => ({ ...prev, balance: newBalance }));
      setSuccess('Deposit successful!');
      toast.success('Deposit successful!', { position: 'top-right' });
      setTimeout(() => setSuccess(''), 3000);
      console.log('Wallet balance updated successfully to:', newBalance);

      const { data: refreshedWalletData, error: refreshError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', localStorage.getItem('user_id'))
        .single();
      if (refreshError) {
        console.error('Error refreshing wallet data:', refreshError.message);
      } else {
        setWallet(refreshedWalletData);
        console.log('Refreshed wallet data:', refreshedWalletData);
      }
    } catch (err) {
      console.error('Error in handlePaymentSuccess:', err.message, err.stack);
      setError('An unexpected error occurred while updating the wallet: ' + err.message);
      toast.error('An unexpected error occurred while updating the wallet: ' + err.message, { position: 'top-right' });
    }
  };

  console.log('Rendering Profile with state:', { user, profile, wallet, loans, error, loading, success, depositAmount });

  if (error) return <p className="container mx-auto py-16 text-center text-red-600">{error}</p>;
  if (!user) return <p className="container mx-auto py-16 text-center">Please log in to view your profile.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-kiva-bg p-8">
      <h2 className="text-4xl font-bold text-kiva-green mb-8 text-center">My Profile</h2>
      {profile ? (
        <>
          {profile.role === 'lender' && wallet ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    {profile.profile_picture && (
                      <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-kiva-green"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-kiva-text">Welcome, {profile.name || 'Lender'}!</h3>
                      {profile.bio && <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-kiva-text mb-2">Wallet Overview</h3>
                  <p className="text-2xl font-bold text-kiva-green">${wallet.balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Available Balance</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-kiva-text mb-4">Your Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-kiva-green">${totalFunded.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Funded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kiva-green">{profile.total_loans_funded || 0}</p>
                    <p className="text-sm text-gray-600">Loans Funded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kiva-green">{profile.borrowers_impacted || 0}</p>
                    <p className="text-sm text-gray-600">Borrowers Impacted</p>
                  </div>
                </div>
              </div>
              <ProfileSettings
                userId={user.id}
                profile={profile}
                onUpdate={(updatedProfile) => setProfile({ ...profile, ...updatedProfile })}
              />
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-kiva-text mb-4">Manage Funds</h3>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] overflow-auto"
                  style={{ border: '2px solid red', position: 'relative' }}
                >
                  <form
                    className="space-y-4"
                    style={{ border: '1px solid blue', minHeight: '150px', backgroundColor: '#f0f0f0' }}
                  >
                    <input
                      type="number"
                      placeholder="Deposit amount"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleDeposit}
                      className={`w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                      style={{ display: 'block !important', visibility: 'visible !important' }} // Force visibility
                    >
                      {loading ? 'Processing...' : 'Deposit'}
                    </button>
                    <div className="text-red-600">Debug: Deposit Form Rendered</div>
                  </form>
                  <form
                    onSubmit={handleWithdrawal}
                    className="space-y-4"
                    style={{ border: '1px solid blue', minHeight: '150px', backgroundColor: '#f0f0f0' }}
                  >
                    <input
                      type="number"
                      placeholder="Withdrawal amount"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      disabled={loading}
                      required
                    />
                    <button
                      type="submit"
                      className={`w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading || !wallet?.balance || wallet.balance === 0}
                      style={{ display: 'block !important', visibility: 'visible !important' }} // Force visibility
                    >
                      {loading ? 'Processing...' : 'Withdraw'}
                    </button>
                    <div className="text-red-600">Debug: Withdraw Form Rendered</div>
                  </form>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-medium text-kiva-text mb-4">Lending History</h3>
                <LendingHistory userId={user.id} />
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => navigate('/users')}
                  className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
                >
                  View Community
                </button>
                <button
                  onClick={() => navigate('/loans')}
                  className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
                >
                  Fund a Loan
                </button>
              </div>
            </div>
          ) : profile.role === 'borrower' ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6 border border-gray-200 transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-semibold text-kiva-green mb-4 text-center">Borrower Dashboard</h3>
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
                className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
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