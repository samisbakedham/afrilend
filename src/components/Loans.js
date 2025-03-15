import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const loansData = [
  { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'Expand her shop', image: 'https://images.unsplash.com/photo-1590650516494-0c8e4c27e8b7', description: 'Amina runs a small shop in Nairobi and needs funds to stock more inventory.' },
  { id: 2, name: 'Kwame', country: 'Ghana', amount: 500, purpose: 'Buy farming tools', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', description: 'Kwame is a farmer in Accra looking to improve his yield with better tools.' },
  { id: 3, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'Start a bakery', image: 'https://images.unsplash.com/photo-1573496359142-b8d8779911e1', description: 'Fatima wants to start a bakery in Lagos to support her family.' },
];

function Loans() {
  const { id } = useParams();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e, name) => {
    e.preventDefault();
    if (amount < 25) {
      alert('Minimum lending amount is $25');
      return;
    }
    console.log(`Lending $${amount} to ${name} from ${email}`);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (id) {
    const loan = loansData.find(loan => loan.id === parseInt(id));
    if (!loan) return <div className="container mx-auto py-16 text-center">Loan not found</div>;

    return (
      <div className="container mx-auto py-16">
        <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-8 text-center">
          Support {loan.name}
        </h2>
        <div className="max-w-2xl mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
          <img src={loan.image} alt={loan.name} className="w-full h-64 object-cover rounded-lg mb-6" />
          <h3 className="text-2xl font-heading font-semibold text-afrilend-green">{loan.name} - {loan.country}</h3>
          <p className="text-gray-600 mt-2">{loan.description}</p>
          <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
          <form onSubmit={(e) => handleSubmit(e, loan.name)} className="mt-6">
            <input
              type="number"
              placeholder="Enter amount to lend"
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
          {submitted && (
            <p className="mt-4 text-afrilend-green text-center">
              Thank you! Your support for {loan.name} has been recorded.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-12 text-center">Browse Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {loansData.map(loan => (
          <div
            key={loan.id}
            className="bg-afrilend-gray rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img src={loan.image} alt={loan.name} className="w-full h-48 object-cover" />
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
    </div>
  );
}

export default Loans;