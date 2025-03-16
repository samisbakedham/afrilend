import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Loans from './components/Loans';
import Login from './components/Login';
import Signup from './components/Signup';
import ApplyLoan from './components/ApplyLoan';
import Profile from './components/Profile';
import Nav from './components/Nav';
import CheckoutPage from './components/CheckoutPage';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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