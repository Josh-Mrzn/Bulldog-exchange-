import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ProductImage from '../../components/ProductImage';
import { useCart } from '../../context/CartContext';
import { createOrder, getSession } from '../../lib/api';
import { formatPrice } from '../../lib/products';

const inputClasses =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20';

const PAYMENT_METHODS = ['Cash on Delivery', 'GCash', 'Card'];

const CartPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const user = getSession()?.user;
  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleChange = (field) => (event) => setAddress((prev) => ({ ...prev, [field]: event.target.value }));

  const handleCheckout = async (event) => {
    event.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const { data } = await createOrder({
        items: items.map((item) => ({ product: item.productId, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data._id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#f8f9fa]">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Your Cart</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />

          {items.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">Your cart is empty.</p>
              <Button to="/products" variant="brand" className="mt-6 px-6 py-3">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <ProductImage image={item.image} alt={item.title} className="h-24 w-24 flex-shrink-0 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <Link to={`/products/${item.name}`} className="font-semibold text-gray-900 hover:text-blue-600">
                          {item.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-gray-300">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.title} quantity`}
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-semibold" aria-label="Quantity">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.title} quantity`}
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="w-28 text-right font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-xs font-semibold uppercase tracking-wide text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleCheckout} className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="ship-name" className="text-sm font-semibold text-slate-900">Full Name</label>
                  <input id="ship-name" required value={address.fullName} onChange={handleChange('fullName')} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="ship-phone" className="text-sm font-semibold text-slate-900">Phone</label>
                  <input
                    id="ship-phone"
                    required
                    pattern="09\d{9}"
                    title="11 digits starting with 09"
                    placeholder="09XXXXXXXXX"
                    value={address.phone}
                    onChange={handleChange('phone')}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="ship-street" className="text-sm font-semibold text-slate-900">Street</label>
                  <input id="ship-street" required value={address.street} onChange={handleChange('street')} className={inputClasses} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ship-city" className="text-sm font-semibold text-slate-900">City</label>
                    <input id="ship-city" required value={address.city} onChange={handleChange('city')} className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="ship-postal" className="text-sm font-semibold text-slate-900">Postal Code</label>
                    <input
                      id="ship-postal"
                      required
                      pattern="\d{4}"
                      title="4 digits"
                      value={address.postalCode}
                      onChange={handleChange('postalCode')}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ship-payment" className="text-sm font-semibold text-slate-900">Payment Method</label>
                  <select id="ship-payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClasses}>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <Button type="submit" variant="brand" className="w-full py-3 text-[11px] tracking-[0.2em]" disabled={placing}>
                  {placing ? 'Placing Order…' : 'Place Order'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
