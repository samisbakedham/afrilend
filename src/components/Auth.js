import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!isLogin && !name) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Login flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/profile');
      } else {
        // Signup flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          role: 'lender',
        });
        toast.success('Signup successful! Please check your email to verify your account.');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Authentication error:', err.message);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://candle-labs.com/profile',
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google login error:', err.message);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {isLogin ? 'Sign in below' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {isLogin
              ? 'or create a new CandleLend account to avoid creating a second account'
              : 'Sign up to start lending or borrowing with CandleLend.'}
          </p>
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-base font-medium">
              {loading ? 'Processing...' : 'Sign in with Google'}
            </span>
          </button>
          <div className="flex items-center justify-center space-x-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-sm text-gray-600">or</span>
            <hr className="w-1/3 border-gray-300" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                placeholder="Enter your password"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiva-green"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-kiva-green focus:ring-kiva-green border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-kiva-green hover:underline">
                Forgot your password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-kiva-green text-white py-3 px-4 rounded-lg hover:bg-kiva-light-green transition text-base font-medium"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-kiva-green hover:underline"
              >
                {isLogin ? 'Create one' : 'Log in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;