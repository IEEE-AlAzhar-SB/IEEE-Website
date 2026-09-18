import { TbAlertTriangle } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { LuFilter, LuMessageSquare } from "react-icons/lu";

interface FeedbackStatsRowProps {
  totalCount: number;
  unreadCount: number;
  resolvedCount: number;
  filterLabel: string;
  filterCount: number;
}

const FeedbackStatsRow = ({
  totalCount,
  unreadCount,
  resolvedCount,
  filterLabel,
  filterCount,
}: FeedbackStatsRowProps) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-4 gap-5">
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
          <LuMessageSquare size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Total Feedbacks</span>
          <span className="text-2xl font-bold text-white">{totalCount}</span>
        </div>
      </div>

      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
          <TbAlertTriangle size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Unread</span>
          <span className="text-2xl font-bold text-white">{unreadCount}</span>
        </div>
      </div>

      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <FiCheckCircle size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Resolved</span>
          <span className="text-2xl font-bold text-white">{resolvedCount}</span>
        </div>
      </div>

      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
          <LuFilter size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">
            Filtered ({filterLabel})
          </span>
          <span className="text-2xl font-bold text-white">{filterCount}</span>
        </div>
      </div>
    </section>
  );
};

export default FeedbackStatsRow;
