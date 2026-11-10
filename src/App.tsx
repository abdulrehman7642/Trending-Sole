// Customer accounts are disabled for now.
// import AccountPage from './pages/AccountPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import AdminLiveData from './pages/admin/AdminLiveData';
import { useEffect, useState, FormEvent } from 'react';
import { supabase } from './lib/supabase';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminInventory from './pages/admin/AdminInventory';
import { AppProvider, useApp } from './context/AppContext';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/ui/CartDrawer';
import Toast from './components/ui/Toast';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
const ADMIN_IDLE_KEY = 'trendingsole-admin-last-activity';
const ADMIN_IDLE_MS = 10 * 60 * 1000;

const PLP_PAGES = ['plp-men', 'plp-women', 'plp-kids', 'plp-new', 'plp-sale', 'plp-search'];

function AdminGate() {
  const { page } = useApp();
  const [state, setState] = useState<'loading' | 'signed-out' | 'denied' | 'allowed'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const check = async () => {
      const current = ++revision;
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!active || current !== revision) return;
      if (error || !user) { setState('signed-out'); return; }
      const { data, error: roleError } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (!active || current !== revision) return;
      if (roleError || !data) { setState('denied'); return; }
      const lastActivity = Number(localStorage.getItem(ADMIN_IDLE_KEY));
      if (!lastActivity || Date.now() - lastActivity >= ADMIN_IDLE_MS) {
        localStorage.removeItem(ADMIN_IDLE_KEY);
        setMessage('Your admin session timed out. Please sign in again.');
        setState('signed-out');
        await supabase.auth.signOut({ scope: 'local' });
        return;
      }
      setState('allowed');
    };
    void check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') localStorage.removeItem(ADMIN_IDLE_KEY);
      setTimeout(() => void check(), 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (state !== 'allowed') return;
    let timer: number;
    let lastWrite = 0;
    let expired = false;
    const expire = () => {
      if (expired) return;
      expired = true;
      localStorage.removeItem(ADMIN_IDLE_KEY);
      setMessage('Your admin session timed out. Please sign in again.');
      setState('signed-out');
      void supabase.auth.signOut({ scope: 'local' });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      const lastActivity = Number(localStorage.getItem(ADMIN_IDLE_KEY));
      const remaining = lastActivity + ADMIN_IDLE_MS - Date.now();
      if (!lastActivity || remaining <= 0) { expire(); return; }
      timer = window.setTimeout(schedule, remaining);
    };
    const onActivity = () => {
      const now = Date.now();
      const lastActivity = Number(localStorage.getItem(ADMIN_IDLE_KEY));
      if (!lastActivity || now - lastActivity >= ADMIN_IDLE_MS) { expire(); return; }
      if (now - lastWrite < 1000) return;
      lastWrite = now;
      localStorage.setItem(ADMIN_IDLE_KEY, String(now));
      schedule();
    };
    const onStorage = (event: StorageEvent) => { if (event.key === ADMIN_IDLE_KEY) schedule(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') schedule(); };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach(event => window.addEventListener(event, onActivity, { passive: true }));
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    schedule();
    return () => {
      window.clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, onActivity));
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [state]);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (!error) localStorage.setItem(ADMIN_IDLE_KEY, String(Date.now()));
    setPassword(''); setBusy(false);
    if (error) setMessage(error.message);
  };
  if (state === 'loading') return <div className="p-10">Checking access?</div>;
  if (state !== 'allowed') return <div className="min-h-screen bg-ivory flex items-center justify-center p-6"><div className="w-full max-w-md bg-white border border-border p-8 shadow-sm"><p className="text-xs tracking-widest text-gold uppercase">Trending Sole</p><h1 className="text-3xl mt-3 mb-2">Admin sign in</h1><p className="text-sm text-muted mb-6">Sign in with an authorized administrator account.</p>{state === 'denied' ? <><p role="alert" className="text-sm text-terracotta">This account does not have administrator access.</p><button onClick={() => void supabase.auth.signOut()} className="mt-5 underline">Sign out</button></> : <form onSubmit={login} className="space-y-4"><label className="block text-sm">Email<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full border border-border p-3" /></label><label className="block text-sm">Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full border border-border p-3" /></label>{message && <p role="alert" className="text-sm text-terracotta">{message}</p>}<button disabled={busy} className="w-full bg-primary text-ivory p-3">{busy ? 'Signing in?' : 'Sign in'}</button></form>}<a href="/" className="block mt-5 text-sm underline">Back to store</a></div></div>;
  let content = <AdminLiveData key={page} />;
  if (page === 'admin-products') content = <AdminProducts />;
  else if (page === 'admin-add-product') content = <AdminAddProduct />;
  else if (page === 'admin-inventory') content = <AdminInventory />;
  else if (page === 'admin-subscribers') content = <AdminSubscribers />;

  return <><AdminLayout>{content}</AdminLayout><Toast /></>;
}

function AppContent() {
  const { page, pageParams } = useApp();

  if (page.startsWith('admin-')) return <AdminGate />;
  const isPLP = PLP_PAGES.includes(page);
  const unavailable = <div className="max-w-screen-xl mx-auto p-10"><h1 className="text-3xl">This feature is not available yet</h1><p className="mt-3">Checkout and administration have not been connected.</p></div>;
  let pageContent = <HomePage />;
  if (isPLP) pageContent = <ProductListPage key={`${page}:${pageParams.query || ''}`} />;
  else if (page === 'pdp') pageContent = <ProductDetailPage />;
  else if (page === 'cart') pageContent = <CartPage />;
  else if (page === 'checkout') pageContent = <CheckoutPage />;
  else if (page === 'order-confirm') pageContent = <OrderConfirmPage />;
  else if (page === 'track-order') pageContent = <TrackOrderPage />;
  // else if (page === 'account') pageContent = <AccountPage />;
  else if (page !== 'home') pageContent = unavailable;

  return (
    <div className="flex flex-col min-h-screen">
      {page !== 'checkout' && page !== 'order-confirm' && <AnnouncementBar />}
      {page !== 'checkout' && page !== 'order-confirm' && <Navbar />}
      <main className="flex-1">{pageContent}</main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
