import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && (!email || !password)) {
      setError('Please enter both email and password.');
      return;
    }
    if (step === 2 && !name) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        role: 'lender',
      });
      toast.success('Signup successful! Please check your email to verify your account.');
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err.message);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'https://afrilend.vercel.app/profile',
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('Social login error:', err.message);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-kiva-bg p-8 mt-16">
      <h2 className="text-4xl font-bold text-kiva-green mb-8 text-center">Sign Up</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-kiva-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-kiva-text">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Next'}
            </button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">Or sign up with:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button
                onClick={() => handleSocialLogin('apple')}
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Apple'}
              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Google'}
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-kiva-text">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
              placeholder="Enter your name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-kiva-green text-white py-2 rounded-lg hover:bg-kiva-light-green transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full mt-2 text-kiva-green hover:underline"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}

export default Signup;