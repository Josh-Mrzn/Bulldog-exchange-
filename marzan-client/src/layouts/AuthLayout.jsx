import { NavLink, Navigate, Outlet } from 'react-router-dom';
import nuLogo from '../assets/img/NU LOGO.png';
import { getSession } from '../lib/api';

const authLinks = [
  {
    to: '/auth/signin',
    label: 'Sign In',
  },
  {
    to: '/auth/signup',
    label: 'Sign Up',
  },
];

const authLinkClassName = ({ isActive }) =>
  [
    'rounded-lg border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2',
    isActive
      ? 'border-nu-ink bg-nu-ink text-white shadow-lg shadow-nu-ink/25'
      : 'border-zinc-300 bg-white text-zinc-600 hover:border-nu-navy hover:text-nu-navy hover:shadow-md',
  ].join(' ');

const AuthLayout = () => {
  const user = getSession()?.user;
  if (user) return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/'} replace />;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] text-zinc-900">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label="Go to BulldogEx Shop home page"
          >
            <div className="rounded-lg bg-gray-100 p-2">
              <img src={nuLogo} alt="NU" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-900">BulldogEx Shop</span>
          </NavLink>

          <nav aria-label="Authentication navigation" className="flex items-center gap-2">
            {authLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={authLinkClassName} end>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-0 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:gap-8">
        {/* Left Panel - Branding */}
        <aside className="hidden lg:flex items-center rounded-2xl bg-gradient-to-br from-nu-ink via-nu-ink to-nu-navy p-8 lg:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTI0IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTQ4IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTM2IDMwYzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-4 mb-12">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-3">
                <img src={nuLogo} alt="National University logo" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-nu-gold">
                  National University
                </p>
                <p className="mt-1 text-xl font-bold leading-tight text-white">
                  BulldogEx Shop
                </p>
              </div>
            </div>

            <h2 className="max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Easy campus shopping,{' '}
              <span className="italic text-nu-gold">
                clean and direct.
              </span>
            </h2>
            
            <p className="mt-6 max-w-md text-base leading-7 text-gray-300 sm:text-lg">
              Sign in to keep orders, saved items, and pickup details ready when class gets busy.
            </p>

            {/* Feature List */}
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 rounded-lg bg-blue-500/10 p-2 border border-blue-500/20">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Quick order tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 rounded-lg bg-green-500/10 p-2 border border-green-500/20">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Save favorite items</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 rounded-lg bg-purple-500/10 p-2 border border-purple-500/20">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Campus pickup ready</span>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-gray-400">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <span>Student Marketplace</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div>
          </div>
        </aside>

        {/* Right Panel - Form */}
        <main className="flex items-center rounded-2xl bg-white p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-100">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;