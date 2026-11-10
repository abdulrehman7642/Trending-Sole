import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

type Mode = 'signin' | 'signup';
const input = 'mt-2 w-full rounded-sm border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-primary';
export default function AccountPage() {
  const { navigate } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const sync = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      setUser(error ? null : data.user);
      setLoading(false);
    };
    void sync();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { window.setTimeout(() => void sync(), 0); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(''); setMessage('');
    if (mode === 'signup' && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (mode === 'signup' && password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/account` } });
        if (error) throw error;
        setPassword(''); setConfirmPassword('');
        if (!data.session) setMessage('If this email can be registered, check your inbox for a confirmation link, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setPassword(''); setConfirmPassword('');
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setError('');
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) setError('Could not sign out. Please try again.');
    setBusy(false);
  }
  return <div className="max-w-xl mx-auto px-6 py-12 sm:py-16 min-h-[60vh]"><button onClick={() => navigate('home')} className="mb-7 text-xs text-muted underline hover:text-primary">Back to shop</button><div className="border border-border bg-card p-6 sm:p-8"><p className="text-xs tracking-[0.2em] uppercase text-gold">Trending Sole</p><h1 className="font-serif text-4xl text-primary mt-3">{user ? 'My account' : mode === 'signup' ? 'Create an account' : 'Welcome back'}</h1>{loading ? <p className="text-sm text-muted mt-6">Loading account…</p> : user ? <div className="mt-6 space-y-5"><p className="text-sm text-slate break-all">Signed in as <strong>{user.email}</strong></p><button onClick={() => navigate('track-order')} className="block border border-border px-5 py-3 text-sm hover:border-primary">Track an order</button>{error && <p role="alert" className="text-sm text-terracotta">{error}</p>}<button disabled={busy} onClick={() => void signOut()} className="bg-primary text-ivory px-6 py-3 text-sm disabled:opacity-50">{busy ? 'Signing out…' : 'Sign out'}</button></div> : <><p className="text-sm text-muted mt-3">{mode === 'signup' ? 'Create an account with your email and password.' : 'Sign in to your account.'}</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium" htmlFor="account-email">Email address<input id="account-email" type="email" required maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={input} /></label><label className="block text-sm font-medium" htmlFor="account-password">Password<input id="account-password" type="password" required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} className={input} /></label>{mode === 'signup' && <label className="block text-sm font-medium" htmlFor="account-confirm-password">Confirm password<input id="account-confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={input} /></label>}{error && <p role="alert" className="text-sm text-terracotta">{error}</p>}{message && <p role="status" className="text-sm text-slate">{message}</p>}<button disabled={busy} type="submit" className="w-full bg-primary text-ivory py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-slate disabled:opacity-50">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button></form><p className="mt-6 text-sm text-muted">{mode === 'signup' ? 'Already have an account?' : 'New to Trending Sole?'} <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setMessage(''); setPassword(''); setConfirmPassword(''); }} className="text-primary underline underline-offset-4">{mode === 'signup' ? 'Sign in' : 'Create an account'}</button></p></>}</div></div>;
}
