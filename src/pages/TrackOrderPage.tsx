import { FormEvent, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

type Status = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
type TrackingResult = { order_number: string; status: Status; created_at: string };
const stages: { status: Status; label: string; detail: string }[] = [
  { status: 'pending', label: 'Order placed', detail: 'We have received your order.' },
  { status: 'confirmed', label: 'Confirmed', detail: 'Your order has been confirmed.' },
  { status: 'processing', label: 'Processing', detail: 'Your order is being prepared.' },
  { status: 'shipped', label: 'Shipped', detail: 'Your order has been dispatched.' },
  { status: 'delivered', label: 'Delivered', detail: 'Your order has been marked as delivered.' },
];
const inputClass = 'mt-2 block w-full rounded-sm border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-primary';
export default function TrackOrderPage() {
  const { pageParams, navigate } = useApp();
  const [orderNumber, setOrderNumber] = useState(pageParams.orderNumber || '');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('track-order', { body: { orderNumber, email } });
      if (error) {
        let message = 'Tracking is temporarily unavailable. Please try again.';
        if (error.context instanceof Response) { try { const body = await error.context.json(); message = body.error || message; } catch { /* use fallback */ } }
        setError(message); return;
      }
      setResult(data as TrackingResult);
    } catch { setError('Could not connect. Please try again.'); }
    finally { setBusy(false); }
  }
  const current = result ? stages.findIndex(stage => stage.status === result.status) : -1;
  return <div className="min-h-[65vh] max-w-3xl mx-auto px-6 py-12 sm:py-16"><button onClick={() => navigate('home')} className="text-xs text-muted hover:text-primary underline mb-7">Back to shop</button><div className="mb-8"><p className="text-xs tracking-[0.2em] uppercase text-gold font-medium mb-3">Your purchase</p><h1 className="font-serif text-4xl text-primary">Track your order</h1><p className="text-sm text-slate mt-3">Enter your order number and the email address used at checkout.</p></div><form onSubmit={submit} className="bg-card border border-border p-6 sm:p-8 space-y-5"><label htmlFor="tracking-number" className="block text-sm font-medium">Order number<input id="tracking-number" required maxLength={80} autoComplete="off" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="TS-…" className={inputClass} /></label><label htmlFor="tracking-email" className="block text-sm font-medium">Email address<input id="tracking-email" required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} /></label>{error && <p role="alert" className="text-sm text-terracotta">{error}</p>}<button disabled={busy} className="bg-primary text-ivory uppercase tracking-widest text-xs font-semibold px-6 py-4 hover:bg-slate disabled:opacity-60">{busy ? 'Checking…' : 'Track order'}</button></form>{result && <section aria-live="polite" className="mt-6 bg-card border border-border p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4 mb-7"><div><p className="text-xs text-muted uppercase tracking-widest">Order</p><h2 className="font-serif text-xl break-all mt-1">{result.order_number}</h2><p className="text-xs text-muted mt-2">Placed {new Intl.DateTimeFormat('en-AE', { dateStyle: 'long', timeZone: 'Asia/Dubai' }).format(new Date(result.created_at))}</p></div><span className="bg-primary/5 text-primary text-xs uppercase tracking-widest px-3 py-2">{result.status}</span></div>{current >= 0 ? <ol className="space-y-5">{stages.map((stage, index) => <li key={stage.status} className="flex gap-4"><span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index <= current ? 'bg-primary text-ivory' : 'bg-stone-100 text-muted'}`}>{index < current ? '✓' : index + 1}</span><div><p className={`text-sm font-semibold ${index <= current ? 'text-primary' : 'text-muted'}`}>{stage.label}{index === current && ' · Current status'}</p>{index === current && <p className="text-sm text-slate mt-1">{stage.detail}</p>}</div></li>)}</ol> : <p className="text-sm text-slate">{result.status === 'cancelled' ? 'This order has been cancelled.' : result.status === 'returned' ? 'This order has been marked as returned.' : 'Please contact the store for an update.'}</p>}<p className="text-xs text-muted mt-7">Status updates are provided by the store.</p></section>}</div>;
}
