import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Loans from './components/Loans';

function App() {
  console.log('App component rendered');
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-green-600 text-white p-4 sticky top-0 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">AfriLend</Link>
            <div className="space-x-6">
              <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
              <Link to="/loans" className="hover:text-yellow-300 transition">Browse Loans</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loans" element={<Loans />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

