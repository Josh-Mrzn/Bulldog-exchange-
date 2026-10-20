import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from '../../components/ProductImage';
import { displayName, getCategories, getOrders, getProducts, getUsers } from '../../lib/api';
import useSessionUser from '../../lib/useSessionUser';
import { formatPrice, orderStatusClasses, productImage } from '../../lib/products';

const linkButtonClasses =
  'rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition';

const StatCard = ({ label, value, detail }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
  </div>
);

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const admin = useSessionUser();

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getUsers(), getOrders()])
      .then(([products, categories, users, orders]) =>
        setData({ products: products.data, categories: categories.data, users: users.data, orders: orders.data }),
      )
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading dashboard…</p>;

  const customers = data.users.filter((user) => user.role === 'Customer').length;
  const activeOrders = data.orders.filter((order) => order.status !== 'Cancelled');
  const revenue = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = data.orders.filter((order) => order.status === 'Pending').length;
  const recentOrders = data.orders.slice(0, 5);
  const productsWithoutImage = data.products.filter((product) => !productImage(product.image));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Dashboard</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Welcome back, {displayName(admin)}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/orders" className={`${linkButtonClasses} bg-slate-100 text-slate-900 hover:bg-slate-200`}>
            Manage Orders
          </Link>
          <Link to="/admin/products" className={`${linkButtonClasses} bg-slate-100 text-slate-900 hover:bg-slate-200`}>
            Manage Products
          </Link>
          <Link to="/admin/products/new" className={`${linkButtonClasses} bg-slate-900 text-white hover:bg-slate-800`}>
            New Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={data.products.length} detail={`${productsWithoutImage.length} without a photo`} />
        <StatCard label="Categories" value={data.categories.length} />
        <StatCard label="Users" value={data.users.length} detail={`${customers} customers · ${data.users.length - customers} admins`} />
        <StatCard label="Orders" value={data.orders.length} detail={`${pendingOrders} pending · ${formatPrice(revenue)} total sales`} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700">
            {pendingOrders > 0 ? `Confirm ${pendingOrders} pending →` : 'Manage orders →'}
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3 text-slate-900">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Deleted user'}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClasses[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-5 py-4 text-lg font-semibold text-slate-900">Products Without a Photo</h2>
        {productsWithoutImage.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">Every product has a photo.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {productsWithoutImage.map((product) => (
              <li key={product._id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-3">
                  <ProductImage image={product.image} alt={product.title} className="h-10 w-10 rounded-lg" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.title}</p>
                    <p className="text-xs text-slate-500">{product.category?.name}</p>
                  </div>
                </div>
                <Link
                  to={`/admin/products/${product.name}/edit`}
                  className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
                >
                  Upload Photo
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
