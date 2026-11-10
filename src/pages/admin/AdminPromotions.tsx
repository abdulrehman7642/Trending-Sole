import { useState } from 'react';

const mockPromos = [
  { id: '1', name: 'New Year Sale', type: 'percentage', value: 20, scope: 'sitewide', code: 'NY2024', start: '2024-01-01', end: '2024-01-07', status: 'expired', uses: 234 },
  { id: '2', name: 'Winter Clearance', type: 'percentage', value: 30, scope: 'category', code: 'WINTER30', start: '2024-01-10', end: '2024-02-28', status: 'active', uses: 89 },
  { id: '3', name: 'Welcome Discount', type: 'percentage', value: 10, scope: 'sitewide', code: 'TRENDINGSOLE10', start: '2024-01-01', end: '2024-12-31', status: 'active', uses: 412 },
  { id: '4', name: 'Flash Friday', type: 'fixed', value: 500, scope: 'sitewide', code: 'FLASH500', start: '2024-01-19', end: '2024-01-19', status: 'scheduled', uses: 0 },
];

export default function AdminPromotions() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    name: '',
    type: 'percentage',
    value: '',
    code: '',
    scope: 'sitewide',
    category: '',
    start: '',
    end: '',
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-stone-100 text-stone-500',
    scheduled: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Promotions</h2>
          <p className="text-xs text-muted mt-0.5">Manage discounts, coupons, and sale campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-ivory text-xs tracking-widest uppercase px-5 py-2.5 font-semibold hover:bg-slate transition-colors flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Promotion
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Promotions', value: mockPromos.filter((p) => p.status === 'active').length, color: 'text-green-600' },
          { label: 'Scheduled', value: mockPromos.filter((p) => p.status === 'scheduled').length, color: 'text-blue-600' },
          { label: 'Total Coupon Uses', value: mockPromos.reduce((s, p) => s + p.uses, 0), color: 'text-primary' },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-sm p-5">
            <div className={`font-serif text-3xl ${card.color}`}>{card.value}</div>
            <div className="text-xs text-muted mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Promos table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-stone-50 border-b border-border">
              <tr>
                {['Campaign Name', 'Code', 'Discount', 'Scope', 'Period', 'Uses', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold py-3 pr-4 first:pl-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPromos.map((promo) => (
                <tr key={promo.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 pl-4 pr-4 text-xs font-semibold text-primary">{promo.name}</td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs bg-stone-100 text-primary px-2.5 py-1 rounded-sm">{promo.code}</span>
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-primary">
                    {promo.type === 'percentage' ? `${promo.value}%` : `Rs. ${promo.value}`}
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted capitalize">{promo.scope}</td>
                  <td className="py-3 pr-4 text-xs text-muted">
                    {promo.start} → {promo.end}
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-primary">{promo.uses}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wide ${statusColors[promo.status]}`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 flex gap-2">
                    <button className="text-xs border border-border text-slate px-2.5 py-1 rounded-sm hover:border-primary hover:text-primary transition-colors">Edit</button>
                    <button className="text-xs text-terracotta hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-ivory rounded-sm max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-ivory border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-primary">Create Promotion</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Campaign Name</label>
                <input
                  value={promoForm.name}
                  onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                  placeholder="e.g. Spring Sale 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Discount Type</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">
                    {promoForm.type === 'percentage' ? 'Percentage (%)' : 'Amount (Rs.)'}
                  </label>
                  <input
                    type="number"
                    value={promoForm.value}
                    onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                    placeholder={promoForm.type === 'percentage' ? '10' : '500'}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Coupon Code</label>
                <input
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-mono"
                  placeholder="SPRING24"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Apply To</label>
                <select
                  value={promoForm.scope}
                  onChange={(e) => setPromoForm({ ...promoForm, scope: e.target.value })}
                  className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                >
                  <option value="sitewide">All Products (Sitewide)</option>
                  <option value="category">Specific Category</option>
                  <option value="product">Specific Products</option>
                </select>
              </div>
              {promoForm.scope === 'category' && (
                <div>
                  <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Category</label>
                  <select className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={promoForm.start}
                    onChange={(e) => setPromoForm({ ...promoForm, start: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase font-semibold text-primary block mb-2">End Date</label>
                  <input
                    type="date"
                    value={promoForm.end}
                    onChange={(e) => setPromoForm({ ...promoForm, end: e.target.value })}
                    className="w-full border border-border rounded-sm px-4 py-2.5 text-sm outline-none focus:border-primary bg-ivory font-sans"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-border text-slate text-xs tracking-widest uppercase py-3 rounded-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-primary text-ivory text-xs tracking-widest uppercase py-3 rounded-sm hover:bg-slate transition-colors"
                >
                  Create Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
