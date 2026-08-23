import { FileText, History, LogOut, MessageSquarePlus, Search } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const recent = ['Attendance policy', 'Hostel room allocation', 'Fee structure 2024', 'Placement stats'];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm font-semibold ${isActive ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-white/10 bg-graphite-950">
      <div className="p-6">
        <button type="button" onClick={() => navigate('/dashboard')} className="text-left text-xl font-bold text-white">
          NIT-J Assistant
        </button>
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="mt-7 flex w-full items-center gap-3 rounded-md border border-white/10 px-5 py-4 text-left font-semibold text-slate-300 hover:border-primary/50 hover:text-white"
        >
          <MessageSquarePlus size={18} aria-hidden="true" />
          New chat
        </button>
      </div>

      <div className="px-6 pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Recent</div>
      <div className="space-y-1">
        {recent.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => navigate(`/chat?q=${encodeURIComponent(item)}`)}
            className={`flex w-full items-center gap-3 px-6 py-3 text-left text-sm font-semibold ${index === 0 ? 'border-l-2 border-primary bg-white/[0.05] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Search size={16} aria-hidden="true" />
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 px-6 pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Navigation</div>
      <nav>
        <NavLink to="/upload" className={navClass}><FileText size={18} aria-hidden="true" />Documents</NavLink>
        <NavLink to="/chat" className={navClass}><History size={18} aria-hidden="true" />History</NavLink>
      </nav>

      <div className="mt-auto flex items-center justify-between p-6 text-sm font-semibold text-slate-300">
        <span className="truncate">{user?.name || 'Student'}</span>
        <button type="button" onClick={logout} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:border-primary hover:text-primary" title="Sign out">
          <LogOut size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
