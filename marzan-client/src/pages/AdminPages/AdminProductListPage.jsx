import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../lib/api';
import ProductImage from '../../components/ProductImage';

const AdminProductListPage = () => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
        >
          New Product
        </Link>
      </div>

      {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!products && !error && <p className="mt-6 text-sm text-slate-500">Loading…</p>}

      {products && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3">
                    <ProductImage image={product.image} alt={product.title} className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{product.title}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">₱{product.price}</td>
                  <td className="px-4 py-3 text-slate-600">{product.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${product.name}/edit`} className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductListPage;
