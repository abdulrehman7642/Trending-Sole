import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

type Item = { product: string; sku: string; size: string; color: string; qty: number; price: number };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const configuredFrom = Deno.env.get('ORDER_EMAIL_FROM') || '';
  const from = !configuredFrom || /@(?:gmail|googlemail)\.com\s*>?$/i.test(configuredFrom) ? 'Trending Sole <onboarding@resend.dev>' : configuredFrom;
  const storeEmail = Deno.env.get('ORDER_EMAIL_TO') || 'trendingsole7@gmail.com';
  if (!apiKey) return response({ error: 'Checkout is not available yet. Please contact the store.' }, 503);
  try {
    const body = await req.json();
    if (!body.request_id || !body.customer || !Array.isArray(body.items) || typeof body.expected_total !== 'number') return response({ error: 'Invalid order.' }, 400);
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const { data, error } = await client.rpc('create_store_order', { p_request_id: body.request_id, p_customer: body.customer, p_items: body.items, p_expected_total: body.expected_total });
    if (error) return response({ error: 'Unable to place the order. Please check availability and refresh the cart.' }, 400);
    const { data: order, error: orderError } = await client.from('orders').select('*').eq('id', body.request_id).single();
    if (orderError || !order) {
      console.error('Saved order could not be loaded for notifications:', orderError?.code);
      return response({ order_number: data.order_number, total: data.total, notification_status: 'failed' });
    }
    const lines = (order.items as Item[]).map(item => `${item.product} | SKU: ${item.sku} | Size: ${item.size} | Color: ${item.color} | Quantity: ${item.qty} | Unit price: AED ${Number(item.price).toFixed(2)}`).join('\n');
    const address = `${order.address}, ${order.area}, ${order.city}, ${order.emirate}, United Arab Emirates`;
    const summary = `Order number: ${order.order_number}\n\nItems:\n${lines}\n\nSubtotal: AED ${Number(order.subtotal).toFixed(2)}\nShipping: AED ${Number(order.shipping).toFixed(2)}\nTotal: AED ${Number(order.total).toFixed(2)}\nPayment: Cash on delivery\n\nDelivery address: ${address}`;
    async function send(to: string, subject: string, text: string, idempotencyKey: string): Promise<'sent' | 'failed'> {
      try {
        const result = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey }, body: JSON.stringify({ from, to: [to], subject, text }) });
        if (!result.ok) { console.error('Order email rejected:', result.status); return 'failed'; }
        return 'sent';
      } catch { console.error('Order email request failed'); return 'failed'; }
    }
    const storeStatus = order.notification_status === 'sent' ? 'sent' : await send(storeEmail, `New order ${order.order_number}`, `New order received\n\nCustomer: ${order.customer}\nEmail: ${order.email}\nPhone: ${order.phone}\nNotes: ${order.delivery_notes || 'None'}\n\n${summary}`, `order/${body.request_id}`);
    const { error: updateError } = await client.from('orders').update({ notification_status: storeStatus }).eq('id', body.request_id);
    if (updateError) console.error('Order email status update failed:', updateError.code);
    return response({ order_number: data.order_number, total: data.total, notification_status: storeStatus });
  } catch (error) { console.error('Order submission failed:', error); return response({ error: 'Unable to process the order. Please try again.' }, 400); }
});
