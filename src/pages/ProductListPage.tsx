import { useState, useMemo } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { formatPrice } from '../data/products';
import { useApp } from '../context/AppContext';
import { Category, SubCategory } from '../types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

const subCategories: SubCategory[] = ['sneakers', 'formal', 'casual', 'sandals', 'boots', 'sports'];

const pageTitles: Record<string, { title: string; sub: string; filter?: string }> = {
  'plp-men': { title: "Men's Collection", sub: 'Premium footwear for the modern man', filter: 'men' },
  'plp-women': { title: "Women's Collection", sub: 'Refined styles for every occasion', filter: 'women' },
  'plp-kids': { title: "Kids' Collection", sub: 'Durable, playful, and comfy', filter: 'kids' },
  'plp-new': { title: 'New Arrivals', sub: 'The freshest styles just landed' },
  'plp-sale': { title: 'Season Sale', sub: 'Up to 40% off select styles' },
};

export default function ProductListPage() {
  const { page, navigate, products, catalogLoading, catalogError } = useApp();
  const pageInfo = pageTitles[page] || pageTitles['plp-men'];

  const [sort, setSort] = useState<SortOption>('featured');
  const [filterCategory, setFilterCategory] = useState<SubCategory | ''>('');
  const [filterColor, setFilterColor] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState<'all' | 'in-stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (pageInfo.filter) {
      list = list.filter((p) => p.category === pageInfo.filter);
    } else if (page === 'plp-new') {
      list = list.filter((p) => p.isNew);
    } else if (page === 'plp-sale') {
      list = list.filter((p) => p.salePrice !== undefined);
    }

    if (filterCategory) list = list.filter((p) => p.subCategory === filterCategory);
    if (filterColor) list = list.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes(filterColor.toLowerCase())));
    if (availability === 'in-stock') list = list.filter((p) => p.stock > 0);

    list = list.filter((p) => {
      const price = p.salePrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case 'price-asc': return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      case 'price-desc': return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      case 'newest': return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      default: return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [page, sort, filterCategory, filterColor, priceRange, availability, products]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const allColors = Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name)))).slice(0, 8);

  return (
    <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-10">
      {catalogLoading && <p>Loading products?</p>}
      {catalogError && <p role="alert">{catalogError}</p>}
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-8">
        <button onClick={() => navigate('home')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <span className="text-primary">{pageInfo.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-4xl text-primary">{pageInfo.title}</h1>
          <p className="text-sm text-muted mt-1">{pageInfo.sub}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted">{filtered.length} products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-xs border border-border rounded-sm px-3 py-2 bg-ivory text-primary outline-none focus:border-gold cursor-pointer font-sans"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs border border-border rounded-sm px-3 py-2 hover:border-primary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Filter sidebar */}
        {showFilters && (
          <aside className="w-full md:w-56 md:flex-shrink-0 space-y-6 border border-border p-4 md:border-0 md:p-0">
            {/* Category */}
            <div>
              <h3 className="text-xs tracking-widest uppercase font-semibold text-primary mb-4">Category</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sub"
                    checked={filterCategory === ''}
                    onChange={() => setFilterCategory('')}
                    className="accent-primary"
                  />
                  <span className="text-sm text-slate">All</span>
                </label>
                {subCategories.map((sub) => (
                  <label key={sub} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sub"
                      checked={filterCategory === sub}
                      onChange={() => setFilterCategory(sub)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-slate capitalize">{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-xs tracking-widest uppercase font-semibold text-primary mb-4">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={25000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xs tracking-widest uppercase font-semibold text-primary mb-4">Color</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFilterColor(filterColor === color ? '' : color)}
                    className={`text-xs px-2.5 py-1 border rounded-sm transition-colors ${
                      filterColor === color
                        ? 'border-primary bg-primary text-ivory'
                        : 'border-border text-slate hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xs tracking-widest uppercase font-semibold text-primary mb-4">Availability</h3>
              <div className="flex flex-col gap-2">
                {(['all', 'in-stock'] as const).map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={availability === a}
                      onChange={() => setAvailability(a)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-slate capitalize">{a === 'all' ? 'All' : 'In Stock Only'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setFilterCategory('');
                setFilterColor('');
                setPriceRange([0, 25000]);
                setAvailability('all');
              }}
              className="text-xs tracking-widest uppercase text-terracotta hover:underline"
            >
              Clear All Filters
            </button>
          </aside>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-xl text-primary">No products found</p>
                <p className="text-sm text-muted mt-1">Try adjusting your filters.</p>
              </div>
              <button
                onClick={() => { setFilterCategory(''); setFilterColor(''); setPriceRange([0, 25000]); }}
                className="text-xs tracking-widest uppercase text-primary border border-primary px-5 py-2.5 hover:bg-primary hover:text-ivory transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-3 sm:gap-5 ${showFilters ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
                  >
                    ‹
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 border rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary text-ivory border-primary'
                          : 'border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
