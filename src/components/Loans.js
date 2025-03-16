import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Loans() {
  const { id } = useParams();
  const [loans, setLoans] = useState([]);
  const [fundedAmounts, setFundedAmounts] = useState({});
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('open'); // New filter state
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
        if (profileData.role === 'lender') {
          const { data: walletData } = await supabase
            .from('wallets')
            .select('balance')
            .eq('id', user.id)
            .single();
          setWallet(walletData || { balance: 0 });
        }
      }
    };
    getUserData();

    const fetchLoans = async () => {
      let query = supabase
        .from('loans')
        .select('*');
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching loans:', error.message);
        return;
      }
      setLoans(data || []);

      // Fetch total funded amounts for each loan
      const fundedData = {};
      for (const loan of data) {
        const { data: supports, error: supportError } = await supabase
          .from('loan_supports')
          .select('amount')
          .eq('loan_id', loan.id)
          .eq('status', 'pending');
        if (supportError) {
          console.error('Error fetching loan supports:', supportError.message);
          continue;
        }
        const totalFunded = supports.reduce((sum, support) => sum + support.amount, 0);
        fundedData[loan.id] = totalFunded;
      }
      setFundedAmounts(fundedData);
    };
    fetchLoans();
  }, [filter]); // Refetch loans when filter changes

  const handleSubmit = async (e, loan) => {
    e.preventDefault();
    if (!user || profile?.role !== 'lender' || !wallet) {
      alert('Please log in as a lender to support a loan.');
      navigate('/login');
      return;
    }
    const lendAmount = parseInt(amount);
    if (isNaN(lendAmount) || lendAmount < 25) {
      alert('Minimum lending amount is $25.');
      return;
    }
    if (lendAmount > wallet.balance) {
      alert('Insufficient funds. Please deposit more.');
      return;
    }

    setLoading(true);
    if (window.confirm(`Confirm lending $${lendAmount} to ${loan.name}?`)) {
      console.log('Funding loan:', { userId: user.id, loanId: loan.id, amount: lendAmount, email });
      const { error: transactionError } = await supabase.rpc('fund_loan', {
        p_user_id: user.id,
        p_loan_id: loan.id,
        p_amount: lendAmount,
        p_email: email,
      });
      if (transactionError) {
        console.error('Funding error details:', transactionError.message, transactionError.details);
        alert('Failed to fund loan. Please try again. Check console for details.');
      } else {
        setWallet({ ...wallet, balance: wallet.balance - lendAmount });
        setFundedAmounts(prev => ({
          ...prev,
          [loan.id]: (prev[loan.id] || 0) + lendAmount,
        }));
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setAmount('');
        setEmail('');
        // Refetch loans to update status
        const { data: updatedLoans } = await supabase
          .from('loans')
          .select('*')
          .eq('status', filter === 'all' ? 'open' : filter);
        setLoans(updatedLoans || []);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-bold text-afrilend-green mb-4 text-center">Browse Loans</h2>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-l-lg ${filter === 'open' ? 'bg-afrilend-green text-white' : 'bg-gray-200 text-gray-800'} hover:bg-afrilend-yellow hover:text-afrilend-green transition`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('funded')}
          className={`px-4 py-2 ${filter === 'funded' ? 'bg-afrilend-green text-white' : 'bg-gray-200 text-gray-800'} hover:bg-afrilend-yellow hover:text-afrilend-green transition`}
        >
          Funded
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-r-lg ${filter === 'all' ? 'bg-afrilend-green text-white' : 'bg-gray-200 text-gray-800'} hover:bg-afrilend-yellow hover:text-afrilend-green transition`}
        >
          All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map(loan => {
          const funded = fundedAmounts[loan.id] || 0;
          const progress = Math.min((funded / loan.amount) * 100, 100);
          return (
            <div key={loan.id} className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 hover:shadow-3xl transition duration-300">
              {loan.image && (
                <img
                  src={loan.image}
                  alt={loan.name}
                  className="w-full h-48 object-cover rounded-t-xl mb-4"
                />
              )}
              <h3 className="text-2xl font-semibold text-gray-800 text-center">{loan.name}</h3>
              <p className="text-gray-600 mt-2 text-center">Amount Needed: ${loan.amount}</p>
              <p className="text-gray-600 text-center">Funded: ${funded.toFixed(2)}</p>
              <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2 mb-4">
                <div
                  className="bg-afrilend-green h-4 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && `${progress.toFixed(0)}%`} {/* Only show percentage if bar is wide enough */}
                </div>
              </div>
              <p className="text-gray-600 text-center">Country: {loan.country}</p>
              <p className="text-gray-600 text-center">Purpose: {loan.purpose}</p>
              <p className="text-gray-600 text-center">Description: {loan.description}</p>
              {user && profile?.role === 'lender' ? (
                <form onSubmit={(e) => handleSubmit(e, loan)} className="mt-6 space-y-4">
                  <input
                    type="number"
                    placeholder="Enter amount to lend (min $25)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                    min="25"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading || loan.status === 'funded'}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || loan.status === 'funded'}
                    required
                  />
                  <button
                    type="submit"
                    className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading || loan.status === 'funded' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading || loan.status === 'funded'}
                  >
                    {loading ? 'Processing...' : loan.status === 'funded' ? 'Loan Fully Funded' : `Lend to ${loan.name}`}
                  </button>
                </form>
              ) : (
                <p className="mt-4 text-center text-gray-600">Log in as a lender to support this loan.</p>
              )}
              {submitted && (
                <p className="mt-4 text-afrilend-green text-center">
                  Thank you for supporting {loan.name}! Your balance has been updated.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Loans;