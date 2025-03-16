import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, setAmount, onDeposit, loading, setLoading }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCheckout = async (event) => {
    event.preventDefault();
    console.log('handleCheckout triggered');

    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }

    setLoading(true);
    console.log('Loading state set to true');

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        setErrorMessage('Stripe failed to load.');
        setLoading(false);
        console.error('Stripe not loaded');
        return;
      }

      console.log('Stripe instance available:', stripe);
      const response = await fetch('https://iqransnptrzuixvlhbvn.supabase.co/functions/v1/create-payment-intent-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_access_token')}`, // Ensure token is stored on login
        },
        body: JSON.stringify({ user_id: localStorage.getItem('user_id'), amount: amount * 100 }),
      });

      console.log('Edge Function Response Status:', response.status, response.statusText);
      const data = await response.json();
      console.log('Edge Function Response Data:', data);

      if (!response.ok || !data.client_secret) {
        const errorMessage = data.error || 'No client_secret returned';
        console.error('Payment Intent error:', errorMessage);
        setErrorMessage(`Failed to create payment intent: ${errorMessage}`);
        setLoading(false);
        return;
      }

      const clientSecret = data.client_secret;
      console.log('Client secret received:', clientSecret);

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_1Jxyz123456789', quantity: 1 }], // Replace with dynamic price ID if using Prices API
        mode: 'payment',
        amount: amount * 100,
        currency: 'usd',
        successUrl: 'https://afrilend.vercel.app/profile?success=true',
        cancelUrl: 'https://afrilend.vercel.app/profile?cancelled=true',
        clientReferenceId: localStorage.getItem('user_id'),
        paymentIntentClientSecret: clientSecret,
      });

      if (error) {
        console.error('Checkout error:', error.message, error);
        setErrorMessage(error.message);
      }
    } catch (err) {
      console.error('Unexpected error in handleCheckout:', err.message, err.stack);
      setErrorMessage('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
      console.log('Loading state set to false in finally block');
    }
  };

  // Handle redirect success/cancel
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      console.log('Payment succeeded via redirect');
      onDeposit();
      setErrorMessage(null);
      navigate('/profile'); // Redirect back to profile
    } else if (urlParams.get('cancelled')) {
      console.log('Payment cancelled via redirect');
      setErrorMessage('Payment was cancelled.');
    }
  }, [navigate, onDeposit]);

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <input
        type="number"
        placeholder="Deposit amount"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-afrilend-green"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        step="0.01"
        disabled={loading}
        required
      />
      <button
        type="submit"
        className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with Card'}
      </button>
      {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}
    </form>
  );
}

export default CheckoutForm;