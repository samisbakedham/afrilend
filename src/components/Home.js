import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FaUsers, FaDollarSign, FaChartLine, FaTwitter, FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations

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
          // Fallback to dummy data if Supabase fails
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

  // Animation variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative py-24" style={{ backgroundColor: 'rgb(34,56,41)' }}>
        <div className="container mx-auto text-center px-4">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 text-white"
          >
            Empower Africa’s Future
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-4xl mx-auto text-white"
          >
            CandleLend connects compassionate lenders with African entrepreneurs, offering microloans starting at $25. Support local growth and create lasting impact.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/loans"
              className="inline-block font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 text-white"
              style={{ backgroundColor: 'rgb(39,106,67)' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(34,56,41)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(39,106,67)')}
            >
              Start Lending Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About CandleLend Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(237,244,241)' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{ color: 'rgb(34,56,41)' }}
          >
            About CandleLend
          </motion.h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg mb-6 text-gray-900">
              Founded in 2023, CandleLend empowers African entrepreneurs with accessible microloans. We partner with local communities to support hardworking individuals with viable business ideas.
            </p>
            <p className="text-lg mb-6 text-gray-900">
              Our mission is to foster economic growth and reduce poverty with a 95% repayment rate, ensuring your investment is impactful and secure.
            </p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/about"
                className="inline-block py-2 px-6 rounded transition text-white"
                style={{ backgroundColor: 'rgb(39,106,67)' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(34,56,41)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(39,106,67)')}
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Entrepreneurs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{ color: 'rgb(34,56,41)' }}
          >
            Meet the Entrepreneurs
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
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold" style={{ color: 'rgb(39,106,67)' }}>
                  {loan.name} - {loan.country}
                </h3>
                <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                <p className="text-sm text-gray-500 mt-2">Funded: ${loan.funded_amount || 0} / ${loan.amount}</p>
                <Link
                  to={`/loans/${loan.id}`}
                  className="mt-4 inline-block py-2 px-4 rounded transition text-white"
                  style={{ backgroundColor: 'rgb(39,106,67)' }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(34,56,41)')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(39,106,67)')}
                >
                  Support {loan.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/loans"
              className="inline-block py-3 px-8 rounded-lg transition text-white"
              style={{ backgroundColor: 'rgb(75,85,99)' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(55,65,81)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(75,85,99)')}
            >
              View All Loans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Your Impact Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(237,244,241)' }}>
        <div className="container mx-auto text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold mb-12"
            style={{ color: 'rgb(34,56,41)' }}
          >
            Your Impact
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <FaUsers className="text-5xl mb-4" style={{ color: 'rgb(39,106,67)' }} />
              <p className="text-5xl font-semibold" style={{ color: 'rgb(34,56,41)' }}>10+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <FaDollarSign className="text-5xl mb-4" style={{ color: 'rgb(39,106,67)' }} />
              <p className="text-5xl font-semibold" style={{ color: 'rgb(34,56,41)' }}>5K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <FaChartLine className="text-5xl mb-4" style={{ color: 'rgb(39,106,67)' }} />
              <p className="text-5xl font-semibold" style={{ color: 'rgb(34,56,41)' }}>95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16" style={{ backgroundColor: 'rgb(237,244,241)' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{ color: 'rgb(34,56,41)' }}
          >
            What Our Lenders Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Jane D."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'rgb(34,56,41)' }}>Jane D.</p>
                  <p className="text-sm text-gray-600">USA</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Lending through CandleLend was life-changing. Seeing Amina grow her business brought me joy!"
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/2.jpg"
                  alt="Mark T."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold" style={{ color: 'rgb(34,56,41)' }}>Mark T.</p>
                  <p className="text-sm text-gray-600">Canada</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I love supporting entrepreneurs like Kwame. The impact is real and rewarding!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white" style={{ backgroundColor: 'rgb(34,56,41)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-4">CandleLend</h3>
              <p className="text-gray-300">
                Empowering African entrepreneurs through microloans. Join us in making a difference.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block hover:text-[rgb(39,106,67)] transition">About Us</Link>
                <Link to="/contact" className="block hover:text-[rgb(39,106,67)] transition">Contact</Link>
                <Link to="/terms" className="block hover:text-[rgb(39,106,67)] transition">Terms</Link>
                <Link to="/auth" className="block hover:text-[rgb(39,106,67)] transition">Sign In</Link>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <div className="flex justify-center md:justify-end space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-[rgb(39,106,67)] transition">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-[rgb(39,106,67)] transition">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-[rgb(39,106,67)] transition">
                  <FaInstagram size={24} />
                </a>
              </div>
              <div className="flex justify-center md:justify-end">
                <input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  className="p-2 rounded-l-lg border-none focus:outline-none text-gray-800"
                />
                <button
                  className="py-2 px-4 rounded-r-lg transition text-white"
                  style={{ backgroundColor: 'rgb(39,106,67)' }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgb(34,56,41)')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgb(39,106,67)')}
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