import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json();
    if (typeof body.orderNumber !== 'string' || typeof body.email !== 'string' || body.orderNumber.length > 80 || body.email.length > 254) return json({ error: 'Please enter a valid order number and email.' }, 400);
    const orderNumber = body.orderNumber.trim().toUpperCase();
    const email = body.email.trim().toLowerCase();
    if (!/^TS-[0-9A-F]{32}$/.test(orderNumber) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Order not found. Check your order number and email.' }, 404);
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const { data, error } = await client.from('orders').select('order_number,status,created_at').eq('order_number', orderNumber).ilike('email', email.replace(/[\\%_]/g, '\\$&')).maybeSingle();
    if (error) { console.error('Tracking lookup failed:', error.code); return json({ error: 'Tracking is temporarily unavailable. Please try again.' }, 503); }
    if (!data) return json({ error: 'Order not found. Check your order number and email.' }, 404);
    return json(data);
  } catch { return json({ error: 'Unable to process your request.' }, 400); }
});
