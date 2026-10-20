import { NavLink } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import { clearSession, displayName } from '../lib/api';
import useSessionUser from '../lib/useSessionUser';
import { useCart } from '../context/CartContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:text-slate-900',
  ].join(' ');

const NavBar = () => {
  const user = useSessionUser();
  const { count } = useCart();

  const logOut = () => {
    clearSession();
    window.location.assign('/auth/signin');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="BulldogEx" className="h-9 w-9 rounded-full border border-slate-300 bg-white object-contain" />
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-slate-900">BulldogEx Shop</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Account navigation">
          {user?.role === 'Admin' && (
            <NavLink to="/admin/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/orders" className={navLinkClassName}>
            My Orders
          </NavLink>
          <NavLink to="/profile" className={navLinkClassName} title="My Profile">
            <span className="inline-block max-w-[10rem] truncate align-bottom normal-case tracking-normal text-xs">
                {displayName(user) || 'Profile'}
              </span>
          </NavLink>
          <NavLink to="/cart" className={navLinkClassName}>
            Cart
            {count > 0 && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] tracking-normal text-white">{count}</span>
            )}
          </NavLink>
          <button
            type="button"
            onClick={logOut}
            title={user ? `Signed in as ${user.email}` : undefined}
            className="rounded-lg px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 transition hover:text-slate-900"
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
