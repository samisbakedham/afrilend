import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sessionId } = state || {};

  useEffect(() => {
    const handleCheckout = async () => {
      if (!sessionId) {
        navigate('/profile', { state: { error: 'No session ID provided.' } });
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        navigate('/profile', { state: { error: 'Stripe failed to load.' } });
        return;
      }

      console.log('Initiating Stripe Checkout with session ID:', sessionId);
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('Checkout error:', error.message, error);
        navigate('/profile', { state: { error: error.message } });
      }
    };

    handleCheckout();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-kiva-bg flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-kiva-green mb-4">Processing Payment...</h2>
        <p className="text-kiva-text">Please wait while we redirect you to Stripe Checkout.</p>
      </div>
    </div>
  );
}

export default CheckoutPage;