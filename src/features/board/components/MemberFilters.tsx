import { FiFilter } from "react-icons/fi";
import { MemberFilter } from "../hooks/useBoardMembers";

interface MemberFiltersProps {
  boardYears: string[];
  typeFilter: MemberFilter;
  yearFilter: string;
  onTypeChange: (value: MemberFilter) => void;
  onYearChange: (value: string) => void;
  recordCount: number;
}

const MemberFilters = ({
  boardYears,
  typeFilter,
  yearFilter,
  onTypeChange,
  onYearChange,
  recordCount,
}: MemberFiltersProps) => {
  return (
    <section className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FiFilter size={16} /> Filter by:
        </div>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as MemberFilter)}
          className="bg-[#0F172A] border border-slate-600 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
        >
          <option value="All">All Types</option>
          <option value="officer">Officer</option>
          <option value="technical">Technical</option>
          <option value="branding">Branding</option>
          <option value="operation">Operation</option>
        </select>
        <select
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          className="bg-[#0F172A] border border-slate-600 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
        >
          {boardYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
          <option value="All">All Years</option>
        </select>
      </div>
      <span className="text-xs text-slate-400">
        Showing {recordCount} records
      </span>
    </section>
  );
};

export default MemberFilters;
