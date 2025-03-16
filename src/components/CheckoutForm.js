import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Utility function to delay execution (for rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function CheckoutForm({ amount, setAmount, onDeposit, loading, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet.');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting payment with Stripe...');
      setLoading(true);

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        window.localStorage.getItem('clientSecret'),
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: 'test@example.com', // Replace with dynamic user email if needed
            },
          },
        }
      );

      if (error) {
        console.error('Payment error:', error.message, error.code, error.type);
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        onDeposit();
        setErrorMessage(null);
      } else {
        console.error('Payment did not succeed:', paymentIntent);
        setErrorMessage('Payment did not succeed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err.message, err.stack);
      setErrorMessage('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={{ hidePostalCode: true }} />
      <button
        type="submit"
        className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading || !stripe}
      >
        {loading ? 'Processing...' : 'Pay with Card'}
      </button>
      {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}
    </form>
  );
}

export default CheckoutForm;