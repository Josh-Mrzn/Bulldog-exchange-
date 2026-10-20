import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getOrders, getProducts } from '../../lib/api';
import { formatPrice, orderStatusClasses } from '../../lib/products';

// Validated categorical slots 1-4 (dataviz reference palette); everything past the
// top four categories folds into a neutral "Other" so a pie never exceeds five slices.
const CATEGORY_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];
const OTHER_COLOR = '#898781';
const SERIES_COLOR = '#2a78d6';
const INK_MUTED = '#898781';
const GRID = '#e1e0d9';
const AXIS = '#c3c2b7';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const RANGES = [
  { key: '7', label: 'Last 7 days', days: 7 },
  { key: '30', label: 'Last 30 days', days: 30 },
  { key: '90', label: 'Last 90 days', days: 90 },
  { key: 'all', label: 'All time', days: null },
];

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const compactPeso = (value) =>
  value >= 1000 ? `₱${(value / 1000).toLocaleString('en-PH', { maximumFractionDigits: 1 })}k` : `₱${value}`;
const percent = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : '0%');
const isActive = (order) => order.status !== 'Cancelled';

// One time bucket per day, or per month when the range is longer than about three months.
function buildTimeline(orders, rangeStart, today) {
  const byMonth = (today - rangeStart) / 86400000 > 92;
  const buckets = new Map();
  for (let d = new Date(rangeStart); d <= today; d.setDate(d.getDate() + 1)) {
    const key = byMonth ? monthKey(d) : dayKey(d);
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: d.toLocaleDateString('en-PH', byMonth ? { month: 'short', year: 'numeric' } : { month: 'short', day: 'numeric' }),
        sales: 0,
        orders: 0,
      });
    }
  }
  for (const order of orders) {
    const created = new Date(order.createdAt);
    const bucket = buckets.get(byMonth ? monthKey(created) : dayKey(created));
    if (bucket) {
      bucket.sales += order.totalAmount;
      bucket.orders += 1;
    }
  }
  return [...buckets.values()];
}

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <section className={`min-w-0 rounded-2xl border border-slate-200 bg-[#fcfcfb] p-5 shadow-sm ${className}`}>
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const StatTile = ({ label, value, detail }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
  </div>
);

const Empty = ({ children = 'No sales in this period yet.' }) => (
  <p className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-500">{children}</p>
);

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgba(11,11,11,0.10)',
  boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
  fontSize: 13,
};
// Tooltip text stays in ink colors; the colored mark beside it carries the identity.
const tooltipText = { color: '#0b0b0b' };
const tooltipLabel = { color: '#52514e', fontWeight: 600, marginBottom: 2 };

