import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // Add Link here

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert('Check your email for a confirmation link!');
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-afrilend-green mb-8 text-center">Sign Up</h2>
      <div className="max-w-md mx-auto bg-afrilend-gray rounded-lg shadow-lg p-6">
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-afrilend-green"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-afrilend-green text-white py-3 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-afrilend-green hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;