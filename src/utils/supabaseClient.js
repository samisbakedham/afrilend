import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

// Log environment variables for debugging
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY);
console.log('REACT_APP_STRIPE_PUBLISHABLE_KEY:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.error('Supabase environment variables are missing.');
}

if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is missing.');
}

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export { supabase, stripePromise };