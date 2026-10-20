import { productImage } from '../lib/products';

// Shows the product's photo, or a neutral placeholder for a product that has none yet.
const ProductImage = ({ image, alt, className = '' }) => {
  const src = productImage(image);
  if (src) return <img src={src} alt={alt} className={className} />;

  return (
    <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`} role="img" aria-label={alt}>
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
};

export default ProductImage;
