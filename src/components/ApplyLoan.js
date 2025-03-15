import React, { useState, useEffect } from 'react'; // Add useEffect import
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function ApplyLoan() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to apply for a loan.');
      navigate('/login');
      return;
    }
    const { error } = await supabase.from('loans').insert({
      name,
      country,
      amount: parseInt(amount),
      purpose,
      description,
      image,
      status: 'pending',
      created_at: new Date(),
    });
    if (error) {
      console.error('Error applying for loan:', error.message);
      alert('Failed to apply for loan. Please try again.');
    } else {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        navigate('/loans');
      }, 3000);
    }
  };

  if (!user) return <p className="container mx-auto py-16 text-center">Please log in to apply for a loan.</p>;

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-8 text-center">Apply for a Loan</h2>
      <div className="max-w-md mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Country"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount Needed"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="25"
            required
          />
          <input
            type="text"
            placeholder="Purpose"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-afrilend-green text-white py-3 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
          >
            Submit Loan Application
          </button>
        </form>
        {submitted && (
          <p className="mt-4 text-afrilend-green text-center">
            Thank you! Your loan application has been submitted for review.
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplyLoan;