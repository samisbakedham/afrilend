import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@latest';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
});

console.log('Starting create-payout function...');

// Whitelist of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Development
  'https://afrilend.vercel.app', // Vercel deployment
];

serve(async (req) => {
  const origin = req.headers.get('Origin') || '';
  console.log('Request Origin:', origin);

  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://afrilend.vercel.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
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

    // Create a Payout to the user's bank account (assumes a connected Stripe account)
    const payout = await stripe.payouts.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      destination: 'ba_1NZZlJ2eZvKYlo2C0sL1x2pQ', // Replace with the user's bank account ID (Stripe Connected Account)
      description: `Withdrawal for AfriLend user ${user_id}`,
    });

    console.log('Payout created:', payout);
    return new Response(JSON.stringify({ payoutId: payout.id }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error creating Payout:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers,
    });
  }
});