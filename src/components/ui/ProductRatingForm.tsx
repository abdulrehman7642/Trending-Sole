import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export default function ProductRatingForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const { refreshCatalog } = useApp();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating || busy) return;
    setBusy(true); setMessage(''); setFailed(false);
    try {
      const key = 'trendingsole-rating-visitor';
      let visitorId = localStorage.getItem(key);
      if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(key, visitorId); }
      const { error } = await supabase.from('product_ratings').insert({ product_id: productId, visitor_id: visitorId, rating });
      if (error?.code === '23505') { setMessage('You have already rated this product on this browser.'); return; }
      if (error) throw error;
      setMessage('Thank you for rating this product.');
      await refreshCatalog();
    } catch {
      setFailed(true);
      setMessage('We could not save your rating. Please try again.');
    } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="border border-border bg-card p-5 sm:p-6 mt-8 max-w-xl">
    <h3 className="font-serif text-2xl text-primary">Rate this product</h3>
    <p className="text-sm text-muted mt-2">Choose one to five stars. One rating per product per browser.</p>
    <fieldset className="mt-4"><legend className="sr-only">Your star rating</legend><div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(value => <label key={value} className="cursor-pointer rounded focus-within:ring-2 focus-within:ring-gold"><input className="sr-only" type="radio" name={`rating-${productId}`} value={value} checked={rating === value} onChange={() => setRating(value)} required /><span aria-hidden="true" className={`text-3xl leading-none ${value <= rating ? 'text-gold' : 'text-border'}`}>★</span><span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span></label>)}
    </div></fieldset>
    <button type="submit" disabled={!rating || busy} className="mt-5 bg-primary text-ivory px-5 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-slate disabled:opacity-50">{busy ? 'Submitting…' : 'Submit rating'}</button>
    {message && <p role={failed ? 'alert' : 'status'} className={`mt-3 text-sm ${failed ? 'text-terracotta' : 'text-slate'}`}>{message}</p>}
  </form>;
}
