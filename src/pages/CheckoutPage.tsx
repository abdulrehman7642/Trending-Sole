import { FormEvent, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/products';
import { supabase } from '../lib/supabase';

const emirates = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const areas: Record<string, string[]> = {
  'Abu Dhabi': ['Abu Dhabi', 'Al Ain', 'Al Dhafra', 'Madinat Zayed', 'Khalifa City', 'Yas Island', 'Musaffah'],
  'Dubai': ['Dubai Marina', 'Jumeirah', 'Deira', 'Bur Dubai', 'Business Bay', 'Al Barsha', 'Dubai Silicon Oasis', 'Jebel Ali'],
  'Sharjah': ['Sharjah', 'Al Nahda', 'Al Majaz', 'Al Khan', 'Khor Fakkan', 'Kalba', 'Al Dhaid'],
  'Ajman': ['Ajman', 'Al Nuaimiya', 'Al Rashidiya', 'Al Jurf', 'Masfout', 'Manama'],
  'Umm Al Quwain': ['Umm Al Quwain', 'Al Salamah', 'Falaj Al Mualla', 'Al Raas'],
  'Ras Al Khaimah': ['Ras Al Khaimah', 'Al Nakheel', 'Al Hamra', 'Al Jazirah Al Hamra', 'Al Rams', 'Digdaga'],
  'Fujairah': ['Fujairah', 'Dibba Al Fujairah', 'Al Aqah', 'Mirbah', 'Masafi', 'Qidfa'],
};
const input = 'block w-full mt-2 border border-border bg-ivory rounded-sm px-4 py-3 text-sm outline-none focus:border-primary';
export default function CheckoutPage() {
  const { cartItems, cartTotal, navigate, clearCart, refreshCatalog } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', emirate: '', city: '', area: '', address: '', notes: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const requestId = useRef(crypto.randomUUID());
  const set = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !cartItems.length) return;
    const phone = form.phone.trim();
    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^\+?[0-9\s().-]+$/.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) { setError('Enter a valid phone number with 9 to 15 digits. You can include a country code.'); return; }
    setBusy(true); setError('');
    try {
      const { data, error } = await supabase.functions.invoke('place-order', { body: { request_id: requestId.current, customer: { ...form, phone: `${phone.startsWith('+') ? '+' : ''}${phoneDigits}` }, items: cartItems.map(item => ({ product_id: item.product.id, size: item.size, color: item.color.name, quantity: item.quantity })), expected_total: cartTotal } });
      if (error) {
        let message = 'Unable to place your order. Please try again.';
        if (error.context instanceof Response) { try { const body = await error.context.json(); message = body.error || message; } catch { /* keep generic message */ } }
        setError(message); return;
      }
      if (!data?.order_number) { setError('Unable to confirm the order. Please try again.'); return; }
      clearCart(); void refreshCatalog();
      navigate('order-confirm', { orderNumber: data.order_number, notificationStatus: data.notification_status });
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setBusy(false); }
  };
  if (!cartItems.length) return <div className="max-w-xl mx-auto p-10"><h1 className="text-3xl">Your cart is empty</h1><button onClick={() => navigate('home')} className="mt-5 underline">Continue shopping</button></div>;
  return <div className="max-w-screen-xl mx-auto px-6 py-10"><button onClick={() => navigate('cart')} className="text-sm underline mb-8">Back to cart</button><h1 className="text-4xl mb-2">Checkout</h1><p className="text-muted text-sm mb-8">Delivery throughout the United Arab Emirates</p><div className="grid lg:grid-cols-3 gap-10"><form onSubmit={submit} className="lg:col-span-2 space-y-6"><section className="bg-white border border-border p-6 space-y-4"><h2 className="text-2xl">Contact information</h2><label className="block text-sm">Full name<input className={input} required minLength={2} maxLength={120} autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} /></label><label className="block text-sm">Email address<input className={input} required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} /></label><label className="block text-sm">Phone number<input className={input} required type="tel" autoComplete="tel" placeholder="+971 50 123 4567" value={form.phone} onChange={e => set('phone', e.target.value)} /></label></section><section className="bg-white border border-border p-6 space-y-4"><h2 className="text-2xl">Delivery address</h2><p className="text-sm text-muted">Enter your city and area even if they are not shown in the suggestions.</p><label className="block text-sm">Emirate<select required value={form.emirate} onChange={e => setForm({ ...form, emirate: e.target.value, city: '', area: '' })} className={input}><option value="">Choose an emirate</option>{emirates.map(e => <option key={e}>{e}</option>)}</select></label><label className="block text-sm">City or town<input className={input} required minLength={2} maxLength={100} autoComplete="address-level2" list="uae-locations" value={form.city} onChange={e => set('city', e.target.value)} /></label><label className="block text-sm">Area or neighbourhood<input className={input} required minLength={2} maxLength={100} autoComplete="address-level3" list="uae-locations" value={form.area} onChange={e => set('area', e.target.value)} /></label><datalist id="uae-locations">{(areas[form.emirate] || []).map(area => <option key={area} value={area} />)}</datalist><label className="block text-sm">Building, apartment or villa, and street<input className={input} required minLength={5} maxLength={300} autoComplete="street-address" value={form.address} onChange={e => set('address', e.target.value)} /></label><label className="block text-sm">Delivery notes or landmark (optional)<textarea className={input} maxLength={500} value={form.notes} onChange={e => set('notes', e.target.value)} /></label></section><div className="bg-white border border-border p-6"><h2 className="text-2xl">Payment</h2><p className="mt-3 text-sm">Cash on delivery</p></div>{error && <p role="alert" className="text-terracotta text-sm">{error}</p>}<button disabled={busy} className="bg-primary text-ivory px-8 py-4 text-sm disabled:opacity-50">{busy ? 'Placing order…' : 'Place order'}</button></form><aside className="bg-white border border-border p-6 h-fit space-y-4"><h2 className="text-2xl">Order summary</h2>{cartItems.map(item => <div key={`${item.product.id}-${item.size}-${item.color.name}`} className="text-sm border-b border-border pb-3"><div className="flex justify-between gap-3"><strong>{item.product.name}</strong><span>{formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}</span></div><p className="text-muted mt-1">Size {item.size} · {item.color.name} · Qty {item.quantity}</p></div>)}<div className="flex justify-between text-sm"><span>Delivery</span><span>Free</span></div><div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(cartTotal)}</span></div></aside></div></div>;
}
