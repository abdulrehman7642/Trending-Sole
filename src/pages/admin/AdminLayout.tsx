import { supabase } from '../../lib/supabase';
import { useState, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';

interface NavItem {
  label: string;
  page: Page;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'admin-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Products', page: 'admin-products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Orders', page: 'admin-orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Inventory', page: 'admin-inventory', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { label: 'Promotions', page: 'admin-promotions', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { label: 'Subscribers', page: 'admin-subscribers', icon: 'M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { label: 'Customers', page: 'admin-customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Analytics', page: 'admin-analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { page, navigate } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      {sidebarOpen && <button type="button" aria-label="Close admin menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-primary/50 md:hidden" />}
      <aside
        className={`${sidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-60 md:sticky' : 'hidden md:sticky md:flex md:w-16'} flex-shrink-0 bg-primary text-ivory flex flex-col transition-all duration-300 top-0 h-screen overflow-hidden`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-ivory/10 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <div className="font-serif text-xl tracking-wider">Trending Sole</div>
              <div className="text-[9px] tracking-widest uppercase text-ivory/40 mt-0.5">Admin Portal</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-ivory/60 hover:text-ivory transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => { navigate(item.page); if (window.matchMedia('(max-width: 767px)').matches) setSidebarOpen(false); }}
              title={!sidebarOpen ? item.label : undefined}
              className={`flex items-center gap-3 w-full px-5 py-3 text-xs transition-colors relative ${
                page === item.page
                  ? 'bg-ivory/10 text-ivory'
                  : 'text-ivory/60 hover:text-ivory hover:bg-ivory/5'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {sidebarOpen && (
                <>
                  <span className="font-medium tracking-wide flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-terracotta text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {page === item.page && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-ivory/10 p-4">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-ivory/50 hover:text-ivory transition-colors text-xs"
            title={!sidebarOpen ? 'View Store' : undefined}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {sidebarOpen && <span>View Store</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0"><button type="button" aria-label="Open admin menu" onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button><h1 className="font-sans text-sm font-semibold text-primary capitalize truncate">
            {navItems.find((n) => n.page === page)?.label || 'Admin'}
          </h1></div>
          <div className="flex items-center gap-4">
            <button onClick={() => void supabase.auth.signOut()} className="text-xs text-slate hover:text-primary">Sign out</button>
            <button className="hidden relative text-slate hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-terracotta rounded-full" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-primary font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-primary">Admin User</p>
                <p className="text-[10px] text-muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
