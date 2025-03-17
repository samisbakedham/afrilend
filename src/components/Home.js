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
      <section className="bg-gradient-to-r from-candlelend-green to-candlelend-yellow text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-4 animate-fade-in">
            Empower Africa’s Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AfriLend connects compassionate lenders with African entrepreneurs, offering microloans starting at $25. Choose your interest rate, support local growth, and create lasting impact across the continent.
          </p>
          <Link
            to="/loans"
            className="bg-white text-candlelend-green font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-candlelend-yellow hover:text-candlelend-green transition transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Start Lending Now
          </Link>
        </div>
      </section>

      {/* About AfriLend Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-candlelend-green animate-fade-in">
            About AfriLend
          </h2>
          <div className="max-w-4xl mx-auto text-center text-lg text-gray-700">
            <p className="mb-4">
              Founded in 2023, AfriLend is a platform dedicated to empowering African entrepreneurs by providing accessible microloans. We partner with local communities to identify hardworking individuals with viable business ideas, helping them overcome financial barriers to success.
            </p>
            <p className="mb-4">
              Our mission is to foster economic growth, reduce poverty, and promote sustainable development. With a 95% repayment rate, your investment is both impactful and secure.
            </p>
            <Link
              to="/about"
              className="mt-4 inline-block bg-candlelend-green text-white py-2 px-6 rounded hover:bg-candlelend-yellow hover:text-candlelend-green transition"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Entrepreneurs Section */}
      <section className="py-16 bg-candlelend-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-candlelend-green animate-fade-in">
            Meet the Entrepreneurs
          </h2>
          {featuredLoans.length === 0 ? (
            <p className="text-center text-gray-600">No featured loans available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {featuredLoans.map((loan, index) => (
                <div
                  key={loan.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                >
                  {loan.image && <img src={loan.image} alt={loan.name} className="w-full h-56 object-cover" />}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold text-candlelend-green">{loan.name} - {loan.country}</h3>
                    <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                    <p className="text-sm text-gray-500 mt-2 italic">{loan.description}</p>
                    <Link
                      to={`/loans/${loan.id}`}
                      className="mt-4 inline-block bg-candlelend-green text-white py-2 px-5 rounded hover:bg-candlelend-yellow hover:text-candlelend-green transition"
                    >
                      Support {loan.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Your Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-8 text-candlelend-green animate-fade-in">
            Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-5xl font-heading font-bold text-candlelend-yellow">100+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-5xl font-heading font-bold text-candlelend-yellow">$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-5xl font-heading font-bold text-candlelend-yellow">95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-candlelend-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-candlelend-green animate-fade-in">
            What Our Lenders Say
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 italic mb-4">
              "Lending through AfriLend was a life-changing experience. Seeing Amina grow her business brought me so much joy!" - Jane D., USA
            </p>
            <p className="text-lg text-gray-700 italic">
              "I love how easy it is to support entrepreneurs like Kwame. The impact is real!" - Mark T., Canada
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-candlelend-green text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 AfriLend. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-candlelend-yellow transition">About Us</a>
            <a href="#" className="hover:text-candlelend-yellow transition">Contact</a>
            <a href="#" className="hover:text-candlelend-yellow transition">Terms</a>
            <a href="/login" className="hover:text-candlelend-yellow transition">Login</a>
            <a href="/signup" className="hover:text-candlelend-yellow transition">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;