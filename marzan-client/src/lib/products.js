// Products seeded before Activity 6 store a local asset filename (e.g. "totebag.png") in
// `image`; uploaded ones store a Cloudinary URL. Both resolve to something an <img> can load.
const localImages = import.meta.glob('../assets/img/*', { eager: true, import: 'default' });

export const productImage = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return localImages[`../assets/img/${image}`] ?? null;
};

export const formatPrice = (price) => `PHP ${Number(price).toLocaleString('en-PH')}`;

export const orderStatusClasses = {
  Pending: 'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50 text-blue-700',
  Shipped: 'bg-indigo-50 text-indigo-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};
