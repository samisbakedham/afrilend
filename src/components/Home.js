import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const featuredLoans = [
    { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'Expand her shop', image: 'https://via.placeholder.com/300x200?text=Amina' },
    { id: 2, name: 'Kwame', country: 'Ghana', amount: 500, purpose: 'Buy farming tools', image: 'https://via.placeholder.com/300x200?text=Kwame' },
    { id: 3, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'Start a bakery', image: 'https://via.placeholder.com/300x200?text=Fatima' },
  ];

  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-r from-green-500 to-yellow-400 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in">
            Empower Africa’s Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Lend as little as $25 to African entrepreneurs. Choose your interest rate and make a lasting impact.
          </p>
          <Link
            to="/loans"
            className="bg-white text-green-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-300 hover:text-green-800 transition transform hover:scale-105"
          >
            Start Lending Now
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-700">Meet the Entrepreneurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {featuredLoans.map(loan => (
              <div
                key={loan.id}
                className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <img src={loan.image} alt={loan.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-600">{loan.name} - {loan.country}</h3>
                  <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                  <Link
                    to="/loans"
                    className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                  >
                    Support {loan.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-green-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-green-700">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div>
              <p className="text-5xl font-bold text-yellow-500">100+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-yellow-500">$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-yellow-500">95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-green-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 AfriLend. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-yellow-300 transition">About Us</a>
            <a href="#" className="hover:text-yellow-300 transition">Contact</a>
            <a href="#" className="hover:text-yellow-300 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;