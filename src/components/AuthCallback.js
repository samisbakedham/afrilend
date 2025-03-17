import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          toast.success('Successfully signed in with Google!');
          navigate('/profile');
        } else {
          toast.error('Failed to authenticate. Please try again.');
          navigate('/signup');
        }
      } catch (err) {
        console.error('Auth callback error:', err.message);
        toast.error(err.message || 'An unexpected error occurred.');
        navigate('/signup');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto bg-kiva-bg p-8 mt-16 text-center">
      <h2 className="text-2xl font-semibold text-kiva-green">Processing Authentication...</h2>
    </div>
  );
}

export default AuthCallback;