import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

function CheckoutForm({ amount, setAmount, onDeposit, loading }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/profile', // Adjust this URL for production
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      onDeposit(); // Trigger the deposit logic
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className={`w-full bg-afrilend-green text-white py-2 rounded-lg hover:bg-afrilend-yellow hover:text-afrilend-green transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading || !stripe || !amount}
      >
        {loading ? 'Processing...' : 'Pay with Apple Pay'}
      </button>
      {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}
    </form>
  );
}

export default CheckoutForm;