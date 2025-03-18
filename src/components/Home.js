import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FaUsers, FaDollarSign, FaGlobe, FaTwitter, FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Home() {
  const [featuredLoans, setFeaturedLoans] = useState([]);

  useEffect(() => {
    const fetchFeaturedLoans = async () => {
      try {
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .eq('status', 'open')
          .limit(3);
        if (error) {
          console.error('Error fetching featured loans:', error.message);
          setFeaturedLoans([
            { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'expand her shop', funded_amount: 0 },
            { id: 2, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'start a bakery', funded_amount: 0 },
            { id: 3, name: 'Joseph', country: 'Uganda', amount: 600, purpose: 'expand his carpentry business', funded_amount: 0 },
          ]);
        } else {
          console.log('Supabase data:', data);
          setFeaturedLoans(data.length > 0 ? data : [
            { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'expand her shop', funded_amount: 0 },
            { id: 2, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'start a bakery', funded_amount: 0 },
            { id: 3, name: 'Joseph', country: 'Uganda', amount: 600, purpose: 'expand his carpentry business', funded_amount: 0 },
          ]);
        }
      } catch (err) {
        console.error('Unexpected error fetching loans:', err.message);
        setFeaturedLoans([
          { id: 1, name: 'Amina', country: 'Kenya', amount: 300, purpose: 'expand her shop', funded_amount: 0 },
          { id: 2, name: 'Fatima', country: 'Nigeria', amount: 400, purpose: 'start a bakery', funded_amount: 0 },
          { id: 3, name: 'Joseph', country: 'Uganda', amount: 600, purpose: 'expand his carpentry business', funded_amount: 0 },
        ]);
      }
    };
    fetchFeaturedLoans();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="font-sans text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-semibold" style={{ color: '#223829' }}>
            CandleLend
          </div>
          <nav className="flex space-x-4">
            <Link to="/how-it-works" className="text-gray-700 hover:text-[#276A43] transition">How it works</Link>
            <Link to="/loans" className="text-gray-700 hover:text-[#276A43] transition">Lend</Link>
            <Link to="/impact" className="text-gray-700 hover:text-[#276A43] transition">Impact</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#276A43] transition">About</Link>
            <Link to="/auth" className="text-gray-700 hover:text-[#276A43] transition">Sign in</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16" style={{ backgroundColor: '#EDF4F1' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1560493676-04071e52ba2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")',
            opacity: 0.5,
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6"
            style={{ color: '#223829' }}
          >
            Crowdfunded microloans that change lives
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/loans"
              className="inline-block font-medium py-3 px-8 rounded-lg shadow-md transition text-white"
              style={{ backgroundColor: '#276A43' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2AA967')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#276A43')}
            >
              Lend now
            </Link>
            <Link
              to="/about"
              className="ml-4 text-[#276A43] hover:text-[#2AA967] transition"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <FaDollarSign className="text-4xl mb-4" style={{ color: '#276A43' }} />
              <p className="text-3xl font-semibold" style={{ color: '#223829' }}>$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <FaUsers className="text-4xl mb-4" style={{ color: '#276A43' }} />
              <p className="text-3xl font-semibold" style={{ color: '#223829' }}>100+</p>
              <p className="text-lg text-gray-600 mt-2">Lenders Worldwide</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <FaGlobe className="text-4xl mb-4" style={{ color: '#276A43' }} />
              <p className="text-3xl font-semibold" style={{ color: '#223829' }}>3 Countries</p>
              <p className="text-lg text-gray-600 mt-2">Supported</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Borrower Stories Section */}
      <section className="py-16" style={{ backgroundColor: '#EDF4F1' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{ color: '#223829' }}
          >
            Lend to an entrepreneur today
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLoans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.2 * (index + 1) }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image Coming Soon</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#223829' }}>
                    {loan.name}, {loan.country}
                  </h3>
                  <p className="text-gray-600 mt-2">{loan.purpose}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: '#276A43', width: `${(loan.funded_amount || 0) / loan.amount * 100 || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      ${loan.funded_amount || 0} raised of ${loan.amount}
                    </p>
                  </div>
                  <Link
                    to={`/loans/${loan.id}`}
                    className="mt-4 inline-block py-2 px-4 rounded transition text-white"
                    style={{ backgroundColor: '#276A43' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#2AA967')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#276A43')}
                  >
                    Lend now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ color: '#223829' }}
          >
            Lend every month from $5
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Support a borrower every month from a selection handpicked for you.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/loans"
              className="inline-block py-3 px-8 rounded-lg transition text-white"
              style={{ backgroundColor: '#276A43' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2AA967')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#276A43')}
            >
              Join monthly lending
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white" style={{ backgroundColor: '#223829' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">CandleLend</h3>
              <p className="text-gray-300">
                Crowdfunded microloans that change lives.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <div className="space-y-2">
                <Link to="/about" className="block hover:text-[#2AA967] transition">About Us</Link>
                <Link to="/impact" className="block hover:text-[#2AA967] transition">Impact</Link>
                <Link to="/how-it-works" className="block hover:text-[#2AA967] transition">How it works</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Lend</h3>
              <div className="space-y-2">
                <Link to="/loans" className="block hover:text-[#2AA967] transition">Lend now</Link>
                <Link to="/categories" className="block hover:text-[#2AA967] transition">Categories</Link>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <div className="flex justify-center md:justify-end space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-[#2AA967] transition">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#2AA967] transition">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#2AA967] transition">
                  <FaInstagram size={24} />
                </a>
              </div>
              <div className="flex justify-center md:justify-end">
                <input
                  type="email"
                  placeholder="Email address"
                  className="p-2 rounded-l-lg border-none focus:outline-none text-gray-800"
                />
                <button
                  className="py-2 px-4 rounded-r-lg transition text-white"
                  style={{ backgroundColor: '#276A43' }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#2AA967')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#276A43')}
                >
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-300 mt-8">
            © 2025 CandleLend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;