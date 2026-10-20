import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';
import { createReview, getOrder, getReviews, getSession, updateOrder } from '../../lib/api';
import { formatPrice, orderStatusClasses } from '../../lib/products';

const STEPS = [
  { status: 'Pending', label: 'Order Placed' },
  { status: 'Processing', label: 'Confirmed' },
  { status: 'Shipped', label: 'Shipped' },
  { status: 'Delivered', label: 'Delivered' },
];
const FINAL_STATUSES = ['Delivered', 'Cancelled'];
const REFRESH_MS = 15000;

const ReviewForm = ({ item, onReviewed }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) return setError('Choose from 1 to 5 stars.');
    setError('');
    setSaving(true);
    try {
      const { data } = await createReview({ product: item.product, rating, comment: comment.trim() || undefined });
      onReviewed(data);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3" aria-label={`Rate ${item.title}`}>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        rows={2}
        maxLength={500}
        placeholder="Share what you think about this product (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
      />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="brand" disabled={saving}>
        {saving ? 'Submitting…' : 'Submit Rating'}
      </Button>
    </form>
  );
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const me = getSession()?.user?._id;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [myReviews, setMyReviews] = useState({});
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setCancelError('');
    setCancelling(true);
    try {
      const { data } = await updateOrder(id, { status: 'Cancelled' });
      setOrder(data);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  // Re-checks the order every few seconds until it is Delivered or Cancelled, so a status
  // change made by the store shows up without reloading the page.
  useEffect(() => {
    let timer;
    let stopped = false;
    const load = () =>
      getOrder(id)
        .then(({ data }) => {
          if (stopped) return;
          setOrder(data);
          if (!FINAL_STATUSES.includes(data.status)) timer = setTimeout(load, REFRESH_MS);
        })
        .catch((err) => !stopped && setError(err.message));
    load();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [id]);

  const isDelivered = order?.status === 'Delivered';

  useEffect(() => {
    if (!isDelivered) return;
    Promise.all(order.items.map((item) => getReviews({ product: item.product })))
      .then((results) => {
        const mine = {};
        results.flatMap((res) => res.data).forEach((review) => {
          if (review.user?._id === me) mine[review.product?._id] = review;
        });
        setMyReviews(mine);
      })
      .catch(() => {});
  }, [isDelivered, order?.items, me]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        <Button to="/orders" className="mt-6">Back to My Orders</Button>
      </div>
    );
  }
  if (!order) return <p className="px-4 py-16 text-center text-sm text-gray-500">Loading order…</p>;

  const cancelled = order.status === 'Cancelled';
  const currentStep = STEPS.findIndex((step) => step.status === order.status);

  return (
    <div className="flex w-full flex-col bg-[#f8f9fa]">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link to="/orders" className="inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
            ← Back to My Orders
          </Link>

          {state?.justPlaced && (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Order placed! The store will confirm it soon. You can follow it on this page.
            </p>
          )}

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Track Order</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Placed {new Date(order.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })} · Last
                updated {new Date(order.updatedAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClasses[order.status] ?? ''}`}>
              {order.status}
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {cancelled ? (
              <p className="text-sm font-semibold text-red-700">
                {order.cancelledBy === 'Customer' ? 'You cancelled this order.' : 'This order was cancelled by the store.'}
              </p>
            ) : (
              <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
                {STEPS.map((step, index) => {
                  const done = index <= currentStep;
                  return (
                    <li key={step.status} className="flex flex-col items-center text-center" aria-current={index === currentStep ? 'step' : undefined}>
                      <div className="flex w-full items-center">
                        <div className={`h-1 flex-1 ${index === 0 ? 'invisible' : done ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                            done ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {done ? '✓' : index + 1}
                        </span>
                        <div className={`h-1 flex-1 ${index === STEPS.length - 1 ? 'invisible' : index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      </div>
                      <span className={`mt-2 text-xs font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            )}
            {!FINAL_STATUSES.includes(order.status) && (
              <p className="mt-4 text-center text-xs text-gray-500">This page updates automatically.</p>
            )}
            {order.status === 'Pending' && (
              <div className="mt-4 flex flex-col items-center gap-2 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Changed your mind? You can cancel until the store confirms your order.</p>
                <button
                  type="button"
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="rounded-lg bg-red-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                >
                  {cancelling ? 'Cancelling…' : 'Cancel Order'}
                </button>
                {cancelError && <p role="alert" className="text-sm text-red-600">{cancelError}</p>}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              {isDelivered && <p className="mt-1 text-sm text-gray-600">Your order has arrived. Rate the products you received.</p>}
              <ul className="mt-4 divide-y divide-gray-100">
                {order.items.map((item) => {
                  const review = myReviews[item.product];
                  return (
                    <li key={item.product} className="py-4">
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-gray-800">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      {isDelivered &&
                        (review ? (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                            <StarRating value={review.rating} />
                            <span>Thanks for your rating!</span>
                          </div>
                        ) : (
                          <ReviewForm item={item} onReviewed={(r) => setMyReviews((prev) => ({ ...prev, [item.product]: r }))} />
                        ))}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-4">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Delivery</h2>
              <p className="mt-3 font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>
                {order.shippingAddress?.street}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
              </p>
              <p className="mt-4">
                {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Not yet paid'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTrackingPage;
