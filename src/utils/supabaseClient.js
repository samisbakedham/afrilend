import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export { supabase, stripePromise };