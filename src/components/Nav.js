import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Nav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-afrilend-green text-white p-4 sticky top-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-heading font-bold">AfriLend</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-afrilend-yellow transition">Home</Link>
          <Link to="/loans" className="hover:text-afrilend-yellow transition">Browse Loans</Link>
          {!user && (
            <>
              <Link to="/login" className="hover:text-afrilend-yellow transition">Login</Link>
              <Link to="/signup" className="hover:text-afrilend-yellow transition">Sign Up</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile" className="hover:text-afrilend-yellow transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="hover:text-afrilend-yellow transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;