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
    console.log('Content-Type:', contentTyp