import { LuFilter } from "react-icons/lu";
import { FeedbackFilter } from "../hooks/useFeedbackManager";

interface FeedbackFilterBarProps {
  statusFilter: FeedbackFilter;
  onFilterChange: (value: FeedbackFilter) => void;
  recordCount: number;
}

const FeedbackFilterBar = ({
  statusFilter,
  onFilterChange,
  recordCount,
}: FeedbackFilterBarProps) => {
  return (
    <section className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <LuFilter size={16} /> Status:
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value as FeedbackFilter)}
          className="bg-[#0F172A] border border-slate-600 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
        >
          <option value="All">All Feedbacks</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <span className="text-xs text-slate-400">
        Showing {recordCount} messages
      </span>
    </section>
  );
};

export default FeedbackFilterBar;
