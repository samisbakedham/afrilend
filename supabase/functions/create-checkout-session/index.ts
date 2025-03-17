import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'; // Updated to latest stable version
import Stripe from 'https://esm.sh/stripe@latest'; // Updated to latest version

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16', // Updated to latest stable API version
});

console.log('Starting create-checkout-session function...');

// Whitelist of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Development
  'https://candle-labs.com', // Vercel deployment
];

serve(async (req) => {
  const origin = req.headers.get('Origin') || '';
  console.log('Request Origin:', origin);

  // Always set CORS headers, even if origin isn't in whitelist
  const headers = new Headers({
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://candlelend.vercel.app', // Default to Vercel
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

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit for CandleLend',
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://candlelend.vercel.app/profile?success=true',
      cancel_url: 'https://candlelend.vercel.app/profile?cancelled=true',
      client_reference_id: user_id,
    });

    console.log('Checkout Session created:', session);
    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error creating Checkout Session:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers,
    });
  }
});