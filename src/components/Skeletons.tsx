export const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => {
  return (
    <div className="overflow-x-auto w-full animate-pulse">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#131C2E] border-b border-slate-700/50">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="py-4 px-6">
                <div className="h-4 bg-slate-700/50 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {colIndex === 0 && (
                      <div className="w-9 h-9 rounded-full bg-slate-700/50 shrink-0"></div>
                    )}
                    <div className="h-4 bg-slate-700/50 rounded w-32"></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const FeedbackCardSkeleton = () => {
  return (
    <div className="p-5 rounded-2xl border bg-[#1E293B]/60 border-slate-800 flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="space-y-2">
          <div className="h-5 bg-slate-700/50 rounded w-48"></div>
          <div className="h-4 bg-slate-700/50 rounded w-32"></div>
        </div>
        <div className="h-4 bg-slate-700/50 rounded w-24 self-end sm:self-auto"></div>
      </div>
      <div>
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3"></div>
        <div className="h-16 bg-[#0F172A]/40 rounded-xl border border-slate-800/80 p-4"></div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <div className="h-8 bg-slate-700/50 rounded w-28"></div>
        <div className="h-8 bg-slate-700/50 rounded w-8"></div>
      </div>
    </div>
  );
};

export const FeedbackStatsRowSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4"
      >
        <div className="p-3 bg-slate-700/30 rounded-xl w-12 h-12 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-700/50 rounded w-20" />
          <div className="h-7 bg-slate-700/50 rounded w-10" />
        </div>
      </div>
    ))}
  </div>
);

export const FeedbackFilterBarSkeleton = () => (
  <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-4 bg-slate-700/50 rounded w-16" />
      <div className="h-8 bg-slate-700/50 rounded-xl w-36" />
    </div>
    <div className="h-4 bg-slate-700/50 rounded w-28" />
  </div>
);
