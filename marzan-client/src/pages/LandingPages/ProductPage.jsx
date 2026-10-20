import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import ProductImage from '../../components/ProductImage.jsx';
import StarRating from '../../components/StarRating.jsx';
import { getProduct, getProducts, getReviews } from '../../lib/api';
import { formatPrice, productImage } from '../../lib/products';
import { useCart } from '../../context/CartContext';

const STOCK_STYLES = {
  'In stock': 'bg-green-50 text-green-700 ring-green-600/20',
  'Low stock': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Preorder: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Out of stock': 'bg-red-50 text-red-700 ring-red-600/20',
};

const PERKS = [
  { title: 'Free campus pickup', text: 'Claim at the BulldogEx counter', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Easy returns', text: 'Within 30 days of pickup', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Student discount', text: 'Ask at the counter with your ID', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
];

// Keyed by the product name, so opening a related product starts from a fresh state.
function ProductPage() {
  const { name } = useParams();
  return <ProductDetails key={name} name={name} />;
}

function ProductDetails({ name }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    getProduct(name)
      .then(({ data }) => {
        setProduct(data);
        setStatus('ready');
        getReviews({ product: data._id })
          .then((res) => setReviews(res.data))
          .catch(() => setReviews([]));
        return getProducts({ category: data.category?.name ?? '' });
      })
      .then((res) => res && setRelated(res.data.filter((p) => p.name !== name).slice(0, 4)))
      .catch(() => setStatus('missing'));
  }, [name]);

  useEffect(() => {
    if (!zoomed) return;
    const close = (e) => e.key === 'Escape' && setZoomed(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [zoomed]);

  if (status === 'loading') {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8" aria-busy="true">
        <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-24 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <section className="px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 inline-flex rounded-full bg-red-50 p-4">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Product Not Found</h1>
          <p className="mt-3 text-slate-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button to="/products" variant="brand" className="mt-8 px-6 py-3">
            ← Back to Products
          </Button>
        </div>
      </section>
    );
  }

  const canBuy = product.stock !== 'Out of stock';
  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));
  const imageSrc = productImage(product.image);
  const [lead, ...moreParagraphs] = product.content ?? [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  return (
    <div className="w-full bg-white">
      {/* Product */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-slate-900">Products</Link>
          {product.category && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/products?category=${encodeURIComponent(product.category.name)}`} className="hover:text-slate-900">
                {product.category.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-900">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="aspect-square p-10">
                <ProductImage
                  image={product.image}
                  alt={product.title}
                  className="h-full w-full rounded-2xl object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {imageSrc && (
                <button
                  type="button"
                  onClick={() => setZoomed(true)}
                  aria-label="View larger image"
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:bg-white hover:text-slate-900"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              )}
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STOCK_STYLES[product.stock] ?? ''}`}>
                {product.stock}
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">{product.category?.name}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{product.title}</h1>

            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
              <StarRating value={averageRating} />
              {reviews.length > 0
                ? `${averageRating.toFixed(1)} · ${reviews.length} review${reviews.length > 1 ? 's' : ''}`
                : 'No reviews yet'}
            </a>

            <p className="mt-6 text-4xl font-bold text-slate-900">{formatPrice(product.price)}</p>

            {lead && <p className="mt-6 text-lg leading-8 text-slate-700">{lead}</p>}
            {moreParagraphs.length > 0 && (
              <ul className="mt-4 space-y-2">
                {moreParagraphs.map((paragraph, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {paragraph}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white" role="group" aria-label="Quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-lg text-slate-600 transition hover:text-slate-900 disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    aria-label="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-12 border-x border-slate-200 py-3 text-center font-semibold text-slate-900 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3 text-lg text-slate-600 transition hover:text-slate-900"
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="brand"
                  onClick={handleAddToCart}
                  disabled={!canBuy}
                  className="flex-1 py-4 text-[11px] tracking-[0.2em] shadow-lg shadow-blue-600/25"
                >
                  {canBuy ? `Add to Cart · ${formatPrice(product.price * quantity)}` : 'Out of Stock'}
                </Button>
              </div>

              {added && (
                <p role="status" className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                  <span>Added to your cart.</span>
                  <Link to="/cart" className="font-semibold underline underline-offset-2">
                    View cart
                  </Link>
                </p>
              )}
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {PERKS.map((perk) => (
                <li key={perk.title} className="rounded-2xl border border-slate-200 p-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={perk.icon} />
                  </svg>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{perk.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{perk.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="scroll-mt-24 border-t border-slate-100 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Ratings</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Customer Reviews</h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[20rem_1fr]">
            <div className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className={`text-5xl font-bold ${reviews.length ? 'text-slate-900' : 'text-slate-300'}`}>{averageRating.toFixed(1)}</p>
              <div className="mt-2">
                <StarRating value={averageRating} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {reviews.length ? `Based on ${reviews.length} review${reviews.length > 1 ? 's' : ''}` : 'No reviews yet'}
              </p>
              <ul className="mt-6 space-y-2">
                {ratingCounts.map(({ star, count }) => (
                  <li key={star} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-3">{star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="w-5 text-right text-slate-400">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {reviews.length === 0 ? (
              <div className="flex items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                No reviews yet. Customers can rate this product once their order is delivered.
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => {
                  const author = review.user
                    ? review.user.username || `${review.user.firstName} ${review.user.lastName.charAt(0)}.`
                    : 'Customer';
                  return (
                    <li key={review._id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {author.charAt(0).toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{author}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                          </p>
                        </div>
                        <StarRating value={review.rating} />
                      </div>
                      {review.comment && <p className="mt-4 text-sm leading-6 text-slate-700">{review.comment}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">You May Also Like</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Related Products</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>

          {related.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">No other products in this category yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct.name}`}
                  className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square border-b border-slate-100 bg-white p-6">
                    <ProductImage
                      image={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="h-full w-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-blue-600">{relatedProduct.category?.name}</p>
                    <h3 className="mt-1 font-semibold text-slate-900">{relatedProduct.title}</h3>
                    <p className="mt-2 font-bold text-slate-900">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.title} image`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm"
        >
          <img src={imageSrc} alt={product.title} className="max-h-full max-w-full rounded-2xl bg-white object-contain p-4 shadow-2xl" />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
