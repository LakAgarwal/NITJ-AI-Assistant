import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SendHorizonal } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SuggestionChips from '../components/SuggestionChips';
import ChatBubble from '../components/ChatBubble';
import { useChat } from '../hooks/useChat';

export default function Chat() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialQuestion = useMemo(() => params.get('q') || '', [params]);
  const { messages, loading, sendMessage } = useChat(initialQuestion);
  const [question, setQuestion] = useState('');

  function submit(event) {
    event.preventDefault();
    sendMessage(question);
    setQuestion('');
  }

  function selectSuggestion(value) {
    navigate(`/chat?q=${encodeURIComponent(value)}`, { replace: true });
  }

  return (
    <main className="flex h-screen bg-graphite-900 text-white">
      <Sidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Attendance policy</h1>
              <p className="mt-1 text-slate-400">Ask a question across uploaded college documents.</p>
            </div>
          </div>
          {messages.length === 0 && (
            <div className="mt-6">
              <SuggestionChips compact onSelect={selectSuggestion} />
            </div>
          )}
        </header>

        <div className="scrollbar-soft flex-1 space-y-7 overflow-y-auto px-8 py-8">
          {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
          {loading && (
            <div className="flex items-center gap-2 pl-14 text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          )}
        </div>

        <form onSubmit={submit} className="flex gap-4 border-t border-white/10 p-6">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) submit(event);
            }}
            placeholder="Ask a question about NIT Jalandhar..."
            className="min-h-[72px] flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white outline-none placeholder:text-slate-400 focus:border-primary/60"
          />
          <button disabled={loading || !question.trim()} type="submit" className="grid h-[72px] w-[84px] place-items-center rounded-lg border border-white/20 text-primary hover:border-primary disabled:opacity-50" title="Send question">
            <SendHorizonal size={24} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}
