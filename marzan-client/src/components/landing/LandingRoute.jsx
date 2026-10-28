import { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import { getProducts } from '../../lib/api';
import { productImage } from '../../lib/products';

// Feeds the landing page real products from the API; it keeps its sample items if this fails.
const LandingRoute = () => {
  const [products, setProducts] = useState();

  useEffect(() => {
    getProducts({ limit: 12 })
      .then(({ data }) => {
        const withPhotos = data
          .filter((product) => productImage(product.image))
          .slice(0, 6)
          .map((product) => ({
            _id: product._id,
            slug: product.name,
            name: product.title,
            category: product.category?.name ?? '',
            image: productImage(product.image),
          }));
        if (withPhotos.length >= 4) setProducts(withPhotos);
      })
      .catch(() => {});
  }, []);

  return <LandingPage products={products} signInPath="/auth/signin" signUpPath="/auth/signup" shopPath="/products" />;
};

export default LandingRoute;
