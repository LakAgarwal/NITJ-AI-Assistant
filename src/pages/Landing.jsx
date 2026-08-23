import { Link } from 'react-router-dom';
import { FileText, Layers, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import CitationCard from '../components/CitationCard';

export default function Landing() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-24 text-center">
        <div className="mx-auto inline-flex rounded-full border border-primary/50 bg-primary/10 px-6 py-2 text-sm font-semibold text-primary">
          Powered by RAG + Hugging Face
        </div>
        <h1 className="mx-auto mt-10 max-w-5xl text-5xl font-medium leading-tight text-white md:text-6xl">
          Ask anything about <span className="text-primary">NIT Jalandhar</span><br /> instantly
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-xl font-semibold leading-9 text-slate-400">
          Get accurate answers from official PDFs. Attendance rules, hostel policies, fee structures, all cited by page.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link to="/login?role=student" className="rounded-md border border-slate-500 px-9 py-4 text-lg font-semibold text-white hover:border-primary hover:text-primary">Student Login</Link>
          <Link to="/login?role=admin" className="rounded-md border border-slate-500 px-9 py-4 text-lg font-semibold text-white hover:border-primary hover:text-primary">Admin Login</Link>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-6">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-9 text-left">
          <div className="flex justify-end">
            <div className="rounded-t-2xl rounded-bl-2xl bg-primary px-7 py-4 text-lg font-medium text-navy-900">
              Can I sit in exams with 70% attendance?
            </div>
          </div>
          <div className="mt-7 flex items-start gap-5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/20 text-primary">AI</div>
            <div>
              <p className="max-w-5xl text-lg font-semibold leading-8 text-slate-200">
                No. Students must maintain a minimum of <strong className="text-white">75% attendance</strong> to be eligible to appear in semester examinations. Students below this threshold require HOD approval.
              </p>
              <div className="mt-5">
                <CitationCard source={{ documentTitle: 'Academic Handbook.pdf', pageNumber: 18 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
        {[
          { title: 'Semantic search', text: 'Finds answers even when wording differs from the PDF text.', icon: Search },
          { title: 'PDF citations', text: 'Every answer shows exact document name and page number.', icon: FileText },
          { title: 'Multi-document', text: 'Searches across all uploaded PDFs simultaneously.', icon: Layers }
        ].map(({ title, text, icon: Icon }) => (
          <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-8">
            <Icon className="text-primary" size={24} aria-hidden="true" />
            <h2 className="mt-8 text-xl font-semibold text-white">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
