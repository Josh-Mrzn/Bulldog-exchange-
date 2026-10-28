import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { getSession } from '../lib/api';
import { CartProvider } from '../context/CartContext';

// Loaded on demand so the animation and 3D libraries are not part of every page's download.
const LandingRoute = lazy(() => import('../components/landing/LandingRoute'));

// Guests see the public landing page at "/"; every other storefront page requires a signed-in user.
const Layout = () => {
  const { pathname } = useLocation();
  if (!getSession()?.user) {
    if (pathname !== '/') return <Navigate to="/auth/signin" replace />;
    return (
      <Suspense fallback={<div className="min-h-screen bg-nu-cream" />}>
        <LandingRoute />
      </Suspense>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-zinc-100 text-zinc-900">
        <NavBar />
        <main className="pb-16 pt-32 md:pt-20">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </CartProvider>
  );
};

export default Layout;
