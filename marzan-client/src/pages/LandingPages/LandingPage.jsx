import { Link } from 'react-router-dom';
import logo from '../../assets/img/nubdexchange_logo.png';
import tumbler from '../../assets/img/tumbler.png';
import hoodie from '../../assets/img/hoddie.png';
import lanyard from '../../assets/img/lanyard.png';
import totebag from '../../assets/img/totebag.png';
import notebook from '../../assets/img/notebook.png';
import exampack from '../../assets/img/exampack.png';

const icons = {
  badge: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  truck: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  campus: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  cancel: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  arrow: 'M17 8l4 4m0 0l-4 4m4-4H3',
};

const Icon = ({ path, className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: "What's in store", href: '#store' },
];

const highlights = [
  { icon: icons.campus, title: 'NU campus store', text: 'Gear made for Bulldogs' },
  { icon: icons.card, title: 'Pay your way', text: 'Cash, GCash or card' },
  { icon: icons.truck, title: 'Tracked orders', text: 'From pending to delivered' },
  { icon: icons.star, title: 'Real reviews', text: 'Only from actual buyers' },
];

const features = [
  {
    icon: icons.campus,
    title: 'Straight from the campus store',
    text: 'Apparel, school supplies and daily essentials sold by the store itself, not resellers.',
  },
  {
    icon: icons.tag,
    title: 'Clear prices and stock',
    text: 'Every product shows its price and how many are left before you add it to your cart.',
  },
  {
    icon: icons.card,
    title: 'Pay your way',
    text: 'Choose cash on delivery, GCash or card at checkout, whichever works for you.',
  },
  {
    icon: icons.truck,
    title: 'Follow your order',
    text: 'Watch it move from pending to processing, shipped and delivered on its own page.',
  },
  {
    icon: icons.cancel,
    title: 'Changed your mind?',
    text: 'Cancel an order yourself while it is still pending, no need to message anyone.',
  },
  {
    icon: icons.star,
    title: 'Honest ratings',
    text: 'Only shoppers who received the item can rate it, so the stars actually mean something.',
  },
];

const steps = [
  { title: 'Create your account', text: 'Sign up with your email and you are signed in right away.' },
  { title: 'Browse the catalog', text: 'Filter by category, search by name and open any product for details.' },
  { title: 'Check out', text: 'Add items to your cart, enter your address and pick how you will pay.' },
  { title: 'Track and rate', text: 'Follow the order until it arrives, then leave a rating for what you bought.' },
];

const storeItems = [
  { image: hoodie, label: 'Apparel', name: 'Bulldogs hoodie' },
  { image: tumbler, label: 'Essentials', name: 'Bulldogs tumbler' },
  { image: notebook, label: 'Stationery', name: 'Spiral notebook' },
  { image: lanyard, label: 'Accessories', name: 'NU lanyard' },
  { image: totebag, label: 'Bags', name: 'Campus tote bag' },
  { image: exampack, label: 'Study', name: 'Exam survival kit' },
];

