import { FileText } from 'lucide-react';

export default function CitationCard({ source }) {
  if (!source) return null;

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
      <FileText size={14} aria-hidden="true" />
      <span className="truncate">
        {source.documentTitle || source.filename} · Page {source.pageNumber || '-'}
      </span>
    </span>
  );
}
