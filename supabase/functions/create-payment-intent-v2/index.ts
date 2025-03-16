import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.7.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2022-11-15',
});

console.log('Starting create-payment-intent-v2 function...');

// Whitelist of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Development
  'https://afrilend.vercel.app', // Vercel deployment
];

serve(async (req) => {
  const origin = req.headers.get('Origin') || '';
  console.log('Request Origin:', origin);

  // Always set CORS headers, even if origin isn't in whitelist
  const headers = new Headers({
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://afrilend.vercel.app', // Default to Vercel
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  });

  console.log('CORS Headers Set:', {
    'Access-Control-Allow-Origin': headers.get('Access-Control-Allow-Origin'),
  });

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request with origin:', origin);
    return new Response(null, { status: 204, headers });
  }

  try {
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    const contentType = req.headers.get('Content-Type');
    console.log('Content-Type:', contentType);
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid Content-Type:', contentType);
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers,
      });
    }

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

    if (!user_id || !amount || amount <= 0) {
      console.error('Invalid input:', { user_id, amount });
      return new Response(JSON.stringify({ error: 'Invalid user_id or amount' }), {
        status: 400,
        headers,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      description: 'Wallet Deposit for AfriLend',
    });

    console.log('Payment Intent created:', paymentIntent);
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