const SectionLabel = ({ children, className = 'text-nu-navy' }) => (
  <p className={`text-xs font-bold uppercase tracking-[0.22em] ${className}`}>{children}</p>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-nu-cream font-body text-nu-ink">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-nu-ink/5 bg-nu-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-xl font-bold text-nu-ink">BulldogEx</span>
          </a>

          <nav aria-label="Landing page sections" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-nu-ink/70 transition hover:text-nu-navy">
                {link.label}
              </a>
            ))}
          </nav>

          <Link
            to="/auth/signin"
            className="rounded-full bg-nu-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-nu-ink/20 transition hover:bg-nu-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-gold focus-visible:ring-offset-2"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-nu-navy/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-nu-gold/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-nu-ink/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-nu-ink/80 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-nu-gold" />
              National University campus store
            </p>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-nu-ink sm:text-6xl lg:text-7xl">
              Campus gear,
              <br />
              <span className="italic text-nu-navy">
                made for every{' '}
                <span className="underline decoration-nu-gold decoration-[6px] underline-offset-[10px]">Bulldog.</span>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-nu-ink/70">
              BulldogEx brings NU apparel, school supplies and everyday essentials into one shop, with clear
              prices, simple checkout and orders you can follow until they reach you.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 rounded-full bg-nu-ink px-7 py-4 text-base font-semibold text-white shadow-xl shadow-nu-ink/25 transition hover:bg-nu-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-gold focus-visible:ring-offset-2"
              >
                Start shopping
                <Icon path={icons.arrow} className="h-4 w-4" />
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center rounded-full border border-nu-ink/10 bg-white px-7 py-4 text-base font-semibold text-nu-ink shadow-sm transition hover:border-nu-navy/30 hover:text-nu-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-navy focus-visible:ring-offset-2"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm flex-col items-center lg:max-w-md">
            <div className="absolute inset-8 rounded-full bg-nu-gold/30 blur-3xl" />
            <img
              src={logo}
              alt="NU Bulldogs Exchange logo"
              className="relative w-full drop-shadow-[0_25px_35px_rgba(19,25,67,0.35)] motion-safe:animate-float"
            />
            <div className="mt-6 h-4 w-2/3 rounded-[100%] bg-nu-ink/15 blur-md" />
          </div>
        </div>

        {/* Highlight strip */}
        <div className="relative mx-auto mt-16 grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-nu-ink/5 bg-nu-ink/5 shadow-xl shadow-nu-ink/5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-center gap-4 bg-white p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nu-navy/10 text-nu-navy">
                <Icon path={item.icon} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-nu-ink">{item.title}</p>
                <p className="text-sm text-nu-ink/60">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-nu-ink/10 bg-white px-4 py-2">
              <SectionLabel>Why BulldogEx</SectionLabel>
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-nu-ink sm:text-5xl">
              Built for campus life,
              <br />
              simple from cart to door
            </h2>
            <p className="mt-5 text-lg text-nu-ink/65">
              Everything a student order needs, from the price on the tag to the rating after it arrives.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-3xl border border-nu-ink/5 bg-white/70 p-8 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-nu-ink/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-nu-navy shadow-sm ring-1 ring-nu-ink/5 transition group-hover:bg-nu-navy group-hover:text-nu-gold">
                  <Icon path={feature.icon} />
                </span>
                <h3 className="mt-8 font-display text-xl font-semibold text-nu-ink">{feature.title}</h3>
                <p className="mt-3 leading-7 text-nu-ink/65">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid max-w-6xl gap-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-nu-ink via-nu-ink to-nu-navy p-8 shadow-2xl shadow-nu-ink/30 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-nu-gold/10 blur-3xl" />

          <div className="relative">
            <SectionLabel className="text-nu-gold">Getting started</SectionLabel>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              How to shop
              <br />
              <span className="italic text-nu-gold">at BulldogEx</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/75">
              One path from sign up to delivery. Follow the four steps, then start shopping.
            </p>
            <Link
              to="/auth/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-nu-ink transition hover:bg-nu-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-nu-ink"
            >
              Create an account
              <Icon path={icons.arrow} className="h-4 w-4" />
            </Link>
          </div>

          <ol className="relative">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {index < steps.length - 1 && (
                  <span className="absolute left-6 top-14 bottom-2 w-px bg-nu-gold/40" aria-hidden="true" />
                )}
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white font-display text-base font-bold text-nu-ink ring-4 ring-nu-gold/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-1 leading-7 text-white/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Store preview */}
      <section id="store" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>What's in store</SectionLabel>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-nu-ink sm:text-5xl">
                A look at the shelves
              </h2>
            </div>
            <p className="max-w-sm text-nu-ink/65">
              A few of the items you will find inside. Sign in to see prices, stock and the full catalog.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {storeItems.map((item) => (
              <article
                key={item.name}
                className="group overflow-hidden rounded-3xl border border-nu-ink/5 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-nu-ink/5"
              >
                <div className="aspect-square bg-white p-6 sm:p-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-nu-ink/5 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-nu-navy/70">{item.label}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-nu-ink">{item.name}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-[2rem] border border-nu-gold/40 bg-white px-6 py-14 text-center shadow-xl shadow-nu-ink/5 sm:px-12">
          <img src={logo} alt="" className="h-20 w-20 object-contain" />
          <div>
            <h2 className="font-display text-4xl font-bold text-nu-ink sm:text-5xl">
              Ready, <span className="italic text-nu-navy">Bulldog?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-nu-ink/65">
              Sign in to start shopping, or create an account in under a minute.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/auth/signin"
              className="inline-flex items-center gap-2 rounded-full bg-nu-ink px-7 py-4 font-semibold text-white shadow-xl shadow-nu-ink/25 transition hover:bg-nu-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-gold focus-visible:ring-offset-2"
            >
              Sign in
              <Icon path={icons.arrow} className="h-4 w-4" />
            </Link>
            <Link
              to="/auth/signup"
              className="inline-flex items-center rounded-full bg-nu-gold px-7 py-4 font-semibold text-nu-ink shadow-lg shadow-nu-gold/30 transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-nu-ink focus-visible:ring-offset-2"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nu-ink px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-display text-lg font-bold">BulldogEx Shop</p>
              <p className="text-sm text-white/60">National University campus store</p>
            </div>
          </div>
          <div className="h-1 w-16 rounded-full bg-nu-gold sm:hidden" />
          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} Bulldogs Exchange. Go Bulldogs!</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
