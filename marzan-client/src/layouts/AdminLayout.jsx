import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { clearSession, displayName } from '../lib/api';
import useSessionUser from '../lib/useSessionUser';

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900',
  ].join(' ');

// A convenience redirect only: the API still re-checks the token and the Admin role on every request.
const AdminLayout = () => {
  const user = useSessionUser();
  if (!user) return <Navigate to="/auth/signin" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <NavLink to="/admin/dashboard" className="text-lg font-bold text-slate-900">
            BulldogEx Shop — Admin
          </NavLink>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
            <NavLink to="/admin/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClassName}>
              Orders
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClassName}>
              Products
            </NavLink>
            <NavLink to="/admin/profile" className={navLinkClassName} title="My Profile">
              <span className="inline-block max-w-[10rem] truncate align-bottom normal-case tracking-normal text-xs">
                {displayName(user) || 'Profile'}
              </span>
            </NavLink>
            <button
              type="button"
              onClick={() => {
                clearSession();
                window.location.assign('/auth/signin');
              }}
              className="rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:text-slate-900"
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
