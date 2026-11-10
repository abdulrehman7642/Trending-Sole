import BrandLogo from '../ui/BrandLogo';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';

const navLinks: { label: string; page: Page }[] = [
  { label: 'Men', page: 'plp-men' },
  { label: 'Women', page: 'plp-women' },
  { label: 'Kids', page: 'plp-kids' },
  { label: 'New Arrivals', page: 'plp-new' },
  { label: 'Sale', page: 'plp-sale' },
];

export default function Navbar() {
  const { navigate, cartCount, page, setCartOpen, cartOpen, wishlist } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Mobile menu */}
          <button
            className="lg:hidden text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="font-serif text-lg sm:text-2xl font-semibold text-primary tracking-wide sm:tracking-wider whitespace-nowrap absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <BrandLogo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`text-xs tracking-widest uppercase font-medium transition-colors hover:text-gold pb-0.5 border-b border-transparent hover:border-gold ${
                  page === link.page ? 'text-gold border-gold' : 'text-slate'
                } ${link.label === 'Sale' ? '!text-terracotta hover:!text-terracotta hover:!border-terracotta' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-slate hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            {/* Customer accounts are disabled for now.
            <button
              onClick={() => navigate('account')}
              className="hidden sm:block text-slate hover:text-primary transition-colors"
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
            </button>
            */}
            <button
              onClick={() => navigate('plp-new')}
              className="hidden sm:block text-slate hover:text-primary transition-colors relative"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="text-slate hover:text-primary transition-colors relative"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-ivory text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-ivory px-6 lg:px-10 py-3 flex items-center gap-3">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shoes, brands, styles…"
              className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none font-sans"
            />
            <button onClick={() => setSearchOpen(false)} className="text-muted hover:text-primary text-xs tracking-wide uppercase">
              Close
            </button>
          </div>
        )}
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-primary/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] overflow-y-auto bg-ivory flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <BrandLogo />
              <button onClick={() => setMobileOpen(false)} className="text-slate">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => { navigate(link.page); setMobileOpen(false); }}
                  className={`text-left text-sm tracking-widest uppercase font-medium py-3 px-4 rounded transition-colors hover:bg-primary/5 ${
                    link.label === 'Sale' ? 'text-terracotta' : 'text-slate'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
            {/* Customer accounts are disabled for now.
            <div className="mt-auto p-6 border-t border-border flex gap-4">
              <button onClick={() => { navigate('account'); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-slate">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                My Account
              </button>
            </div>
            */}
          </div>
        </div>
      )}
    </>
  );
}
