import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-base font-semibold ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <header className="border-b border-white/10 bg-navy-900/95">
      <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-medium text-primary">NIT-J AI Assistant</Link>
        <nav className="hidden items-center gap-10 md:flex">
          <a href="#features" className="text-base font-semibold text-slate-400 hover:text-white">Features</a>
          <a href="#demo" className="text-base font-semibold text-slate-400 hover:text-white">Demo</a>
          <NavLink to="/login" className={linkClass}>Docs</NavLink>
        </nav>
        <Link to="/login" className="rounded-md border border-slate-500 px-7 py-3 text-lg font-semibold text-white hover:border-primary hover:text-primary">
          Sign in
        </Link>
      </div>
    </header>
  );
}
