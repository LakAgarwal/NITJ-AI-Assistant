import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 text-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Create account</h1>
        <label className="mt-6 block text-sm font-semibold">Full name</label>
        <input value={form.name} onChange={(event) => update('name', event.target.value)} required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        <label className="mt-4 block text-sm font-semibold">Email</label>
        <input value={form.email} onChange={(event) => update('email', event.target.value)} type="email" required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input value={form.password} onChange={(event) => update('password', event.target.value)} type="password" required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        <label className="mt-4 block text-sm font-semibold">Confirm password</label>
        <input value={form.confirm} onChange={(event) => update('confirm', event.target.value)} type="password" required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        {error && <p className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        <button disabled={loading} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-bold text-navy-900 disabled:opacity-70">
          <UserPlus size={18} aria-hidden="true" />
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-semibold text-primary" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
