import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { FaUsers, FaDollarSign, FaChartLine, FaTwitter, FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations

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

  // Animation variants for Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="text-gray-800 font-body">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-400 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')]"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight"
          >
            Empower Africa’s Future
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            CandleLend connects compassionate lenders with African entrepreneurs, offering microloans starting at $25. Choose your interest rate, support local growth, and create lasting impact.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/loans"
              className="inline-block bg-white text-green-700 font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-green-100 hover:text-green-800 transition transform hover:scale-105"
            >
              Start Lending Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About CandleLend Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-green-700"
          >
            About CandleLend
          </motion.h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="African entrepreneur"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="text-center md:text-left"
            >
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2023, CandleLend is dedicated to empowering African entrepreneurs by providing accessible microloans. We partner with local communities to identify hardworking individuals with viable business ideas, helping them overcome financial barriers.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our mission is to foster economic growth, reduce poverty, and promote sustainable development. With a 95% repayment rate, your investment is both impactful and secure.
              </p>
              <Link
                to="/about"
                className="inline-block bg-green-700 text-white py-3 px-8 rounded-lg hover:bg-green-800 transition"
              >
                Learn More About Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Entrepreneurs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-green-700"
          >
            Meet the Entrepreneurs
          </motion.h2>
          {featuredLoans.length === 0 ? (
            <p className="text-center text-gray-600">No featured loans available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredLoans.map((loan, index) => (
                <motion.div
                  key={loan.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: 0.2 * (index + 1) }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:shadow-xl transition duration-300"
                >
                  {loan.image ? (
                    <img
                      src={loan.image}
                      alt={loan.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold text-green-700">{loan.name} - {loan.country}</h3>
                    <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                    <p className="text-sm text-gray-500 mt-2 italic line-clamp-3">{loan.description}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(loan.funded_amount || 0) / loan.amount * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Funded: ${(loan.funded_amount || 0).toFixed(2)} / ${loan.amount}
                      </p>
                    </div>
                    <Link
                      to={`/loans/${loan.id}`}
                      className="mt-4 inline-block bg-green-700 text-white py-2 px-5 rounded-lg hover:bg-green-800 transition"
                    >
                      Support {loan.name}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
              className="inline-block bg-gray-700 text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition"
            >
              View All Loans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Your Impact Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-5xl font-heading font-bold mb-12 text-green-700"
          >
            Your Impact
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <FaUsers className="text-5xl text-green-600 mb-4" />
              <p className="text-5xl font-heading font-bold text-green-700">100+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <FaDollarSign className="text-5xl text-green-600 mb-4" />
              <p className="text-5xl font-heading font-bold text-green-700">$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <FaChartLine className="text-5xl text-green-600 mb-4" />
              <p className="text-5xl font-heading font-bold text-green-700">95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-green-700"
          >
            What Our Lenders Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Jane D."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Jane D.</p>
                  <p className="text-sm text-gray-600">USA</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Lending through CandleLend was a life-changing experience. Seeing Amina grow her business brought me so much joy!"
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/2.jpg"
                  alt="Mark T."
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Mark T.</p>
                  <p className="text-sm text-gray-600">Canada</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I love how easy it is to support entrepreneurs like Kwame. The impact is real!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold mb-4">CandleLend</h3>
              <p className="text-gray-300">
                Empowering African entrepreneurs through microloans. Join us in making a difference.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block hover:text-green-300 transition">About Us</Link>
                <Link to="/contact" className="block hover:text-green-300 transition">Contact</Link>
                <Link to="/terms" className="block hover:text-green-300 transition">Terms</Link>
                <Link to="/auth" className="block hover:text-green-300 transition">Sign In</Link>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-xl font-heading font-semibold mb-4">Stay Connected</h3>
              <div className="flex justify-center md:justify-end space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-green-300 transition">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-green-300 transition">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-300 hover:text-green-300 transition">
                  <FaInstagram size={24} />
                </a>
              </div>
              <div className="flex justify-center md:justify-end">
                <input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  className="p-2 rounded-l-lg border-none focus:outline-none text-gray-800"
                />
                <button className="bg-green-600 text-white py-2 px-4 rounded-r-lg hover:bg-green-700 transition">
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