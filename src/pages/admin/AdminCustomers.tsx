import { useState } from 'react';
import { orders } from '../../data/orders';
import { formatPrice } from '../../data/products';

const customers = [
  { id: '1', name: 'Ayesha Malik', email: 'ayesha.malik@gmail.com', phone: '+92 311 4567890', city: 'Islamabad', orders: 4, totalSpent: 58200, joined: '2023-03-15', status: 'active' },
  { id: '2', name: 'Hassan Raza', email: 'hassan.raza@outlook.com', phone: '+92 333 9876543', city: 'Lahore', orders: 7, totalSpent: 126800, joined: '2022-11-20', status: 'active' },
  { id: '3', name: 'Sana Javed', email: 'sana.javed@yahoo.com', phone: '+92 321 1234567', city: 'Karachi', orders: 2, totalSpent: 22400, joined: '2024-01-05', status: 'active' },
  { id: '4', name: 'Omar Farooq', email: 'omar.farooq@gmail.com', phone: '+92 345 6789012', city: 'Islamabad', orders: 1, totalSpent: 18750, joined: '2024-01-16', status: 'active' },
  { id: '5', name: 'Fatima Shah', email: 'fatima.shah@hotmail.com', phone: '+92 300 5678901', city: 'Karachi', orders: 5, totalSpent: 89300, joined: '2023-06-22', status: 'active' },
  { id: '6', name: 'Bilal Ahmed', email: 'bilal.ahmed@gmail.com', phone: '+92 322 3456789', city: 'Lahore', orders: 3, totalSpent: 34500, joined: '2023-09-10', status: 'inactive' },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customers.find((c) => c.id === selected);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-primary">Customers</h2>
        <p className="text-xs text-muted mt-0.5">{customers.length} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-5">
          <div className="font-serif text-3xl text-primary">{customers.length}</div>
          <div className="text-xs text-muted mt-1">Total Customers</div>
        </div>
        <div className="bg-card border border-border rounded-sm p-5">
          <div className="font-serif text-3xl text-green-600">{customers.filter((c) => c.status === 'active').length}</div>
          <div className="text-xs text-muted mt-1">Active Customers</div>
        </div>
        <div className="bg-card border border-border rounded-sm p-5">
          <div className="font-serif text-3xl text-primary">
            Rs.{(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-muted mt-1">Avg. Lifetime Value</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-sm text-sm outline-none focus:border-primary bg-ivory font-sans"
        />
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-stone-50 border-b border-border">
              <tr>
                {['Customer', 'Contact', 'City', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold py-3 pr-4 first:pl-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 pl-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-ivory text-xs font-bold flex-shrink-0">
                        {c.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-primary">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-xs text-muted">{c.email}</p>
                    <p className="text-[10px] text-muted">{c.phone}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted">{c.city}</td>
                  <td className="py-3 pr-4 text-xs font-semibold text-primary">{c.orders}</td>
                  <td className="py-3 pr-4 text-xs font-semibold text-primary">{formatPrice(c.totalSpent)}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{c.joined}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wide ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => setSelected(c.id)}
                      className="text-xs border border-border text-slate px-2.5 py-1 rounded-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-ivory rounded-sm max-w-lg w-full shadow-2xl">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-primary">Customer Profile</h3>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-primary">×</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-ivory text-xl font-bold">
                  {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-serif text-xl text-primary">{selectedCustomer.name}</h4>
                  <p className="text-xs text-muted">Customer since {selectedCustomer.joined}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[10px] uppercase tracking-widest text-muted mb-1">Email</p><p className="text-slate">{selectedCustomer.email}</p></div>
                <div><p className="text-[10px] uppercase tracking-widest text-muted mb-1">Phone</p><p className="text-slate">{selectedCustomer.phone}</p></div>
                <div><p className="text-[10px] uppercase tracking-widest text-muted mb-1">City</p><p className="text-slate">{selectedCustomer.city}</p></div>
                <div><p className="text-[10px] uppercase tracking-widest text-muted mb-1">Total Orders</p><p className="font-semibold text-primary">{selectedCustomer.orders}</p></div>
                <div><p className="text-[10px] uppercase tracking-widest text-muted mb-1">Total Spent</p><p className="font-serif text-xl text-primary">{formatPrice(selectedCustomer.totalSpent)}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
