import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError.message);
          throw new Error(sessionError.message || 'Failed to fetch session.');
        }
        if (data.session) {
          console.log('Session retrieved successfully:', data.session);
          toast.success('Successfully signed in with Google!');
          navigate('/profile');
        } else {
          console.error('No session found after OAuth redirect.');
          throw new Error('No session found. Please try again.');
        }
      } catch (err) {
        console.error('Auth callback error:', err.message);
        setError(err.message || 'An unexpected error occurred during authentication.');
        toast.error(err.message || 'An unexpected error occurred during authentication.');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-kiva-bg p-8 mt-16 text-center">
        <h2 className="text-2xl font-semibold text-red-600">Authentication Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-4 bg-kiva-green text-white py-2 px-4 rounded-lg hover:bg-kiva-light-green transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-kiva-bg p-8 mt-16 text-center">
      <h2 className="text-2xl font-semibold text-kiva-green">Processing Authentication...</h2>
    </div>
  );
}

export default AuthCallback;