import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Home() {
  const [featuredLoans, setFeaturedLoans] = useState([]);

  useEffect(() => {
    const fetchFeaturedLoans = async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'open')
        .limit(3);
      if (error) {
        console.error('Error fetching featured loans:', error.message);
      } else {
        setFeaturedLoans(data);
      }
    };
    fetchFeaturedLoans();
  }, []);

  return (
    <div className="text-gray-800 font-body">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Change Lives with Small Loans</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Empower entrepreneurs worldwide by lending as little as $25. Your support helps build businesses and communities.
        </p>
        <Link to="/loans" className="mt-6 inline-block bg-white text-green-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition">
          Get Started
        </Link>
      </section>

      {/* Featured Loans */}
      <section className="py-16 bg-gray-100 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-green-700">Meet the Entrepreneurs</h2>
        <p className="text-center text-gray-600 mt-2">Help people around the world create better lives for themselves.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLoans.length === 0 ? (
            <p className="text-center text-gray-600">No featured loans available.</p>
          ) : (
            featuredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {loan.image && <img src={loan.image} alt={loan.name} className="w-full h-48 object-cover" />}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-green-700">{loan.name} - {loan.country}</h3>
                  <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                  <Link to={`/loans/${loan.id}`} className="mt-4 inline-block bg-green-700 text-white py-2 px-5 rounded hover:bg-green-800 transition">
                    Lend Now
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold text-green-700">How It Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-700">Choose an Entrepreneur</h3>
            <p className="text-gray-600 mt-2">Browse loan requests and select a borrower to support.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-700">Make a Loan</h3>
            <p className="text-gray-600 mt-2">Lend as little as $25 and empower a business owner.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-700">Get Repaid</h3>
            <p className="text-gray-600 mt-2">Receive repayments and reinvest or withdraw your funds.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-700 text-white text-center px-6 md:px-12">
        <h2 className="text-3xl font-bold">Start Lending Today</h2>
        <p className="mt-4 text-lg">Join a global community making a difference.</p>
        <Link to="/signup" className="mt-6 inline-block bg-white text-green-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition">
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>© 2025 CandleLend. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <Link to="/about" className="hover:text-green-400">About Us</Link>
          <Link to="/contact" className="hover:text-green-400">Contact</Link>
          <Link to="/terms" className="hover:text-green-400">Terms</Link>
          <Link to="/login" className="hover:text-green-400">Login</Link>
          <Link to="/signup" className="hover:text-green-400">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;