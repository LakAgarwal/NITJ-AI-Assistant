import { FileText, Trash2 } from 'lucide-react';

export default function DocumentCard({ document, onDelete }) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-rose-400/50 text-rose-300">
          <FileText size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">{document.title}</h3>
          <p className="truncate text-sm text-slate-400">
            {document.pageCount} pages · {document.chunkCount} chunks · Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">Ready</span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(document)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-400 hover:border-rose-400 hover:text-rose-300"
            title={`Delete ${document.title}`}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
