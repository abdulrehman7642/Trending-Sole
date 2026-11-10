import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function QuickNav() {
  const { navigate, page } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', page: 'home' as const },
    { label: 'Products', page: 'plp-men' as const },
    { label: 'Cart', page: 'cart' as const },
    { label: 'Admin', page: 'admin-dashboard' as const },
  ];

  return (
    <div className="fixed bottom-3 right-3 z-30 flex flex-col items-end gap-2 sm:bottom-4 sm:right-4">
      {open && <div className="bg-primary/95 backdrop-blur-sm text-ivory rounded-sm shadow-lg overflow-hidden">
        {links.map((link) => (
          <button
            key={link.page}
            onClick={() => { navigate(link.page); setOpen(false); }}
            className={`block w-full text-left text-xs tracking-widest uppercase px-4 py-2.5 hover:bg-gold/20 transition-colors border-b border-ivory/10 last:border-0 ${page === link.page ? 'text-gold' : 'text-ivory/80'}`}
          >
            {link.label}
          </button>
        ))}
      </div>}
      <button type="button" aria-expanded={open} aria-label={open ? 'Close quick navigation' : 'Open quick navigation'} onClick={() => setOpen(!open)} className="bg-primary text-ivory text-xs uppercase tracking-widest px-4 py-3 rounded-sm shadow-lg">{open ? 'Close' : 'Menu'}</button>
    </div>
  );
}
