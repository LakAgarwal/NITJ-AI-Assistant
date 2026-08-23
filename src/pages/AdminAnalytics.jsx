import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getAnalytics } from '../services/api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics().then(setStats).catch((err) => setError(err.message));
  }, []);

  const cards = [
    ['Total Documents', stats?.totalDocuments || 0],
    ['Total Questions Asked', stats?.totalQuestions || 0],
    ['Total Users', stats?.totalUsers || 0],
    ['Most Active Document', stats?.mostActiveDocument?.title || 'None']
  ];

  return (
    <main className="min-h-screen bg-graphite-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link to="/upload" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={18} />Documents</Link>
        <h1 className="mt-6 text-3xl font-bold">Admin Analytics</h1>
        {error && <p className="mt-6 rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-rose-200">{error}</p>}
        <section className="mt-8 grid gap-5 md:grid-cols-4">
          {cards.map(([label, value]) => (
            <article key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-semibold text-slate-400">{label}</p>
              <strong className="mt-4 block truncate text-2xl">{value}</strong>
            </article>
          ))}
        </section>
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Top questions</h2>
            <div className="mt-5 space-y-3">
              {(stats?.topQuestions || []).map((item) => (
                <p key={item.question} className="flex justify-between gap-4 rounded-md bg-black/20 px-4 py-3 text-slate-300">
                  <span className="truncate">{item.question}</span>
                  <span>{item.count}</span>
                </p>
              ))}
            </div>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Top documents</h2>
            <div className="mt-5 space-y-3">
              {(stats?.topDocuments || []).map((item) => (
                <p key={item.filename} className="flex justify-between gap-4 rounded-md bg-black/20 px-4 py-3 text-slate-300">
                  <span className="truncate">{item.title || item.filename}</span>
                  <span>{item.count}</span>
                </p>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
