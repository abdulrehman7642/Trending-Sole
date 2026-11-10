import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/products';

type Order = { id: string; order_number: string; customer: string; email: string; phone: string; status: string; payment_status: string; total: number; created_at: string; address: string; city: string; area?: string; emirate?: string; delivery_notes?: string; items: unknown };
type Promotion = { id: string; name: string; code: string; type: 'percentage' | 'fixed'; value: number; starts_at: string | null; ends_at: string | null; active: boolean };
const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const card = 'bg-white border border-border rounded-sm p-6';
const input = 'w-full border border-border rounded-sm px-3 py-2 bg-ivory text-sm';

export default function AdminLiveData() {
  const { page, products } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: '', code: '', type: 'percentage', value: '', starts_at: '', ends_at: '' });
  const load = async () => {
    setLoading(true); setError('');
    const [orderResult, promoResult] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('promotions').select('*').order('created_at', { ascending: false }),
    ]);
    if (orderResult.error || promoResult.error) setError('Could not load admin data. Check your connection and access.');
    else { setOrders(orderResult.data || []); setPromotions(promoResult.data || []); }
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const updateStatus = async (order: Order, status: string) => {
    setBusy(true); setError('');
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', order.id).select('*').single();
    setBusy(false);
    if (error) { setError(error.message); return; }
    setOrders(items => items.map(item => item.id === order.id ? data : item));
    if (selected?.id === order.id) setSelected(data);
  };
  const addPromotion = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    const value = Number(form.value);
    if (!Number.isFinite(value) || value <= 0 || (form.type === 'percentage' && value > 100) || (form.starts_at && form.ends_at && form.ends_at < form.starts_at)) { setError('Enter a valid discount and date range.'); return; }
    setBusy(true);
    const { error } = await supabase.from('promotions').insert({ name: form.name.trim(), code: form.code.trim().toUpperCase(), type: form.type, value, starts_at: form.starts_at || null, ends_at: form.ends_at || null });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm({ name: '', code: '', type: 'percentage', value: '', starts_at: '', ends_at: '' });
    await load();
  };
  const togglePromotion = async (promo: Promotion) => {
    setBusy(true); setError('');
    const { data, error } = await supabase.from('promotions').update({ active: !promo.active }).eq('id', promo.id).select('*').single();
    setBusy(false);
    if (error) { setError(error.message); return; }
    setPromotions(items => items.map(item => item.id === promo.id ? data : item));
  };
  const customers = Array.from(orders.reduce((map, order) => {
    const key = order.email.toLowerCase(); const previous = map.get(key);
    map.set(key, { name: order.customer, email: order.email, city: order.city, count: (previous?.count || 0) + 1, total: (previous?.total || 0) + Number(order.total) });
    return map;
  }, new Map<string, { name: string; email: string; city: string; count: number; total: number }>()).values());
  const completed = orders.filter(order => order.status !== 'cancelled' && order.status !== 'returned');
  const revenue = completed.reduce((sum, order) => sum + Number(order.total), 0);
  if (loading) return <p>Loading admin data…</p>;
  if (error && !orders.length && !promotions.length) return <div role="alert" className={card}>{error}<button onClick={() => void load()} className="block mt-3 underline">Retry</button></div>;
  return <div className="space-y-6">
    {error && <p role="alert" className="text-terracotta">{error}</p>}
    {(page === 'admin-dashboard' || page === 'admin-analytics') && <><div><h2 className="text-3xl">{page === 'admin-dashboard' ? 'Dashboard' : 'Analytics'}</h2><p className="text-sm text-muted mt-2">Live catalog and order totals</p></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{[{name:'Products', value: products.length}, {name:'Orders', value: orders.length}, {name:'Customers with orders', value: customers.length}, {name:'Order value', value: formatPrice(revenue)}].map(item => <div key={item.name} className={card}><p className="text-xs uppercase tracking-widest text-muted">{item.name}</p><p className="font-serif text-3xl mt-3">{item.value}</p></div>)}</div><p className="text-xs text-muted">Order value excludes cancelled and returned orders and is not necessarily paid revenue.</p></>}
    {page === 'admin-orders' && <><h2 className="text-3xl">Orders</h2><div className={card}>{orders.length === 0 ? <p>No orders yet.</p> : <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Order</th><th>Customer</th><th>Total</th><th>Status</th><th /></tr></thead><tbody>{orders.map(order => <tr key={order.id} className="border-t border-border"><td className="p-2">{order.order_number}</td><td>{order.customer}</td><td>{formatPrice(Number(order.total))}</td><td><select aria-label={`Status for ${order.order_number}`} disabled={busy} value={order.status} onChange={e => void updateStatus(order, e.target.value)} className="border border-border p-2">{statuses.map(status => <option key={status}>{status}</option>)}</select></td><td><button onClick={() => setSelected(order)} className="underline">Details</button></td></tr>)}</tbody></table></div>}</div>{selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4" onKeyDown={e => { if (e.key === 'Escape') setSelected(null); }}><div role="dialog" aria-modal="true" aria-labelledby="order-details-title" className={`${card} w-full max-w-xl max-h-[85dvh] overflow-y-auto`}><div className="flex items-start justify-between gap-4"><h3 id="order-details-title" className="text-xl break-all">{selected.order_number}</h3><button type="button" autoFocus onClick={() => setSelected(null)} className="shrink-0 underline">Close</button></div><div className="mt-4 space-y-2 text-sm break-words"><p><strong>Customer:</strong> {selected.customer}</p><p><strong>Email:</strong> {selected.email}</p><p><strong>Phone:</strong> {selected.phone}</p><p><strong>Delivery address:</strong> {[selected.address, selected.area, selected.city, selected.emirate].filter(Boolean).join(', ')}</p>{selected.delivery_notes && <p><strong>Delivery notes:</strong> {selected.delivery_notes}</p>}<p><strong>Order status:</strong> {selected.status}</p><p><strong>Payment status:</strong> {selected.payment_status}</p><p><strong>Total:</strong> {formatPrice(Number(selected.total))}</p></div><h4 className="mt-5 font-semibold">Items</h4>{Array.isArray(selected.items) ? <ul className="mt-2 space-y-3 text-sm">{selected.items.map((item, index) => <li key={index} className="border-t border-border pt-3"><p className="font-semibold">{item.product || 'Product'}</p><p>SKU: {item.sku || '-'} ? Size: {item.size || '-'} ? Color: {item.color || '-'}</p><p>Quantity: {item.qty ?? '-'} ? Unit price: {Number.isFinite(Number(item.price)) ? formatPrice(Number(item.price)) : '-'}</p></li>)}</ul> : <p className="mt-2 text-sm">Item details are unavailable.</p>}</div></div>}</>}
    {page === 'admin-customers' && <><h2 className="text-3xl">Customers</h2><div className={card}><p className="text-xs text-muted mb-4">Customers are derived from orders, grouped by email.</p>{customers.length === 0 ? <p>No customers with orders yet.</p> : customers.map(customer => <div key={customer.email} className="border-t border-border py-3 text-sm"><strong>{customer.name}</strong> · {customer.email} · {customer.city} · {customer.count} orders · {formatPrice(customer.total)}</div>)}</div></>}
    {page === 'admin-promotions' && <><h2 className="text-3xl">Promotions</h2><p className="text-sm text-muted">Promotion records are stored here. Checkout does not apply them yet.</p><form onSubmit={addPromotion} className={`${card} grid grid-cols-1 md:grid-cols-3 gap-3`}><label className="text-sm">Name<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} className={input} /></label><label className="text-sm">Code<input required value={form.code} onChange={e => setForm({...form, code:e.target.value})} className={input} /></label><label className="text-sm">Type<select value={form.type} onChange={e => setForm({...form, type:e.target.value})} className={input}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label><label className="text-sm">Value<input required type="number" min="0.01" step="0.01" value={form.value} onChange={e => setForm({...form, value:e.target.value})} className={input} /></label><label className="text-sm">Start date<input type="date" value={form.starts_at} onChange={e => setForm({...form, starts_at:e.target.value})} className={input} /></label><label className="text-sm">End date<input type="date" value={form.ends_at} onChange={e => setForm({...form, ends_at:e.target.value})} className={input} /></label><button disabled={busy} className="bg-primary text-ivory py-3 px-5 text-sm">Create promotion</button></form><div className={card}>{promotions.length === 0 ? <p>No promotions yet.</p> : promotions.map(promo => <div key={promo.id} className="flex justify-between items-center border-b border-border py-3 gap-3"><div><strong>{promo.name}</strong><p className="text-sm text-muted">{promo.code} · {promo.type === 'percentage' ? `${promo.value}%` : formatPrice(Number(promo.value))} · {promo.active ? 'Enabled' : 'Disabled'}</p></div><button disabled={busy} onClick={() => void togglePromotion(promo)} className="text-sm underline">{promo.active ? 'Disable' : 'Enable'}</button></div>)}</div></>}
  </div>;
}
