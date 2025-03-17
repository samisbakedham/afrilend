import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // Add Link here

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/');
  };

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-heading font-bold text-candlelend-green mb-8 text-center">Login</h2>
      <div className="max-w-md mx-auto bg-candlelend-gray rounded-lg shadow-lg p-6">
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-candlelend-green"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-candlelend-green"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-candlelend-green text-white py-3 rounded-lg hover:bg-candlelend-yellow hover:text-candlelend-green transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/signup" className="text-candlelend-green hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
