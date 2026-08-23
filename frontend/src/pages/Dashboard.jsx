import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquareText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SuggestionChips from '../components/SuggestionChips';
import { useAuth } from '../context/AuthContext';
import { getDocuments } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    getDocuments().then((docs) => setDocumentCount(docs.length)).catch(() => setDocumentCount(0));
  }, []);

  function ask(question) {
    navigate(`/chat?q=${encodeURIComponent(question)}`);
  }

  return (
    <main className="flex h-screen bg-graphite-900 text-white">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-8 py-7">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <p className="mt-2 text-slate-400">Ask from official NIT Jalandhar documents.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300">
            <FileText size={18} className="text-primary" aria-hidden="true" />
            {documentCount} documents available
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl flex-1 px-8 py-10">
          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-8">
            <div className="flex items-center gap-3">
              <MessageSquareText className="text-primary" size={28} aria-hidden="true" />
              <h2 className="text-2xl font-bold">Start with a common question</h2>
            </div>
            <div className="mt-7">
              <SuggestionChips onSelect={ask} />
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['Attendance clarity', 'Check eligibility, shortage rules, and approval requirements.'],
              ['Hostel guidance', 'Find room allocation, conduct, and facility rules.'],
              ['Fee answers', 'Look up structure, deadlines, and related instructions.']
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
