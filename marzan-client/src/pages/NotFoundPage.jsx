import Button from '../components/Button';
import nfLogo from '../assets/img/NFlogo.png';

const NotFoundPage = () => {
  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl border-2 border-zinc-900 bg-zinc-50 p-5 sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto w-full max-w-sm border-2 border-zinc-900 bg-zinc-100 p-6">
            <img
              src={nfLogo}
              alt="Page not found"
              className="mx-auto h-56 w-56 object-contain sm:h-72 sm:w-72"
            />
          </div>

          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-800">
              Page Not Found
            </p>
            <h1 className="mt-3 text-7xl font-bold leading-none text-zinc-900 sm:text-8xl lg:text-9xl">
              404
            </h1>
            <h2 className="mt-5 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
              This aisle is empty.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-zinc-600 lg:mx-0">
              The page you opened is missing, moved, or no longer available.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button to="/" variant="primary" className="py-3">
                Back Home
              </Button>
              <Button to="/products" variant="brand" className="py-3">
                View Products
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NotFoundPage;
