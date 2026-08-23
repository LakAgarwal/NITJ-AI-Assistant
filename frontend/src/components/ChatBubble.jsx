import CitationCard from './CitationCard';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-t-2xl rounded-bl-2xl bg-primary px-6 py-4 text-base font-medium text-navy-900 shadow-glow">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-primary">AI</div>
      <article className="max-w-[78%] rounded-lg border border-white/10 bg-white/[0.03] px-6 py-5 text-slate-100">
        <p className="whitespace-pre-wrap text-base leading-7">{message.content}</p>
        {message.sources?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {message.sources.map((source, index) => (
              <CitationCard key={`${source.filename}-${source.pageNumber}-${index}`} source={source} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
