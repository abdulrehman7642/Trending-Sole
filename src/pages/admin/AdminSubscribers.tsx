import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Subscriber = { id: string; email: string; created_at: string };
export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Subscriber | null>(null);
  async function load() {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('newsletter_subscribers').select('id,email,created_at').order('created_at', { ascending: false });
    if (error) setError('Could not load subscribers. Please try again.');
    else setSubscribers(data || []);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);
  async function remove(subscriber: Subscriber) {
    setRemoving(subscriber.id); setError('');
    const { data, error } = await supabase.from('newsletter_subscribers').delete().eq('id', subscriber.id).select('id');
    if (error || !data?.length) setError('Could not remove this subscriber. Please try again.');
    else setSubscribers(items => items.filter(item => item.id !== subscriber.id));
    setRemoving(null); setConfirm(null);
  }
  const filtered = subscribers.filter(item => item.email.includes(search.trim().toLowerCase()));
  return <div className="space-y-6 max-w-5xl"><div><h2 className="font-serif text-3xl text-primary">Subscribers</h2><p className="text-sm text-muted mt-2">{subscribers.length} newsletter {subscribers.length === 1 ? 'subscriber' : 'subscribers'}</p></div><div className="bg-card border border-border p-5"><label className="block text-sm text-slate" htmlFor="subscriber-search">Search by email</label><input id="subscriber-search" type="search" value={search} onChange={e => setSearch(e.target.value)} className="mt-2 w-full max-w-md border border-border bg-ivory rounded-sm px-3 py-2" /></div>{error && <p role="alert" className="text-terracotta">{error} <button className="underline" onClick={() => void load()}>Retry</button></p>}<div className="bg-card border border-border overflow-x-auto">{loading ? <p className="p-6">Loading subscribers…</p> : filtered.length === 0 ? <p className="p-6 text-sm text-muted">{search ? 'No matching subscribers.' : 'No subscribers yet.'}</p> : <table className="w-full min-w-[460px] text-left text-sm"><thead className="bg-stone-50"><tr><th className="p-4">Email</th><th className="p-4">Subscribed</th><th className="p-4"><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map(item => <tr className="border-t border-border" key={item.id}><td className="p-4 break-all">{item.email}</td><td className="p-4 whitespace-nowrap">{new Intl.DateTimeFormat('en-AE', { dateStyle: 'medium', timeZone: 'Asia/Dubai' }).format(new Date(item.created_at))}</td><td className="p-4 text-right"><button className="text-terracotta underline" onClick={() => setConfirm(item)}>Remove</button></td></tr>)}</tbody></table>}</div><p className="text-xs text-muted">Email campaigns are not connected yet. This list stores newsletter sign-ups.</p>{confirm && <div role="dialog" aria-modal="true" aria-labelledby="remove-subscriber-title" className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"><div className="bg-white p-6 max-w-sm w-full space-y-4"><h3 id="remove-subscriber-title" className="text-xl">Remove subscriber?</h3><p className="text-sm break-all">{confirm.email}</p><div className="flex gap-3"><button disabled={!!removing} onClick={() => setConfirm(null)} className="border border-border px-4 py-2">Cancel</button><button disabled={!!removing} onClick={() => void remove(confirm)} className="bg-terracotta text-white px-4 py-2">{removing ? 'Removing…' : 'Remove'}</button></div></div></div>}</div>;
}
