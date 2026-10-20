import { useEffect, useState } from 'react';
import { getCategories, getOrders, getProducts } from './api';

const pad = (n) => String(n).padStart(2, '0');

// Live counts for the store overview blocks. Orders are the signed-in user's own
// (the API only returns every order to an Admin).
export default function useStoreCounts() {
  const [counts, setCounts] = useState({ products: '--', categories: '--', orders: '--' });

  useEffect(() => {
    Promise.all([getProducts({ limit: 1 }), getCategories(), getOrders()])
      .then(([products, categories, orders]) =>
        setCounts({
          products: pad(products.total),
          categories: pad(categories.data.length),
          orders: pad(orders.data.length),
        }),
      )
      .catch(() => {});
  }, []);

  return counts;
}
