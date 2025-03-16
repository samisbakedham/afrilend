import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Loans from './components/Loans';
import Login from './components/Login';
import Signup from './components/Signup';
import ApplyLoan from './components/ApplyLoan';
import Profile from './components/Profile';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <div className="bg-afrilend-gray">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loans/:id" element={<Loans />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/apply-loan" element={<ApplyLoan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;