const AdminAnalyticsPage = () => {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [range, setRange] = useState('30');
  const [historyStatus, setHistoryStatus] = useState('');
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()])
      .then(([ordersRes, productsRes]) => {
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Category colors are assigned from all-time sales, so a category keeps its color
  // when the date range changes (color follows the category, not its rank in the period).
  const categoryOf = useMemo(
    () => new Map(products.map((p) => [p._id, p.category?.name ?? 'Uncategorized'])),
    [products],
  );
  const categoryColor = useMemo(() => {
    const totals = new Map();
    for (const order of (orders ?? []).filter(isActive)) {
      for (const item of order.items) {
        const name = categoryOf.get(item.product) ?? 'Uncategorized';
        totals.set(name, (totals.get(name) ?? 0) + item.price * item.quantity);
      }
    }
    const top = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, CATEGORY_COLORS.length);
    return new Map(top.map(([name], i) => [name, CATEGORY_COLORS[i]]));
  }, [orders, categoryOf]);

  const stats = useMemo(() => {
    if (!orders) return null;
    const today = startOfDay(new Date());
    const days = RANGES.find((r) => r.key === range).days;
    const earliest = orders.length ? startOfDay(new Date(Math.min(...orders.map((o) => new Date(o.createdAt))))) : today;
    const rangeStart = days ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1)) : earliest;

    const inRange = orders.filter((o) => new Date(o.createdAt) >= rangeStart);
    const active = inRange.filter(isActive);
    const sales = active.reduce((sum, o) => sum + o.totalAmount, 0);
    const completed = active.filter((o) => o.status === 'Delivered' && o.isPaid).reduce((sum, o) => sum + o.totalAmount, 0);
    const itemsSold = active.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    const categoryTotals = new Map();
    const productTotals = new Map();
    for (const order of active) {
      for (const item of order.items) {
        const amount = item.price * item.quantity;
        const name = categoryOf.get(item.product) ?? 'Uncategorized';
        const slice = categoryColor.has(name) ? name : 'Other';
        categoryTotals.set(slice, (categoryTotals.get(slice) ?? 0) + amount);

        const current = productTotals.get(item.product) ?? { id: item.product, title: item.title, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += amount;
        productTotals.set(item.product, current);
      }
    }
    const categories = [...categoryTotals.entries()]
      .map(([name, value]) => ({ name, value, color: name === 'Other' ? OTHER_COLOR : categoryColor.get(name) }))
      .sort((a, b) => (a.name === 'Other') - (b.name === 'Other') || b.value - a.value);

    const bestSellers = [...productTotals.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5);

    return {
      inRange,
      active,
      sales,
      completed,
      itemsSold,
      cancelled: inRange.length - active.length,
      timeline: buildTimeline(active, rangeStart, today),
      categories,
      bestSellers,
      statusCounts: STATUSES.map((status) => ({ status, count: inRange.filter((o) => o.status === status).length })),
    };
  }, [orders, range, categoryOf, categoryColor]);

  if (error) return <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!stats) return <p className="text-sm text-slate-500">Loading analytics…</p>;

  const history = stats.inRange.filter((o) => !historyStatus || o.status === historyStatus);
  const visibleHistory = showAllHistory ? history : history.slice(0, 10);
  const rangeLabel = RANGES.find((r) => r.key === range).label.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Analytics</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Sales Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">Sales exclude cancelled orders.</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1" role="radiogroup" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={range === r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                range === r.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Sales" value={formatPrice(stats.sales)} detail={`${formatPrice(stats.completed)} delivered & paid`} />
        <StatTile label="Orders" value={stats.active.length} detail={`${stats.cancelled} cancelled`} />
        <StatTile
          label="Average Order"
          value={formatPrice(stats.active.length ? Math.round(stats.sales / stats.active.length) : 0)}
        />
        <StatTile label="Items Sold" value={stats.itemsSold} />
      </div>

      <ChartCard title="Sales over time" subtitle={`Daily sales, ${rangeLabel}`}>
        {stats.active.length === 0 ? (
          <Empty />
        ) : (
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: INK_MUTED }}
                  axisLine={{ stroke: AXIS }}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tickFormatter={compactPeso}
                  tick={{ fontSize: 12, fill: INK_MUTED }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipLabel}
                  cursor={{ stroke: AXIS, strokeWidth: 1 }}
                  formatter={(value, name, entry) => [`${formatPrice(value)} · ${entry.payload.orders} order${entry.payload.orders === 1 ? '' : 's'}`, 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={SERIES_COLOR}
                  strokeWidth={2}
                  fill="url(#salesFill)"
                  dot={false}
                  activeDot={{ r: 5, stroke: '#fcfcfb', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sales by category" subtitle="Top four categories; the rest are grouped as Other">
          {stats.categories.length === 0 ? (
            <Empty />
          ) : (
            <div className="grid items-center gap-4 sm:grid-cols-[12rem_1fr]">
              <div className="h-48 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="95%"
                      paddingAngle={stats.categories.length > 1 ? 2 : 0}
                      stroke="#fcfcfb"
                      strokeWidth={2}
                      isAnimationActive={false}
                    >
                      {stats.categories.map((slice) => (
                        <Cell key={slice.name} fill={slice.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipLabel} formatter={(value, name) => [`${formatPrice(value)} (${percent(value, stats.sales)})`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2.5" aria-label="Sales by category">
                {stats.categories.map((slice) => (
                  <li key={slice.name} className="flex items-center gap-3 text-sm">
                    <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: slice.color }} aria-hidden="true" />
                    <span className="flex-1 text-slate-700">{slice.name}</span>
                    <span className="font-semibold tabular-nums text-slate-900">{formatPrice(slice.value)}</span>
                    <span className="w-10 text-right tabular-nums text-slate-500">{percent(slice.value, stats.sales)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Orders by status" subtitle={`All orders placed, ${rangeLabel}`}>
          {stats.inRange.length === 0 ? (
            <Empty>No orders in this period yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {stats.statusCounts.map(({ status, count }) => (
                <li key={status} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3 text-sm">
                  <span className={`justify-self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderStatusClasses[status]}`}>{status}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: percent(count, stats.inRange.length), backgroundColor: SERIES_COLOR }}
                    />
                  </div>
                  <span className="text-right tabular-nums text-slate-700">
                    {count} <span className="text-slate-400">· {percent(count, stats.inRange.length)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Best sellers" subtitle="Top five products by units sold">
        {stats.bestSellers.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="min-w-0" style={{ height: stats.bestSellers.length * 44 + 24 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.bestSellers} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={8}>
                  <CartesianGrid horizontal={false} stroke={GRID} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: INK_MUTED }} axisLine={{ stroke: AXIS }} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={170}
                    tick={{ fontSize: 12, fill: '#52514e' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipLabel}
                    cursor={{ fill: 'rgba(42,120,214,0.06)' }}
                    formatter={(value, name, entry) => [`${value} sold · ${formatPrice(entry.payload.revenue)}`, 'Units']}
                  />
                  <Bar dataKey="quantity" fill={SERIES_COLOR} radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
                    <LabelList dataKey="quantity" position="right" style={{ fontSize: 12, fill: '#52514e' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ol className="divide-y divide-slate-100 text-sm" aria-label="Best sellers">
              {stats.bestSellers.map((product, index) => (
                <li key={product.id} className="flex items-center gap-3 py-2.5">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium text-slate-900">{product.title}</span>
                  <span className="tabular-nums text-slate-600">{product.quantity} sold</span>
                  <span className="w-24 text-right font-semibold tabular-nums text-slate-900">{formatPrice(product.revenue)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Sales history" subtitle={`Every order placed, ${rangeLabel}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label htmlFor="history-status" className="text-sm text-slate-600">
            Status
          </label>
          <select
            id="history-status"
            value={historyStatus}
            onChange={(e) => {
              setHistoryStatus(e.target.value);
              setShowAllHistory(false);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
          >
            <option value="">All</option>
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <span className="text-sm text-slate-500">{history.length} order{history.length === 1 ? '' : 's'}</span>
        </div>

        {history.length === 0 ? (
          <Empty>No orders match.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleHistory.map((order) => (
                  <tr key={order._id}>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                      {new Date(order.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-slate-900">
                      {order.user ? order.user.username || `${order.user.firstName} ${order.user.lastName}` : 'Deleted user'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.items.map((item) => `${item.title} ×${item.quantity}`).join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Unpaid'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderStatusClasses[order.status] ?? ''}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {history.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllHistory((v) => !v)}
            className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
          >
            {showAllHistory ? 'Show fewer' : `Show all ${history.length} orders`}
          </button>
        )}
      </ChartCard>
    </div>
  );
};

export default AdminAnalyticsPage;
