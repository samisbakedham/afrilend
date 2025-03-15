import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const featuredLoans = [
    {
      id: 1,
      name: 'Amina',
      country: 'Kenya',
      amount: 300,
      purpose: 'Expand her shop',
      image: 'https://images.unsplash.com/photo-1590650516494-0c8e4c27e8b7',
      story: 'Amina, a 32-year-old entrepreneur from Nairobi, runs a small retail shop. With your support, she aims to expand her inventory to include more household goods, creating jobs for two additional local women.',
    },
    {
      id: 2,
      name: 'Kwame',
      country: 'Ghana',
      amount: 500,
      purpose: 'Buy farming tools',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      story: 'Kwame, a 45-year-old farmer from Accra, needs modern farming tools to increase his crop yield. This investment will help him feed 50 more families in his community sustainably.',
    },
    {
      id: 3,
      name: 'Fatima',
      country: 'Nigeria',
      amount: 400,
      purpose: 'Start a bakery',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d8779911e1',
      story: 'Fatima, a 28-year-old mother from Lagos, dreams of opening a bakery to provide fresh bread to her neighborhood. Your loan will help her purchase equipment and hire two assistants.',
    },
  ];

  return (
    <div className="text-gray-800 font-body">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-afrilend-green to-afrilend-yellow text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-4 animate-fade-in">
            Empower Africa’s Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AfriLend connects compassionate lenders with African entrepreneurs, offering microloans starting at $25. Choose your interest rate, support local growth, and create lasting impact across the continent.
          </p>
          <Link
            to="/loans"
            className="bg-white text-afrilend-green font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Start Lending Now
          </Link>
        </div>
      </section>

      {/* About AfriLend Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-afrilend-green animate-fade-in">
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
              className="mt-4 inline-block bg-afrilend-green text-white py-2 px-6 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Entrepreneurs Section */}
      <section className="py-16 bg-afrilend-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-afrilend-green animate-fade-in">
            Meet the Entrepreneurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {featuredLoans.map((loan, index) => (
              <div
                key={loan.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 animate-fade-in"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <img src={loan.image} alt={loan.name} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-afrilend-green">{loan.name} - {loan.country}</h3>
                  <p className="text-gray-600 mt-2">Needs ${loan.amount} to {loan.purpose}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">{loan.story}</p>
                  <Link
                    to={`/loans/${loan.id}`}
                    className="mt-4 inline-block bg-afrilend-green text-white py-2 px-5 rounded hover:bg-afrilend-yellow hover:text-afrilend-green transition"
                  >
                    Support {loan.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-8 text-afrilend-green animate-fade-in">
            Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">100+</p>
              <p className="text-lg text-gray-600 mt-2">Entrepreneurs Funded</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">$50K+</p>
              <p className="text-lg text-gray-600 mt-2">Lent Across Africa</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-5xl font-heading font-bold text-afrilend-yellow">95%</p>
              <p className="text-lg text-gray-600 mt-2">Repayment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-afrilend-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-afrilend-green animate-fade-in">
            What Our Lenders Say
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 italic mb-4">
              &quot;Lending through AfriLend was a life-changing experience. Seeing Amina grow her business brought me so much joy!&quot; - Jane D., USA
            </p>
            <p className="text-lg text-gray-700 italic">
              &quot;I love how easy it is to support entrepreneurs like Kwame. The impact is real!&quot; - Mark T., Canada
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-afrilend-green text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 AfriLend. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-afrilend-yellow transition">About Us</a>
            <a href="#" className="hover:text-afrilend-yellow transition">Contact</a>
            <a href="#" className="hover:text-afrilend-yellow transition">Terms</a>
            <a href="/login" className="hover:text-afrilend-yellow transition">Login</a>
            <a href="/signup" className="hover:text-afrilend-yellow transition">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;