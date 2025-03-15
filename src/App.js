import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Loans from './components/Loans';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div className="bg-afrilend-gray">
        <nav className="bg-afrilend-green text-white p-4 sticky top-0 shadow-md z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-heading font-bold">AfriLend</Link>
            <div className="space-x-6">
              <Link to="/" className="hover:text-afrilend-yellow transition">Home</Link>
              <Link to="/loans" className="hover:text-afrilend-yellow transition">Browse Loans</Link>
              <Link to="/login" className="hover:text-afrilend-yellow transition">Login</Link>
              <Link to="/signup" className="hover:text-afrilend-yellow transition">Sign Up</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loans/:id" element={<Loans />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;