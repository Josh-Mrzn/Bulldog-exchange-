import Button from './Button';
import ProductImage from './ProductImage';
import { formatPrice } from '../lib/products';

const ProductCard = ({ product, index }) => {
  const description = product.content?.[0] ?? '';

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex aspect-4/3 items-center justify-center rounded-lg bg-slate-100">
        <ProductImage image={product.image} alt={product.title} className="h-full w-full rounded-lg object-cover" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {product.category?.name} {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 text-base font-bold text-slate-900">{formatPrice(product.price)}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description.length > 120 ? `${description.substring(0, 120)}...` : description}
      </p>
      <Button to={`/products/${product.name}`} className="mt-4">View Product</Button>
    </article>
  );
};

export default ProductCard;
