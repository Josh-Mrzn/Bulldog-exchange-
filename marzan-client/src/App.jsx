import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

// HomePage Structure
import Layout from './layouts/Layout';
import ProductPage from './pages/LandingPages/ProductPage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';
import CartPage from './pages/ShopPages/CartPage';
import OrdersPage from './pages/ShopPages/OrdersPage';
import OrderTrackingPage from './pages/ShopPages/OrderTrackingPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages Structure
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/AdminPages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminPages/AdminOrdersPage';
import AdminProductListPage from './pages/AdminPages/AdminProductListPage';
import AdminProductFormPage from './pages/AdminPages/AdminProductFormPage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:name',
        element: <ProductPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'orders/:id',
        element: <OrderTrackingPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "auth/",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      }
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'products',
        element: <AdminProductListPage />,
      },
      {
        path: 'products/new',
        element: <AdminProductFormPage />,
      },
      {
        path: 'products/:name/edit',
        element: <AdminProductFormPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
