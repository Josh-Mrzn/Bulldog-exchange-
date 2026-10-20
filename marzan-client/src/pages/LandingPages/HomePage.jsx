import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';
import tumbler from '../../assets/img/tumbler.png';
import notebook from '../../assets/img/notebook.png';
import hoodie from '../../assets/img/hoddie.png';
import useStoreCounts from '../../lib/useStoreCounts';
import { getSession } from '../../lib/api';

const icons = {
    products: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    categories: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    pickup: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
};

const SectionHeading = ({ label, title }) => (
    <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">{label}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
    </div>
);

const OverviewBlock = ({ to, value, label, icon, tint }) => {
    const content = (
        <>
            <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">{value}</span>
                <span className={`rounded-xl p-3 ${tint}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </span>
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
        </>
    );
    const classes = 'block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300';

    return to ? (
        <Link to={to} className={`${classes} hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg`}>
            {content}
        </Link>
    ) : (
        <div className={classes}>{content}</div>
    );
};

const shopSections = [
    {
        title: 'Daily Essentials',
        text: 'Bags, tumblers, lanyards, and items used every school day.',
        image: tumbler,
        alt: 'NU Bulldogs tumbler',
        button: 'View Products',
        to: '/products',
    },
    {
        title: 'Study Supplies',
        text: 'Notes, desk tools, and study kits for class and review weeks.',
        image: notebook,
        alt: 'NU spiral notebook',
        button: 'Shop Supplies',
        to: '/products?category=Stationery',
    },
    {
        title: 'Campus Apparel',
        text: 'Comfortable pieces for class days, commute days, and weekends.',
        image: hoodie,
        alt: 'NU Bulldogs hoodie',
        button: 'View Apparel',
        to: '/products?category=Apparel',
    },
];

const HomePage = () => {
    const counts = useStoreCounts();
    const isAdmin = getSession()?.user?.role === 'Admin';

    return (
        <div className="flex w-full flex-col">
            <section className="relative min-h-[28rem] overflow-hidden bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Darkens only the side with the text, so the mascot stays bright */}
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/85 via-slate-900/45 to-transparent" />
                <div className="absolute inset-0 bg-slate-950/45 sm:hidden" />

                <div className="relative z-10 mx-auto flex min-h-[22rem] max-w-7xl items-start justify-end text-right sm:min-h-[24rem]">
                    <div className="max-w-xl">
                        <p className="mb-3 inline-flex items-center rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-100 backdrop-blur-sm">
                            Campus Marketplace
                        </p>
                        <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl">
                            Welcome to BulldogEx Shop
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
                            Explore campus uniforms, student essentials, and school merch in one
                            quick storefront.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Button to="/products" variant="brand" className="px-6 py-3 shadow-lg shadow-blue-600/30">
                                Shop Now
                            </Button>
                            <Button to="/about" className="border-2 border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur-sm hover:bg-white/20">
                                About Store
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
            </section>

            <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading label="Store Overview" title="Quick shopping blocks" />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <OverviewBlock to="/products" value={counts.products} label="Products" icon={icons.products} tint="bg-blue-50 text-blue-600" />
                        <OverviewBlock to="/products" value={counts.categories} label="Categories" icon={icons.categories} tint="bg-purple-50 text-purple-600" />
                        <OverviewBlock
                            to={isAdmin ? '/admin/orders' : '/orders'}
                            value={counts.orders}
                            label={isAdmin ? 'Orders' : 'My Orders'}
                            icon={icons.orders}
                            tint="bg-orange-50 text-orange-600"
                        />
                        <OverviewBlock value="03" label="Pickup Slots" icon={icons.pickup} tint="bg-green-50 text-green-600" />
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading label="Shop Sections" title="Simple store cards" />

                    <div className="grid gap-6 md:grid-cols-3">
                        {shopSections.map((section) => (
                            <article
                                key={section.title}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="aspect-4/3 overflow-hidden bg-white p-6">
                                    <img
                                        src={section.image}
                                        alt={section.alt}
                                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col border-t border-slate-100 bg-slate-50/50 p-5">
                                    <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                                    <p className="mb-5 mt-2 text-sm leading-6 text-slate-600">{section.text}</p>
                                    <Button to={section.to} className="mt-auto self-start" variant="primary">
                                        {section.button} →
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
