import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { logIn, signUp } from '../../lib/api';

const inputClasses =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20';

const actionButtonClassName = 'w-full py-3 text-[11px] tracking-[0.2em]';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  // A new account is signed in right away, so the user lands on the Home page.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signUp(form);
      await logIn(form.email, form.password, true);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sign Up</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create a store account for faster checkout, order updates, and pickup details.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              required
              placeholder="First name"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange('firstName')}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              required
              placeholder="Last name"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange('lastName')}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            placeholder="student@email.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange('email')}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            className={inputClasses}
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            At least 6 characters. Use a mix of letters, numbers, and symbols.
          </p>
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName} disabled={submitting}>
          {submitting ? 'Creating Account…' : 'Create Account'}
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Sign Up with Google
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            Sign Up with Apple
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-semibold text-slate-900 transition hover:text-slate-600">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
