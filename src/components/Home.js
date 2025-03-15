import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const featuredLoans = [
    { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'Expand her shop', image: 'https://images.unsplash.com/photo-1590650516494-0c8e4c27e8b7' },
    { id: 2, name: 'Kwame', country: 'Ghana', amount: 500, purpose: 'Buy farming tools', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
    { id: 3, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'Start a bakery', image: 'https://images.unsplash.com/photo-1573496359142-b8d8779911e1' },
  ];

  return (
    <div className="text-gray-800 font-body">
      <section className="bg-gradient-to-r from-afrilend-green to-afrilend-yellow text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-4 animate-fade-in">
            Empower Africa’s Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Lend as little as $25 to African entrepreneurs. Choose your interest rate and make a lasting impact.
          </p>
          <Link
            to="/loans"
            className="bg-white text-afrilend-green font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition transform hover:scale-105"
          >
            Start Lending Now
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-afrilend-green">Meet the Entrepreneurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {featuredLoans.map(loan => (
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
      </section>
      <section className="py-16 bg-afrilend-gray">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-8 text-afrilend-green">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">100+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </div>
            <div>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-afrilend-green text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 AfriLend. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-afrilend-yellow transition">About Us</a>
            <a href="#" className="hover:text-afrilend-yellow transition">Contact</a>
            <a href="#" className="hover:text-afrilend-yellow transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;