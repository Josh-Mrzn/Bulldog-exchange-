import { Navigate, Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { getSession } from '../lib/api';
import { CartProvider } from '../context/CartContext';

// Every storefront page requires a signed-in user; anyone else starts at the log in page.
const Layout = () => {
  if (!getSession()?.user) return <Navigate to="/auth/signin" replace />;

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
