import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { getOrders, getSession } from '../../lib/api';
import { formatPrice, orderStatusClasses } from '../../lib/products';

const STATUS_NOTES = {
  Pending: 'Waiting for the store to confirm your order. You can still cancel it.',
  Processing: 'Confirmed by the store and being prepared.',
  Shipped: 'Your order is on the way.',
  Delivered: 'Delivered. Thank you for shopping!',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  // Filtered to the signed-in user, so an Admin also sees only their own orders here.
  useEffect(() => {
    getOrders({ user: getSession()?.user?._id })
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex w-full flex-col bg-[#f8f9fa]">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Account</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />

          {error && <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {!orders && !error && <p className="mt-8 text-sm text-gray-500">Loading orders…</p>}

          {orders?.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">You have not placed any orders yet.</p>
              <Button to="/products" variant="brand" className="mt-6 px-6 py-3">
                Start Shopping
              </Button>
            </div>
          )}

          <ul className="mt-8 space-y-4">
            {orders?.map((order) => (
              <li key={order._id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClasses[order.status] ?? ''}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {order.status === 'Cancelled'
                    ? order.cancelledBy === 'Customer'
                      ? 'You cancelled this order.'
                      : 'This order was cancelled by the store.'
                    : STATUS_NOTES[order.status]}
                </p>
                <ul className="mt-4 divide-y divide-gray-100 text-sm">
                  {order.items.map((item) => (
                    <li key={item.product} className="flex justify-between py-2">
                      <span className="text-gray-700">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 text-sm">
                  <span className="text-gray-500">
                    {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Not yet paid'}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
                  >
                    {order.status === 'Delivered' ? 'View & Rate' : 'Track Order'}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default OrdersPage;
