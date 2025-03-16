import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function CheckoutForm({ amount, setAmount, onDeposit, loading, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('handleSubmit triggered');

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet.');
      setLoading(false);
      console.error('Stripe or elements not loaded:', { stripe, elements });
      return;
    }

    try {
      console.log('Stripe instance available:', stripe);
      console.log('Elements instance available:', elements);
      const clientSecret = window.localStorage.getItem('clientSecret');
      console.log('Client Secret from localStorage:', clientSecret);

      if (!clientSecret) {
        setErrorMessage('Client secret not found in localStorage.');
        setLoading(false);
        console.error('No client secret available');
        return;
      }

      setLoading(true);
      console.log('Loading state set to true');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setErrorMessage('Card element not found.');
        setLoading(false);
        console.error('Card element not initialized');
        return;
      }
      console.log('Card element retrieved');

      console.log('Confirming card payment with client secret:', clientSecret);
      const confirmPromise = stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: 'test@example.com', // Replace with dynamic user email if needed
          },
        },
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Payment timed out after 10 seconds')), 10000);
      });

      const { error, paymentIntent } = await Promise.race([confirmPromise, timeoutPromise]);

      if (error) {
        console.error('Payment error:', error.message, error.code, error.type, error);
        setErrorMessage(error.message);
      } else if (paymentIntent) {
        console.log('Payment Intent response:', paymentIntent);
        switch (paymentIntent.status) {
          case 'succeeded':
            console.log('Payment succeeded:', paymentIntent);
            onDeposit();
            setErrorMessage(null);
            break;
          case 'requires_action':
            console.log('Requires action:', paymentIntent);
            const { error: actionError, paymentIntent: confirmedIntent } = await stripe.handleCardAction(
              paymentIntent.client_secret
            );
            if (actionError) {
              console.error('Action error:', actionError.message, actionError);
              setErrorMessage(actionError.message);
            } else if (confirmedIntent.status === 'succeeded') {
              console.log('Payment succeeded after action:', confirmedIntent);
              onDeposit();
              setErrorMessage(null);
            } else {
              console.error('Payment did not succeed after action:', confirmedIntent);
              setErrorMessage(`Payment status: ${confirmedIntent.status}. Please try again.`);
            }
            break;
          case 'requires_payment_method':
            console.error('Requires payment method:', paymentIntent);
            setErrorMessage('Payment method not attached. Please try again.');
            break;
          case 'processing':
            console.warn('Payment is processing:', paymentIntent);
            setErrorMessage('Payment is being processed. Please wait or try again later.');
            break;
          default:
            console.error('Payment did not succeed:', paymentIntent.status, paymentIntent);
            setErrorMessage(`Payment status: ${paymentIntent.status}. Please try again.`);
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err.message, err.stack);
      setErrorMessage('An unexpected error occurred: ' + err.message);
    } finally {
      console.log('Loading state set to false in finally block');
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