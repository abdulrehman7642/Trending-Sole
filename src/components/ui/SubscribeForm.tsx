import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setMessage(''); setFailed(false);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim().toLowerCase() });
      if (error && error.code !== '23505') throw error;
      setEmail('');
      setMessage('Thanks for subscribing!');
    } catch {
      setFailed(true);
      setMessage('We could not save your subscription. Please try again.');
    } finally { setBusy(false); }
  }
  return <div className={compact ? '' : 'max-w-md mx-auto'}>
    <form onSubmit={subscribe} className={compact ? 'flex flex-col gap-3' : 'flex flex-col sm:flex-row gap-3'}>
      <label className="sr-only" htmlFor={compact ? 'footer-newsletter-email' : 'home-newsletter-email'}>Email address</label>
      <input id={compact ? 'footer-newsletter-email' : 'home-newsletter-email'} type="email" required maxLength={254} autoComplete="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 min-w-0 bg-ivory/10 border border-ivory/20 rounded-sm px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold" />
      <button disabled={busy} type="submit" className="bg-gold text-primary text-xs tracking-widest uppercase font-semibold py-3 px-6 rounded-sm hover:bg-gold-light transition-colors disabled:opacity-60">{busy ? 'Subscribing…' : 'Subscribe'}</button>
    </form>
    {message && <p role={failed ? 'alert' : 'status'} className={`text-xs mt-3 ${failed ? 'text-red-300' : 'text-ivory/80'}`}>{message}</p>}
  </div>;
}
