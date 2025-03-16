import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Utility function to delay execution (for rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function CheckoutForm({ amount, setAmount, onDeposit, loading, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

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

      let success = false;
      let attempt = 0;
      while (attempt <= retryCount && attempt < maxRetries && !success) {
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            window.localStorage.getItem('clientSecret'), // Retrieve clientSecret from localStorage
            {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  email: 'test@example.com',
                },
              },
            }
          );

          if (error) {
            console.error('Payment error:', error.message, error.code, error.type);
            if (error.code === 'too_many_requests') {
              console.log(`Rate limit hit, retrying (${attempt + 1}/${maxRetries})...`);
              setRetryCount(attempt + 1);
              await delay(2000 * (attempt + 1)); // Exponential backoff: 2s, 4s, 6s
              attempt++;
              continue;
            }
            setErrorMessage(error.message);
            setLoading(false);
            return;
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded:', paymentIntent);
            onDeposit();
            setErrorMessage(null);
            success = true;
          } else {
            console.error('Payment did not succeed:', paymentIntent);
            setErrorMessage('Payment did not succeed. Please try again.');
          }
        } catch (err) {
          console.error('Unexpected error in confirmCardPayment:', err.message, err.stack);
          if (err.message.includes('429') || err.message.includes('too many requests')) {
            console.log(`Rate limit hit, retrying (${attempt + 1}/${maxRetries})...`);
            setRetryCount(attempt + 1);
            await delay(2000 * (attempt + 1));
            attempt++;
            continue;
          }
          setErrorMessage('An unexpected error occurred: ' + err.message);
          break;
        }
      }

      if (!success) {
        setErrorMessage('Payment failed after multiple attempts due to rate limiting. Please try again later.');
      }
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err.message, err.stack);
      setErrorMessage('An unexpected error occurred: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
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