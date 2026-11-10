import SubscribeForm from '../components/ui/SubscribeForm';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { formatPrice } from '../data/products';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

const heroSlides = [
  {
    title: 'The Autumn\nCollection',
    subtitle: 'Refined silhouettes for the season ahead',
    cta: 'Explore Collection',
    ctaPage: 'plp-new' as const,
    bg: 'https://images.unsplash.com/photo-1612902377668-68ec50954ad9?w=1600&h=900&fit=crop&auto=format',
    align: 'left',
  },
  {
    title: 'Women\'s\nEditorial',
    subtitle: 'Elevated footwear for every occasion',
    cta: 'Shop Women',
    ctaPage: 'plp-women' as const,
    bg: 'https://images.unsplash.com/photo-1675237292372-5068aa262f43?w=1600&h=900&fit=crop&auto=format',
    align: 'right',
  },
  {
    title: 'Men\'s\nPremium',
    subtitle: 'From board meetings to weekend escapes',
    cta: 'Shop Men',
    ctaPage: 'plp-men' as const,
    bg: 'https://images.unsplash.com/photo-1603191659812-ee978eeeef76?w=1600&h=900&fit=crop&auto=format',
    align: 'left',
  },
];

export default function HomePage() {
  const { navigate, products, catalogLoading, catalogError } = useApp();
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setHeroIdx(index => (index + 1) % heroSlides.length), 3000);
    return () => window.clearTimeout(timer);
  }, [heroIdx]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const featured = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const saleProducts = products.filter((p) => p.salePrice !== undefined).slice(0, 4);

  return (
    <div className="min-h-screen">
      {catalogLoading && <p role="status" className="p-4 text-center text-muted">Loading products…</p>}
      {catalogError && <p role="alert" className="p-4 text-center text-terracotta">{catalogError}</p>}
      {!catalogLoading && !catalogError && products.length === 0 && <p className="p-4 text-center text-muted">Our product catalog is currently empty.</p>}
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden bg-primary" aria-label="Featured collections" aria-roledescription="carousel">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== heroIdx}
            inert={i !== heroIdx}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${i === heroIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img src={slide.bg} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />
            <div
              className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-16 lg:px-24 ${
                slide.align === 'right' ? 'items-end text-right' : 'items-start text-left'
              }`}
            >
              <div className="max-w-xl">
                <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-4">Every Step, Refined.</p>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ivory leading-tight mb-6 whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base text-ivory/70 mb-8 leading-relaxed">{slide.subtitle}</p>
                <button
                  onClick={() => navigate(slide.ctaPage)}
                  className="bg-gold text-primary text-xs tracking-widest uppercase px-8 py-4 font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-3"
                >
                  {slide.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slide controls */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {heroSlides.map((slide, i) => (
            <button key={i} type="button" onClick={() => setHeroIdx(i)}
              aria-label={`Show ${slide.title.replace('\n', ' ')} slide`} aria-pressed={i === heroIdx}
              className="flex items-center justify-center min-w-8 h-10 px-1.5">
              <span className={`block h-1.5 rounded-full transition-all motion-reduce:transition-none ${i === heroIdx ? 'w-8 bg-gold' : 'w-2 bg-ivory/60'}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Men', sub: `${products.filter(p => p.category === 'men').length} styles`, page: 'plp-men' as const, img: 'https://images.unsplash.com/photo-1563434649554-58f91d22ec2c?w=600&h=700&fit=crop&auto=format' },
            { label: 'Women', sub: `${products.filter(p => p.category === 'women').length} styles`, page: 'plp-women' as const, img: 'https://images.unsplash.com/photo-1596702874230-b5706dfb5bc7?w=600&h=700&fit=crop&auto=format' },
            { label: 'Kids', sub: `${products.filter(p => p.category === 'kids').length} styles`, page: 'plp-kids' as const, img: 'https://images.unsplash.com/photo-1707013537977-90e0a6cfa484?w=600&h=700&fit=crop&auto=format' },
          ].map((cat) => (
            <button
              key={cat.page}
              onClick={() => navigate(cat.page)}
              className="group relative overflow-hidden bg-stone-100 rounded-sm aspect-[4/5]"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <p className="text-xs tracking-widest uppercase text-gold mb-1 font-medium">{cat.sub}</p>
                <h3 className="font-serif text-3xl text-ivory">{cat.label}</h3>
                <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-ivory/70 mt-2 group-hover:text-gold transition-colors">
                  Shop Now
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8 pb-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-2">Fresh in</p>
            <h2 className="font-serif text-4xl text-primary">New Arrivals</h2>
          </div>
          <button
            onClick={() => navigate('plp-new')}
            className="text-xs tracking-widest uppercase text-slate hover:text-gold transition-colors flex items-center gap-2"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="relative overflow-hidden bg-primary py-20 px-6 lg:px-10">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-4">Autumn / Winter 2024</p>
            <h2 className="font-serif text-5xl lg:text-6xl text-ivory leading-tight mb-6">
              Crafted for<br />Every Occasion
            </h2>
            <p className="text-ivory/60 text-sm leading-relaxed mb-8 max-w-md">
              From the boardroom to weekend escapes, Trending Sole's curated collections move with you — elegant, purposeful, and distinctly refined.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('plp-men')} className="bg-gold text-primary text-xs tracking-widest uppercase px-6 py-3.5 font-semibold hover:bg-gold-light transition-colors">
                Shop Men
              </button>
              <button onClick={() => navigate('plp-women')} className="border border-ivory/30 text-ivory text-xs tracking-widest uppercase px-6 py-3.5 font-semibold hover:border-gold hover:text-gold transition-colors">
                Shop Women
              </button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm">
            {featured.slice(0, 4).map((p, i) => (
              <button
                key={p.id}
                onClick={() => navigate('pdp', { id: p.id })}
                className={`overflow-hidden bg-stone-800 ${i === 0 ? 'row-span-2 col-span-1' : ''}`}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className={`w-full object-cover hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-64' : `h-28 object-bottom ${i >= 2 ? 'md:object-center' : ''}`}`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-2">Most Loved</p>
            <h2 className="font-serif text-4xl text-primary">Bestsellers</h2>
          </div>
          <button
            onClick={() => navigate('plp-men')}
            className="text-xs tracking-widest uppercase text-slate hover:text-gold transition-colors flex items-center gap-2"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Sale section */}
      {saleProducts.length > 0 && (
        <section className="bg-stone-100 py-16">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-terracotta font-medium mb-2">Limited Time</p>
                <h2 className="font-serif text-4xl text-primary">Season Sale</h2>
              </div>
              <button
                onClick={() => navigate('plp-sale')}
                className="text-xs tracking-widest uppercase text-terracotta hover:text-terracotta/80 transition-colors flex items-center gap-2 font-medium"
              >
                Shop Sale
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features strip */}
      <section className="border-y border-border py-10">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'Across the UAE' },
            { icon: '↩', title: '30-Day Returns', sub: 'Hassle-free exchanges' },
            { icon: '🔒', title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
            { icon: '✦', title: 'Premium Quality', sub: 'Curated with care' },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">{f.icon}</span>
              <h4 className="text-xs tracking-widest uppercase font-semibold text-primary">{f.title}</h4>
              <p className="text-xs text-muted">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-16 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium mb-3">Stay in the Loop</p>
          <h2 className="font-serif text-4xl text-ivory mb-4">The Trending Sole Edit</h2>
          <p className="text-ivory/60 text-sm mb-8 leading-relaxed">
            New collections, exclusive previews, and style inspiration delivered to your inbox.
          </p>
          <SubscribeForm />
          <p className="text-ivory/30 text-xs mt-4">Subscribe for news and offers.</p>
        </div>
      </section>

      {/* Quick view modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-ivory rounded-sm max-w-2xl w-full shadow-2xl max-h-[90dvh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate hover:text-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-64 aspect-square bg-stone-100 flex-shrink-0">
                <img src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted">{quickViewProduct.subCategory}</p>
                  <h3 className="font-serif text-2xl text-primary mt-1">{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    {quickViewProduct.salePrice ? (
                      <>
                        <span className="font-semibold text-terracotta">{formatPrice(quickViewProduct.salePrice)}</span>
                        <span className="text-sm text-muted line-through">{formatPrice(quickViewProduct.price)}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-primary">{formatPrice(quickViewProduct.price)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate mt-3 leading-relaxed">{quickViewProduct.description.substring(0, 120)}…</p>
                </div>
                <button
                  onClick={() => { navigate('pdp', { id: quickViewProduct.id }); setQuickViewProduct(null); }}
                  className="bg-primary text-ivory text-xs tracking-widest uppercase py-3.5 font-semibold hover:bg-slate transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
