import { LuShieldCheck } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { IoCalendarClearOutline } from "react-icons/io5";

interface StatsRowProps {
  totalCount: number;
  officerCount: number;
  currentYearCount: number;
}

const StatsRow = ({
  totalCount,
  officerCount,
  currentYearCount,
}: StatsRowProps) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
          <FiUsers size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Total Council</span>
          <span className="text-2xl font-bold text-white">{totalCount}</span>
        </div>
      </div>

      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
          <LuShieldCheck size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Officers</span>
          <span className="text-2xl font-bold text-white">{officerCount}</span>
        </div>
      </div>

      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <IoCalendarClearOutline size={24} />
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Current Year</span>
          <span className="text-2xl font-bold text-white">
            {currentYearCount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default StatsRow;
