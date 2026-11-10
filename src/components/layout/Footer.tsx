import BrandLogo from '../ui/BrandLogo';
import SubscribeForm from '../ui/SubscribeForm';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-primary text-ivory/80">
      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-4"><BrandLogo inverse /></div>
          <p className="text-sm leading-relaxed text-ivory/60 mb-6">
            Every Step, Refined. Premium footwear crafted for the modern South Asian wardrobe.
          </p>
          <div className="flex gap-4">
            {['instagram', 'facebook', 'tiktok'].map((s) => (
              <button key={s} className="w-8 h-8 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest">
                {s[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-ivory font-medium mb-5">Shop</h4>
          <ul className="space-y-3">
            {[
              { label: "Men's Collection", page: 'plp-men' as const },
              { label: "Women's Collection", page: 'plp-women' as const },
              { label: "Kids' Collection", page: 'plp-kids' as const },
              { label: 'New Arrivals', page: 'plp-new' as const },
              { label: 'Sale', page: 'plp-sale' as const },
            ].map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => navigate(link.page)}
                  className="text-sm hover:text-gold transition-colors text-ivory/60"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-ivory font-medium mb-5">Help</h4>
          <ul className="space-y-3">
            {['Contact Us', 'Size Guide', 'Return Policy', 'Shipping Policy', 'FAQ', 'Track Order'].map((item) => (
              <li key={item}>
                <button onClick={item === 'Track Order' ? () => navigate('track-order') : undefined} className="text-sm hover:text-gold transition-colors text-ivory/60">{item}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-ivory font-medium mb-5">Newsletter</h4>
          <p className="text-sm text-ivory/60 mb-4 leading-relaxed">
            Be first to know about new collections, exclusive offers, and style editorials.
          </p>
          <SubscribeForm compact />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10 max-w-screen-xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/40">
        <span>© 2024 Trending Sole. All rights reserved.</span>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
            <button key={t} className="hover:text-ivory/60 transition-colors">{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span>We accept:</span>
          <span className="border border-ivory/20 rounded px-2 py-0.5 text-[10px]">COD</span>
        </div>
      </div>
    </footer>
  );
}
