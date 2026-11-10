import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import { formatPrice } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export default function AdminProducts() {
  const { products, navigate, refreshCatalog, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-primary">Products</h2>
          <p className="text-xs text-muted mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={() => navigate('admin-add-product')}
          className="bg-primary text-ivory text-xs tracking-widest uppercase px-5 py-2.5 font-semibold hover:bg-slate transition-colors flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-sm text-sm outline-none focus:border-primary bg-ivory font-sans"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-border rounded-sm px-3 py-2.5 text-sm bg-ivory outline-none focus:border-primary font-sans"
        >
          <option value="all">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-stone-50 border-b border-border">
              <tr>
                <th className="w-10 p-4">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-primary"
                  />
                </th>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="accent-primary"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-stone-100 flex-shrink-0 overflow-hidden rounded-sm">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.isNew && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">New</span>}
                          {product.isFeatured && <span className="text-[9px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-sm">Featured</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted font-mono">{product.sku}</td>
                  <td className="py-3 pr-4 text-xs text-muted capitalize">{product.category}</td>
                  <td className="py-3 pr-4">
                    <div>
                      {product.salePrice ? (
                        <>
                          <span className="text-xs font-semibold text-terracotta block">{formatPrice(product.salePrice)}</span>
                          <span className="text-[10px] text-muted line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-primary">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold ${product.stock > 20 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-terracotta'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wide ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('admin-add-product', { id: product.id })}
                        className="text-xs text-slate hover:text-primary transition-colors border border-border px-2.5 py-1 rounded-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="text-xs text-terracotta hover:text-terracotta/80 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-card rounded-sm p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif text-xl text-primary mb-2">Delete Product?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete <strong className="text-primary">{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-border text-slate text-xs tracking-widest uppercase py-2.5 rounded-sm hover:border-primary hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => { const { data, error } = await supabase.from('products').delete().eq('id', deleteConfirm.id).select('id'); if (error || !data?.length) { showToast(error?.message || 'Product could not be deleted.', 'error'); return; } setDeleteConfirm(null); await refreshCatalog(); showToast('Product deleted.'); }}
                className="flex-1 bg-terracotta text-white text-xs tracking-widest uppercase py-2.5 rounded-sm hover:bg-terracotta/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
