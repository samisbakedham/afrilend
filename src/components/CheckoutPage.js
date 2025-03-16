import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clientSecret, amount } = state || {};

  useEffect(() => {
    const handleCheckout = async () => {
      if (!clientSecret) {
        navigate('/profile', { state: { error: 'No client secret provided.' } });
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        navigate('/profile', { state: { error: 'Stripe failed to load.' } });
        return;
      }

      console.log('Initiating Stripe Checkout with client secret:', clientSecret);
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        amount: amount,
        currency: 'usd',
        successUrl: 'https://afrilend.vercel.app/profile?success=true',
        cancelUrl: 'https://afrilend.vercel.app/profile?cancelled=true',
        clientReferenceId: localStorage.getItem('user_id'),
        paymentIntentClientSecret: clientSecret,
      });

      if (error) {
        console.error('Checkout error:', error.message, error);
        navigate('/profile', { state: { error: error.message } });
      }
    };

    handleCheckout();
  }, [clientSecret, amount, navigate]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-semibold text-afrilend-green mb-4">Processing Payment...</h2>
      <p>Please wait while we redirect you to Stripe Checkout.</p>
    </div>
  );
}

export default CheckoutPage;