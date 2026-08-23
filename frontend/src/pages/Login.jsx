import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/upload' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 text-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <div className="mt-6 grid grid-cols-2 rounded-md bg-slate-100 p-1">
          {['student', 'admin'].map((item) => (
            <button key={item} type="button" onClick={() => setRole(item)} className={`rounded-md px-4 py-3 text-sm font-semibold capitalize ${role === item ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>
              {item}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-sm font-semibold">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
        {error && <p className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        <button disabled={loading} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-bold text-navy-900 disabled:opacity-70">
          <LogIn size={18} aria-hidden="true" />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here? <Link className="font-semibold text-primary" to="/register">Create student account</Link>
        </p>
      </form>
    </main>
  );
}
