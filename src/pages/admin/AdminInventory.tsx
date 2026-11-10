import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { formatPrice } from '../../data/products';

export default function AdminInventory() {
  const { products } = useApp();
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStock =
      stockFilter === 'all' ? true :
      stockFilter === 'low' ? p.stock > 0 && p.stock <= 20 :
      p.stock === 0;
    return matchSearch && matchStock;
  });

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 20).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-primary">Inventory</h2>
        <p className="text-xs text-muted mt-0.5">Track and manage product stock levels</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Stock Units', value: totalStock, color: 'text-primary', bg: 'bg-card' },
          { label: 'Low Stock Items', value: lowStock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: outOfStock, color: 'text-terracotta', bg: 'bg-red-50' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} border border-border rounded-sm p-5`}>
            <div className={`font-serif text-3xl ${card.color}`}>{card.value}</div>
            <div className="text-xs text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-sm text-sm outline-none focus:border-primary bg-ivory font-sans"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStockFilter(f)}
              className={`text-xs px-3 py-2 rounded-sm font-medium transition-colors capitalize ${stockFilter === f ? 'bg-primary text-ivory' : 'bg-card border border-border text-muted hover:border-primary hover:text-primary'}`}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-stone-50 border-b border-border">
              <tr>
                {['Product', 'SKU', 'Category', 'Sizes', 'Price', 'Stock', 'Status', 'Adjust'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold py-3 pr-4 first:pl-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 pl-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-stone-100 flex-shrink-0 overflow-hidden rounded-sm">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium text-primary">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted font-mono">{product.sku}</td>
                  <td className="py-3 pr-4 text-xs text-muted capitalize">{product.category}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.slice(0, 3).map((s) => (
                        <span key={s} className="text-[9px] bg-stone-100 text-slate px-1.5 py-0.5 rounded-sm">{s}</span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-[9px] text-muted">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-primary font-semibold">{formatPrice(product.salePrice ?? product.price)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-sm font-bold font-serif ${product.stock > 20 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-terracotta'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {product.stock === 0 ? (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-sm font-semibold">Out of Stock</span>
                    ) : product.stock <= 20 ? (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-sm font-semibold">Low Stock</span>
                    ) : (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-sm font-semibold">In Stock</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        defaultValue={product.stock}
                        className="w-16 border border-border rounded-sm px-2 py-1 text-xs outline-none focus:border-primary bg-ivory font-sans text-center"
                      />
                      <button className="text-[10px] bg-primary text-ivory px-2 py-1 rounded-sm hover:bg-slate transition-colors">Save</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
