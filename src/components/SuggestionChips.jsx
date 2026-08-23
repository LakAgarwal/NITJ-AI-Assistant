import { BriefcaseBusiness, CalendarDays, GraduationCap, Home, Landmark, Layers } from 'lucide-react';

const suggestions = [
  { label: 'Attendance', question: 'What is the attendance policy?', icon: Layers },
  { label: 'Hostel Rules', question: 'What are the hostel room allocation rules?', icon: Home },
  { label: 'Fees', question: 'What is the fee structure?', icon: Landmark },
  { label: 'Scholarships', question: 'Which scholarships are available?', icon: GraduationCap },
  { label: 'Exam Schedule', question: 'Where can I find the exam schedule?', icon: CalendarDays },
  { label: 'Placements', question: 'Show placement statistics and rules.', icon: BriefcaseBusiness }
];

export default function SuggestionChips({ onSelect, compact = false }) {
  return (
    <div className={`flex flex-wrap ${compact ? 'gap-3' : 'gap-4'}`}>
      {suggestions.map(({ label, question, icon: Icon }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect?.(question)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 hover:border-primary/60 hover:text-white"
          title={question}
        >
          <Icon size={18} className="text-primary" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

export { suggestions };
