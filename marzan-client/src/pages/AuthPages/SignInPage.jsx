import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { logIn } from '../../lib/api';

const inputClasses =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20';

const actionButtonClassName = 'w-full py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { user } = await logIn(email, password, remember);
      navigate(user.role === 'Admin' ? '/admin/dashboard' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
        Welcome Back
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Log In</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Access your store account to review orders, saved items, and pickup details.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="signin-email" className="text-sm font-semibold text-slate-900">
            Email Address
          </label>
          <input
            id="signin-email"
            type="email"
            required
            placeholder="student@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-semibold text-slate-900">
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-blue-200 accent-blue-900"
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="font-semibold text-blue-900 transition hover:text-zinc-900">
            Forgot Password?
          </button>
        </div>

        <Button type="submit" variant="brand" className={actionButtonClassName} disabled={submitting}>
          {submitting ? 'Logging In…' : 'Log In'}
        </Button>

      </form>

      <div className="mt-8 border-t-2 border-zinc-900 pt-6 text-sm text-zinc-600">
        No account yet?{' '}
        <Link to="/auth/signup" className="font-semibold text-blue-900 transition hover:text-zinc-900">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;
