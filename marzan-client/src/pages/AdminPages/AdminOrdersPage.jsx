import { useEffect, useState } from 'react';
import { getOrders, updateOrder } from '../../lib/api';
import { formatPrice, orderStatusClasses } from '../../lib/products';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Mirrors STATUS_FLOW in marzan-server's orderController; the server enforces it.
const NEXT_STEP = {
  Pending: { status: 'Processing', label: 'Confirm Order' },
  Processing: { status: 'Shipped', label: 'Mark as Shipped' },
  Shipped: { status: 'Delivered', label: 'Mark as Delivered' },
};
const CANCELLABLE = ['Pending', 'Processing'];

const buttonClasses = 'rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition disabled:opacity-60';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.message));
  }, []);

  const applyUpdate = async (order, changes) => {
    setError('');
    setSavingId(order._id);
    try {
      const { data } = await updateOrder(order._id, changes);
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const cancelOrder = (order) => {
    if (window.confirm(`Cancel order #${order._id.slice(-6).toUpperCase()}?`)) applyUpdate(order, { status: 'Cancelled' });
  };

  if (!orders && !error) return <p className="text-sm text-slate-500">Loading orders…</p>;

  const visibleOrders = (orders ?? []).filter((order) => !filter || order.status === filter);
  const countFor = (status) => (orders ?? []).filter((order) => order.status === status).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Orders</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Manage Orders</h1>
        <p className="mt-1 text-sm text-slate-600">Confirm new orders and move them along until they are delivered.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter orders by status">
        {['', ...STATUSES].map((status) => (
          <button
            key={status || 'all'}
            type="button"
            role="tab"
            aria-selected={filter === status}
            onClick={() => setFilter(status)}
            className={`${buttonClasses} ${filter === status ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900'}`}
          >
            {status || 'All'} ({status ? countFor(status) : orders?.length ?? 0})
          </button>
        ))}
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {visibleOrders.length === 0 && <p className="text-sm text-slate-500">No orders here.</p>}

      <ul className="space-y-4">
        {visibleOrders.map((order) => {
          const next = NEXT_STEP[order.status];
          const saving = savingId === order._id;
          const address = order.shippingAddress;

          return (
            <li key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-slate-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Deleted user'}
                    {order.user && <span className="ml-2 text-xs font-normal text-slate-500">{order.user.email}</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClasses[order.status] ?? ''}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              {order.status === 'Cancelled' && order.cancelledBy && (
                <p className="mt-2 text-xs font-semibold text-red-700">
                  Cancelled by the {order.cancelledBy === 'Customer' ? 'customer' : 'store'}
                </p>
              )}

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <ul className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <li key={item.product} className="flex justify-between py-1.5">
                      <span className="text-slate-700">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
                  <p className="font-semibold text-slate-900">{address?.fullName}</p>
                  <p>{address?.phone}</p>
                  <p>
                    {address?.street}, {address?.city} {address?.postalCode}
                  </p>
                  <p className="mt-1 text-xs">Payment: {order.paymentMethod}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-lg font-bold text-slate-900">{formatPrice(order.totalAmount)}</p>
                <div className="flex flex-wrap gap-2">
                  {order.status !== 'Cancelled' && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyUpdate(order, { isPaid: !order.isPaid })}
                      className={`${buttonClasses} bg-slate-100 text-slate-900 hover:bg-slate-200`}
                    >
                      {order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </button>
                  )}
                  {CANCELLABLE.includes(order.status) && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => cancelOrder(order)}
                      className={`${buttonClasses} bg-red-50 text-red-700 hover:bg-red-100`}
                    >
                      Cancel Order
                    </button>
                  )}
                  {next && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => applyUpdate(order, { status: next.status })}
                      className={`${buttonClasses} bg-slate-900 text-white hover:bg-slate-800`}
                    >
                      {saving ? 'Saving…' : next.label}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminOrdersPage;
