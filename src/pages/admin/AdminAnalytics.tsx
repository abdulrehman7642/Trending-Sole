import { revenueData, topProducts, orderStats } from '../../data/orders';
import { formatPrice } from '../../data/products';

const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

const categoryData = [
  { name: "Men's", revenue: 1240000, orders: 512, pct: 44 },
  { name: "Women's", revenue: 980000, orders: 428, pct: 35 },
  { name: "Kids'", revenue: 627500, orders: 344, pct: 21 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-primary">Analytics & Reports</h2>
        <p className="text-xs text-muted mt-0.5">Business performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Rs. ${(orderStats.totalRevenue / 1000000).toFixed(2)}M`, sub: `+${orderStats.revenueGrowth}% vs last period` },
          { label: 'Total Orders', value: orderStats.totalOrders, sub: `+${orderStats.ordersGrowth}% vs last period` },
          { label: 'Avg. Order Value', value: `Rs. ${Math.round(orderStats.totalRevenue / orderStats.totalOrders).toLocaleString()}`, sub: 'Per transaction' },
          { label: 'Return Rate', value: '2.4%', sub: 'Below industry avg.' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-sm p-5">
            <div className="font-serif text-2xl text-primary">{kpi.value}</div>
            <div className="text-xs text-muted mt-1">{kpi.label}</div>
            <div className="text-[10px] text-green-600 mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-primary">Monthly Revenue</h3>
          <div className="flex gap-2">
            {['6M', '12M', 'YTD'].map((p) => (
              <button key={p} className={`text-xs px-3 py-1.5 rounded-sm ${p === '6M' ? 'bg-primary text-ivory' : 'border border-border text-muted hover:border-primary'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-4 h-52 mb-4">
          {revenueData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[9px] text-muted">{(d.revenue / 1000).toFixed(0)}k</div>
              <div className="w-full relative" style={{ height: '160px' }}>
                <div
                  className="absolute bottom-0 w-full bg-primary/10 rounded-t-sm"
                  style={{ height: '100%' }}
                />
                <div
                  className="absolute bottom-0 w-full bg-primary hover:bg-gold transition-colors rounded-t-sm cursor-pointer"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-muted">{d.month}</div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border flex gap-8 text-sm">
          <div>
            <p className="text-muted text-xs">Total (6M)</p>
            <p className="font-serif text-xl text-primary">{formatPrice(revenueData.reduce((s, d) => s + d.revenue, 0))}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Total Orders (6M)</p>
            <p className="font-serif text-xl text-primary">{revenueData.reduce((s, d) => s + d.orders, 0)}</p>
          </div>
        </div>
      </div>

      {/* Category performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-serif text-xl text-primary mb-5">Category Performance</h3>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-primary">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{cat.orders} orders</span>
                    <span className="text-xs font-semibold text-primary">{formatPrice(cat.revenue)}</span>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${cat.pct}%` }} />
                </div>
                <div className="text-[10px] text-muted mt-1">{cat.pct}% of total revenue</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-serif text-xl text-primary mb-5">Top Performing Products</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="font-serif text-2xl text-muted/30 w-8 text-right flex-shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary truncate">{p.name}</p>
                  <p className="text-[10px] text-muted">{p.sold} units · {p.stock} in stock</p>
                </div>
                <span className="text-xs font-semibold text-primary flex-shrink-0">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-card border border-border rounded-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg text-primary">Export Reports</h3>
          <p className="text-xs text-muted mt-0.5">Download detailed analytics data in CSV or PDF format</p>
        </div>
        <div className="flex gap-3">
          {['Sales Report', 'Inventory Report', 'Customer Report'].map((r) => (
            <button key={r} className="text-xs border border-border text-slate px-3 py-2 rounded-sm hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
