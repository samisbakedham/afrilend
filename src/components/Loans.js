import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Loans() {
  const { id } = useParams();
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
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
          setWallet(walletData || { balance: 0 }); // Default to 0 if no wallet
        }
      }
    };
    getUserData();

    const fetchLoans = async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'open');
      if (error) console.error('Error fetching loans:', error.message);
      else setLoans(data || []);
    };
    fetchLoans();
  }, []);

  const handleSubmit = async (e, loan) => {
    e.preventDefault();
    if (!user || !profile?.role === 'lender' || !wallet) {
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

    if (window.confirm(`Confirm lending $${lendAmount} to ${loan.name}?`)) {
      const { error: transactionError } = await supabase.rpc('fund_loan', {
        p_user_id: user.id,
        p_loan_id: loan.id,
        p_amount: lendAmount,
        p_email: email,
      });
      if (transactionError) {
        console.error('Error funding loan:', transactionError.message);
        alert('Failed to fund loan. Please try again.');
      } else {
        setWallet({ ...wallet, balance: wallet.balance - lendAmount });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setAmount('');
        setEmail('');
      }
    }
  };

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-bold text-afrilend-green mb-8 text-center">Browse Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map(loan => (
          <div key={loan.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
            {loan.image && (
              <img
                src={loan.image}
                alt={loan.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h3 className="text-2xl font-semibold text-gray-800">{loan.name}</h3>
            <p className="text-gray-600 mt-2">Amount Needed: ${loan.amount}</p>
            <p className="text-gray-600">Country: {loan.country}</p>
            <p className="text-gray-600">Purpose: {loan.purpose}</p>
            <p className="text-gray-600">Description: {loan.description}</p>
            {user && profile?.role === 'lender' ? (
              <form onSubmit={(e) => handleSubmit(e, loan)} className="mt-6 space-y-4">
                <input
                  type="number"
                  placeholder="Enter amount to lend (min $25)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                  min="25"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
                >
                  Lend to {loan.name}
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
        ))}
      </div>
    </div>
  );
}

export default Loans;