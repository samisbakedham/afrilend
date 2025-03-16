import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.7.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2022-11-15',
});

console.log('Starting create-payment-intent function...');

serve(async (req) => {
  // Set CORS headers to allow requests from localhost:3000
  const headers = new Headers({
    'Access-Control-Allow-Origin': 'http://localhost:3000', // Allow your dev server
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // Check if the request has a body
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    // Validate Content-Type
    const contentType = req.headers.get('Content-Type');
    console.log('Content-Type:', contentType);
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid Content-Type:', contentType);
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers,
      });
    }

    // Parse JSON body
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error('Error parsing JSON body:', error.message);
      return new Response(JSON.stringify({ error: 'Invalid JSON body: ' + error.message }), {
        status: 400,
        headers,
      });
    }

    const { user_id, amount } = body;
    console.log('Parsed request body:', { user_id, amount });

    // Validate inputs
    if (!user_id || !amount || amount <= 0) {
      console.error('Invalid input:', { user_id, amount });
      return new Response(JSON.stringify({ error: 'Invalid user_id or amount' }), {
        status: 400,
        headers,
      });
    }

    // Create Payment Intent with only 'card' payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'], // Removed 'apple_pay'
      description: 'Wallet Deposit for AfriLend',
    });

    return new Response(JSON.stringify({ client_secret: paymentIntent.client_secret }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error creating Payment Intent:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers,
    });
  }
});