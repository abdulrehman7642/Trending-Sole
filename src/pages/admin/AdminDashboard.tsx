import { useState } from 'react';
import { orderStats, revenueData, topProducts, orders } from '../../data/orders';
import { formatPrice } from '../../data/products';
import { useApp } from '../../context/AppContext';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
};

export default function AdminDashboard() {
  const { navigate } = useApp();
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  const statCards = [
    { label: 'Total Revenue', value: `Rs. ${(orderStats.totalRevenue / 1000000).toFixed(2)}M`, growth: orderStats.revenueGrowth, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-gold/10 text-gold' },
    { label: 'Total Orders', value: orderStats.totalOrders.toLocaleString(), growth: orderStats.ordersGrowth, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Customers', value: orderStats.totalCustomers.toLocaleString(), growth: orderStats.customersGrowth, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Products', value: orderStats.totalProducts.toLocaleString(), growth: 5.2, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-green-50 text-green-600' },
  ];

  const alertCards = [
    { label: 'Pending Orders', value: orderStats.pendingOrders, color: 'text-amber-600', page: 'admin-orders' as const },
    { label: 'Low Stock Alerts', value: orderStats.lowStockAlerts, color: 'text-terracotta', page: 'admin-inventory' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-primary">Good Morning, Admin</h2>
          <p className="text-sm text-muted mt-1">Here's what's happening with Trending Sole today.</p>
        </div>
        <div className="flex gap-3">
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
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {alertCards.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.page)}
            className="bg-card border border-border rounded-sm p-4 flex items-center justify-between hover:border-primary transition-colors text-left"
          >
            <span className="text-xs text-muted">{a.label}</span>
            <span className={`text-2xl font-bold font-serif ${a.color}`}>{a.value}</span>
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-sm ${stat.color} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-xs font-semibold ${stat.growth > 0 ? 'text-green-600' : 'text-terracotta'}`}>
                {stat.growth > 0 ? '+' : ''}{stat.growth}%
              </span>
            </div>
            <div className="font-serif text-2xl text-primary">{stat.value}</div>
            <div className="text-xs text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-primary">Revenue Overview</h3>
            <select className="text-xs border border-border rounded-sm px-3 py-1.5 bg-ivory text-primary outline-none font-sans">
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[9px] text-muted font-semibold">Rs.{(d.revenue / 1000).toFixed(0)}k</div>
                <div className="w-full flex flex-col justify-end" style={{ height: '140px' }}>
                  <div
                    className="w-full bg-primary hover:bg-gold transition-colors rounded-t-sm cursor-pointer"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}
                    title={`${d.month}: ${formatPrice(d.revenue)}`}
                  />
                </div>
                <div className="text-[10px] text-muted">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-serif text-xl text-primary mb-5">Top Sellers</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-xs font-medium text-primary leading-tight">{p.name}</p>
                    <p className="text-[10px] text-muted">{p.sold} sold</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">Rs.{(p.revenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl text-primary">Recent Orders</h3>
          <button
            onClick={() => navigate('admin-orders')}
            className="text-xs tracking-widest uppercase text-gold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                {['Order #', 'Customer', 'Date', 'Status', 'Payment', 'Total'].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-muted font-semibold pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-stone-50 transition-colors">
                  <td className="py-3 pr-4 text-xs font-medium text-primary">{order.orderNumber}</td>
                  <td className="py-3 pr-4 text-xs text-slate">{order.customer}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{order.date}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted capitalize">{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</td>
                  <td className="py-3 text-xs font-semibold text-primary">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Add Product', page: 'admin-add-product' as const, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
          { label: 'Manage Orders', page: 'admin-orders' as const, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'Create Promo', page: 'admin-promotions' as const, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
          { label: 'View Analytics', page: 'admin-analytics' as const, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.page)}
            className="bg-card border border-border rounded-sm p-4 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-sm bg-stone-100 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 text-slate group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
              </svg>
            </div>
            <span className="text-xs font-medium text-primary">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
