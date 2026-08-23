import { useEffect, useState } from 'react';
import { BarChart3, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentCard from '../components/DocumentCard';
import { deleteDocument, getDocuments, uploadDocument } from '../services/api';

export default function Upload() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  async function loadDocuments() {
    const docs = await getDocuments();
    setDocuments(docs);
  }

  useEffect(() => {
    loadDocuments().catch((err) => setError(err.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (!file || !title.trim()) {
      setError('Choose a file and enter a title before uploading');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());

    setUploading(true);
    setError('');
    setProgress(0);
    try {
      await uploadDocument(formData, (event) => {
        if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
      });
      setTitle('');
      setFile(null);
      setProgress(100);
      await loadDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function remove(document) {
    if (!window.confirm(`Delete ${document.title}?`)) return;
    await deleteDocument(document._id);
    await loadDocuments();
  }

  const totalChunks = documents.reduce((sum, item) => sum + (item.chunkCount || 0), 0);

  return (
    <main className="min-h-screen bg-graphite-900 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Document Management</h1>
          <Link to="/analytics" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 hover:border-primary hover:text-primary">
            <BarChart3 size={18} aria-hidden="true" />
            Admin Panel
          </Link>
        </header>

        <form onSubmit={submit} className="mt-10 rounded-lg border border-dashed border-white/25 p-10 text-center">
          <UploadCloud className="mx-auto text-slate-400" size={40} aria-hidden="true" />
          <h2 className="mt-6 text-xl font-semibold">Drag and drop PDFs here</h2>
          <p className="mt-3 text-slate-400">Supports PDF, DOCX, TXT · Max 20 MB per file</p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 md:grid-cols-[1fr_auto]">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Document title" className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-primary" />
            <label className="cursor-pointer rounded-md border border-white/20 px-6 py-3 font-semibold text-slate-300 hover:border-primary hover:text-primary">
              Browse files
              <input type="file" accept=".pdf,.docx,.txt" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" />
            </label>
          </div>
          {file && <p className="mt-4 text-sm font-semibold text-primary">{file.name}</p>}
          <button disabled={uploading} type="submit" className="mt-6 rounded-md bg-primary px-8 py-3 font-bold text-navy-900 disabled:opacity-60">
            {uploading ? 'Uploading...' : 'Upload document'}
          </button>
        </form>

        {(uploading || progress > 0) && (
          <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>{file?.name || 'Document'}</span>
              <span className="text-primary">{progress}% processing chunks...</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </section>
        )}

        {error && <p className="mt-6 rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-rose-200">{error}</p>}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-300">Uploaded documents ({documents.length})</h2>
          <div className="mt-5 space-y-4">
            {documents.map((document) => (
              <DocumentCard key={document._id} document={document} onDelete={remove} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-lg bg-black/20 p-6"><p className="text-slate-400">Total documents</p><strong className="mt-4 block text-4xl">{documents.length}</strong></div>
          <div className="rounded-lg bg-black/20 p-6"><p className="text-slate-400">Total chunks</p><strong className="mt-4 block text-4xl">{totalChunks}</strong></div>
          <div className="rounded-lg bg-black/20 p-6"><p className="text-slate-400">Questions answered</p><strong className="mt-4 block text-4xl">142</strong></div>
        </section>
      </div>
    </main>
  );
}
