import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import ProductImage from '../../components/ProductImage';
import logo from '../../assets/img/nubdexchange_logo.png';
import { getProducts, getSession } from '../../lib/api';
import useStoreCounts from '../../lib/useStoreCounts';

const AboutPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const counts = useStoreCounts();
  const isAdmin = getSession()?.user?.role === 'Admin';

  useEffect(() => {
    getProducts({ limit: 4 })
      .then(({ data }) => setFeaturedProducts(data))
      .catch(() => setFeaturedProducts([]));
  }, []);

  return (
    <div className="flex w-full flex-col gap-0 bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2332] via-[#1e3a5f] to-[#1a2332] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTI0IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTQ4IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTM2IDMwYzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Logo Container */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <div className="flex min-h-72 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-8">
                    <img 
                      src={logo} 
                      alt="BulldogEx" 
                      className="h-40 w-40 rounded-full border-2 border-white/20 bg-white/90 object-contain shadow-2xl transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                  About Store
                </p>
              </div>
              
              <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                A campus shop focused on
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> useful products </span>
                and simple ordering.
              </h1>
              
              <p className="mt-6 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
                BulldogEx Shop keeps the low-fidelity layout system while presenting clear
                product categories, quick actions, and straightforward store information.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button to="/" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 px-6 py-3">
                  ← Back Home
                </Button>
                <Button to="/products" className="border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3">
                  Open Products
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
              Store Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Quick store blocks</h2>
            <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{counts.products}</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">
                Items
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-purple-50 p-3 group-hover:bg-purple-100 transition-colors">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{counts.categories}</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">
                Categories
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-green-50 p-3 group-hover:bg-green-100 transition-colors">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">03</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">
                Pickup Slots
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-orange-50 p-3 group-hover:bg-orange-100 transition-colors">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{counts.orders}</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">
                {isAdmin ? 'Orders' : 'My Orders'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* Left Column - Features */}
            <div>
              <div className="mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                  Store Flow
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">Stacked shopping wireframe</h2>
                <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
              </div>

              <div className="space-y-6">
                <article className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-xl bg-blue-50 p-3 group-hover:bg-blue-100 transition-colors">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Curated Catalog</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Products are grouped by daily need so shoppers can scan faster and find what they need without hassle.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-xl bg-green-50 p-3 group-hover:bg-green-100 transition-colors">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Simple Checkout</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Product pages keep price, stock, and action buttons easy to find for a seamless shopping experience.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-xl bg-purple-50 p-3 group-hover:bg-purple-100 transition-colors">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pickup Ready</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Store information stays direct for students who need quick order updates and smooth pickup process.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Right Column - Product Grid */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                    Category Grid
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">Featured Products</h3>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {featuredProducts.length} items
                </span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm"
                  >
                    <ProductImage
                      image={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs font-medium text-white truncate">{product.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button to="/products" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all">
                View All Products →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;