import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { getMe, updateSessionUser, updateUser } from '../lib/api';

const inputClasses =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-100 disabled:text-slate-500';

const emptyPasswords = { currentPassword: '', password: '', confirmPassword: '' };

const ChangePasswordForm = ({ userId }) => {
  const [form, setForm] = useState(emptyPasswords);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    if (form.password !== form.confirmPassword) return setError('The new passwords do not match.');
    if (form.password === form.currentPassword) return setError('Choose a new password that is different from your current one.');
    setSaving(true);
    try {
      await updateUser(userId, { currentPassword: form.currentPassword, password: form.password });
      setForm(emptyPasswords);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Change password">
      <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Password changed. Use your new password the next time you log in.
        </p>
      )}

      <div>
        <label htmlFor="current-password" className="text-sm font-semibold text-slate-900">
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={handleChange('currentPassword')}
          className={inputClasses}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="new-password" className="text-sm font-semibold text-slate-900">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-900">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            className={inputClasses}
          />
        </div>
      </div>
      <p className="text-xs text-slate-500">At least 6 characters. Use a mix of letters, numbers, and symbols.</p>

      <Button type="submit" variant="primary" className="w-full py-3 text-[11px] tracking-[0.2em]" disabled={saving}>
        {saving ? 'Saving…' : 'Change Password'}
      </Button>
    </form>
  );
};

// Shared by the store (/profile) and the admin area (/admin/profile).
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        setUser(data);
        setForm({ username: data.username ?? '', firstName: data.firstName, lastName: data.lastName });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (field) => (event) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const changes = { firstName: form.firstName, lastName: form.lastName };
      if (form.username.trim()) changes.username = form.username.trim();
      const { data } = await updateUser(user._id, changes);
      setUser(data);
      updateSessionUser(data);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user && !error) return <p className="px-4 py-16 text-center text-sm text-slate-500">Loading profile…</p>;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">Account</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">My Profile</h1>
        <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />

        {user && (
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
              {(user.username || user.firstName).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{user.username || `${user.firstName} ${user.lastName}`}</p>
              <p className="text-sm text-slate-500">
                {user.role} · Member since {new Date(user.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {saved && (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Profile updated.
            </p>
          )}

          <div>
            <label htmlFor="profile-username" className="text-sm font-semibold text-slate-900">
              Username
            </label>
            <input
              id="profile-username"
              minLength={3}
              maxLength={30}
              pattern="\S+"
              title="3 to 30 characters, no spaces"
              placeholder="e.g. Josh_M! or jm★2026"
              value={form.username}
              onChange={handleChange('username')}
              className={inputClasses}
            />
            <p className="mt-2 text-xs text-slate-500">
              3–30 characters, no spaces. Special characters are allowed. Shown on your reviews and in the navigation bar.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-first-name" className="text-sm font-semibold text-slate-900">
                First Name
              </label>
              <input id="profile-first-name" required value={form.firstName} onChange={handleChange('firstName')} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="profile-last-name" className="text-sm font-semibold text-slate-900">
                Last Name
              </label>
              <input id="profile-last-name" required value={form.lastName} onChange={handleChange('lastName')} className={inputClasses} />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="text-sm font-semibold text-slate-900">
              Email
            </label>
            <input id="profile-email" disabled value={user?.email ?? ''} className={inputClasses} />
          </div>

          <Button type="submit" variant="brand" className="w-full py-3 text-[11px] tracking-[0.2em]" disabled={saving || !user}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>

        {user && <ChangePasswordForm userId={user._id} />}
      </div>
    </section>
  );
};

export default ProfilePage;
