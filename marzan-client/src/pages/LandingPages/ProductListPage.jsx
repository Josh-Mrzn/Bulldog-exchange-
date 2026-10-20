import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import ProductList from '../../components/ProductList.jsx';
import { getCategories, getProducts } from '../../lib/api';

const SORT_OPTIONS = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Newest', value: '-createdAt' },
];

const ProductListPage = () => {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [sort, setSort] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // `ignore` drops a slower, outdated response when the filter or sort changes mid-request.
  useEffect(() => {
    let ignore = false;
    const params = {};
    if (category) params.category = category;
    if (sort) params.sort = sort;
    getProducts(params)
      .then(({ data }) => {
        if (ignore) return;
        setProducts(data);
        setError('');
      })
      .catch((err) => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, [category, sort]);

  const productCount = products?.length ?? 0;
  const scrollToCatalog = () => document.getElementById('catalog-filters')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex w-full flex-col gap-0 bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2332] via-[#1e3a5f] to-[#1a2332] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTI0IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTQ4IDI0YzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6TTM2IDMwYzAtMS4xMDgtLjg5Mi0yLTItMnMtMiAuODkyLTIgMiAuODkyIDIgMiAyIDItLjg5MiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Logo and Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Products
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {productCount} Items
              </span>
            </div>
            
            {/* NU Logo */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-400">Powered by</p>
                <p className="text-sm font-semibold text-white">National University</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-2">
                <img 
                  src="https://static.wixstatic.com/media/2179b6_6c859da3978c4f17b27e723b90bc9f31~mv2.png/v1/fill/w_167,h_188,al_c,usm_0.66_1.00_0.01/zP6W5Ac5.png" 
                  alt="National University Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Shop <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">campus essentials</span> in a simple product grid
          </h1>
          
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Browse practical items for class, study, commute, and everyday campus routines.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/" className="border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 transition-all">
              ← Back Home
            </Button>
            <Button onClick={scrollToCatalog} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 px-6 py-3 transition-all">
              Browse Categories
            </Button>
          </div>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      </section>

      {/* Filter Bar */}
      <section id="catalog-filters" className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Small NU Logo in Filter Bar */}
              <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-200">
                <img 
                  src="https://static.wixstatic.com/media/2179b6_6c859da3978c4f17b27e723b90bc9f31~mv2.png/v1/fill/w_167,h_188,al_c,usm_0.66_1.00_0.01/zP6W5Ac5.png" 
                  alt="NU"
                  className="h-8 w-auto object-contain opacity-75"
                />
              </div>
              
              <label className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                >
                  <option value="">All Products</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">{productCount}</span> products found
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button className="rounded-lg border border-gray-300 bg-blue-50 p-2 hover:bg-blue-100 transition-colors">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                  Featured Products
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">Product card grid</h2>
                <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {!products && !error && <p className="text-sm text-gray-500">Loading products…</p>}
            {products?.length === 0 && <p className="text-sm text-gray-500">No products in this category yet.</p>}
            {products?.length > 0 && <ProductList products={products} />}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductListPage;