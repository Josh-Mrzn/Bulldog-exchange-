import { Navigate, Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LandingPage from '../pages/LandingPages/LandingPage';
import { getSession } from '../lib/api';
import { CartProvider } from '../context/CartContext';

// Guests see the public landing page at "/"; every other storefront page requires a signed-in user.
const Layout = () => {
  const { pathname } = useLocation();
  if (!getSession()?.user) return pathname === '/' ? <LandingPage /> : <Navigate to="/auth/signin" replace />;

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
