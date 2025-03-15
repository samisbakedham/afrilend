import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Loans() {
  const { id } = useParams();
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch user session and profile
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profileError) console.error('Error fetching profile:', profileError.message);
        else setProfile(profileData);
      }
    };
    getUser();
  }, []);

  // Fetch loans from Supabase
  useEffect(() => {
    const fetchLoans = async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'open');
      if (error) {
        console.error('Error fetching loans:', error.message);
      } else {
        setLoans(data);
      }
    };
    fetchLoans();
  }, []);

  const handleSubmit = async (e, loan) => {
    e.preventDefault();
    if (!user || !profile) {
      alert('Please log in to support a loan.');
      navigate('/login');
      return;
    }
    if (profile.role !== 'lender') {
      alert('Only lenders can support loans. Please sign up as a lender.');
      return;
    }
    if (amount < 25) {
      alert('Minimum lending amount is $25');
      return;
    }
    const { error } = await supabase.from('loan_supports').insert({
      user_id: user.id,
      loan_id: loan.id,
      amount: parseInt(amount),
      email,
      status: 'pending',
    });
    if (error) {
      console.error('Error supporting loan:', error.message);
      alert('Failed to support loan. Please try again.');
    } else {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setAmount('');
      setEmail('');
    }
  };

  if (id) {
    const loan = loans.find(loan => loan.id === parseInt(id));
    if (!loan) return <div className="container mx-auto py-16 text-center">Loan not found</div>;

    return (
      <div className="container mx-auto py-16">
        <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-8 text-center">
          Support {loan.name}
        </h2>
        <div className="max-w-2xl mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
          {loan.image && <img src={loan.image} alt={loan.name} className="w-full h-64 object-cover rounded-lg mb-6" />}
          <h3 className="text-2xl font-heading font-semibold text-afrilend-green">{loan.name} - {loan.country}</h3>
          <p className="text-gray-600 mt-2">{loan.description}</p>
          <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
          {!user || !profile ? (
            <p className="mt-6 text-center">
              <Link to="/login" className="text-afrilend-green hover:underline">Log in</Link> or{' '}
              <Link to="/signup" className="text-afrilend-green hover:underline">Sign up</Link> to support this loan.
            </p>
          ) : profile.role === 'lender' ? (
            <form onSubmit={(e) => handleSubmit(e, loan)} className="mt-6">
              <input
                type="number"
                placeholder="Enter amount to lend (min $25)"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                min="25"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-afrilend-green text-white py-3 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
              >
                Lend to {loan.name}
              </button>
            </form>
          ) : (
            <p className="mt-6 text-center text-red-600">
              Only lenders can support loans. Sign up as a lender or apply as a borrower to create your own loan request.
            </p>
          )}
          {submitted && (
            <p className="mt-4 text-afrilend-green text-center">
              Thank you! Your support for {loan.name} has been recorded. Check your email for confirmation.
            </p>
          )}
          <div className="mt-6 text-center">
            <a href="mailto:support@afrilend.com" className="text-afrilend-green hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-12 text-center">Browse Loans</h2>
      {loans.length === 0 ? (
        <p className="text-center text-gray-600">No open loans available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {loans.map(loan => (
            <div
              key={loan.id}
              className="bg-afrilend-gray rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              {loan.image && <img src={loan.image} alt={loan.name} className="w-full h-48 object-cover" />}
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-afrilend-green">{loan.name} - {loan.country}</h3>
                <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                <Link
                  to={`/loans/${loan.id}`}
                  className="mt-4 inline-block bg-afrilend-green text-white py-2 px-4 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
                >
                  Support {loan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {user && profile && profile.role === 'borrower' && (
        <div className="mt-12 text-center">
          <Link
            to="/apply-loan"
            className="bg-afrilend-green text-white py-2 px-4 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
          >
            Apply for a Loan
          </Link>
        </div>
      )}
    </div>
  );
}

export default Loans;