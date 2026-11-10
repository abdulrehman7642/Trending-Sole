import { useState } from 'react';
import { orders } from '../../data/orders';
import { formatPrice } from '../../data/products';
import { Order } from '../../types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
};

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">Orders</h2>
          <p className="text-xs text-muted mt-0.5">{orders.length} total orders</p>
        </div>
        <button className="border border-border text-slate text-xs tracking-widest uppercase px-4 py-2.5 rounded-sm hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm whitespace-nowrap font-medium transition-colors ${
              statusFilter === s ? 'bg-primary text-ivory' : 'bg-card border border-border text-muted hover:border-primary hover:text-primary'
            }`}
          >
            <span className="capitalize">{s === 'all' ? 'All' : s}</span>
            {counts[s] > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${statusFilter === s ? 'bg-ivory/20 text-ivory' : 'bg-stone-100 text-muted'}`}>
                {counts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-sm p-4">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer…"
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-sm text-sm outline-none focus:border-primary bg-ivory font-sans"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-stone-50 border-b border-border">
              <tr>
                {['Order #', 'Customer', 'Date', 'Items', 'Status', 'Payment', 'Total', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold py-3 pr-4 first:pl-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 pl-4 pr-4">
                    <span className="text-xs font-semibold text-primary">{order.orderNumber}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-xs font-medium text-primary">{order.customer}</p>
                    <p className="text-[10px] text-muted">{order.city}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted">{order.date}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div>
                      <span className="text-xs text-muted">{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</span>
                      <span className={`block text-[9px] font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'refunded' ? 'text-amber-600' : 'text-muted'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-primary">{formatPrice(order.total)}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs border border-border px-2.5 py-1 rounded-sm text-slate hover:border-primary hover:text-primary transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted">No orders found.</div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-ivory rounded-sm max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-ivory border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-xl text-primary">{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wide ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
                <select className="text-xs border border-border rounded-sm px-3 py-1.5 bg-ivory outline-none font-sans">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
                <button className="bg-primary text-ivory text-xs px-3 py-1.5 rounded-sm hover:bg-slate transition-colors">Update</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Customer */}
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-semibold text-muted mb-3">Customer</h4>
                  <p className="text-sm font-semibold text-primary">{selectedOrder.customer}</p>
                  <p className="text-xs text-muted">{selectedOrder.email}</p>
                  <p className="text-xs text-muted">{selectedOrder.phone}</p>
                </div>
                {/* Shipping */}
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase font-semibold text-muted mb-3">Shipping Address</h4>
                  <p className="text-sm text-slate">{selectedOrder.address}</p>
                  <p className="text-xs text-muted">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-[10px] tracking-widest uppercase font-semibold text-muted mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-stone-50 rounded-sm px-3 py-2.5">
                      <div>
                        <p className="text-xs font-medium text-primary">{item.product}</p>
                        <p className="text-[10px] text-muted">Size {item.size} · {item.color} · Qty: {item.qty}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span><span>{selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-terracotta">
                    <span>Discount</span><span>−{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-primary text-base border-t border-border pt-2">
                  <span>Total</span><span className="font-serif">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
