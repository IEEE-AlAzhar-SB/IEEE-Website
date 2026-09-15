import type { SubmissionsResponse } from "../types";

interface SubmissionsTableProps {
  data: SubmissionsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#033e66]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#033e66] border-b border-slate-700/50">
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="animate-pulse bg-slate-700/50 rounded w-32 h-4" />
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="animate-pulse bg-slate-700/50 rounded w-32 h-4" />
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="animate-pulse bg-slate-700/50 rounded w-32 h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="divide-y divide-slate-700/40">
                <td className="py-4 px-6">
                  <div className="animate-pulse bg-slate-700/50 rounded w-40 h-4" />
                </td>
                <td className="py-4 px-6">
                  <div className="animate-pulse bg-slate-700/50 rounded w-36 h-4" />
                </td>
                <td className="py-4 px-6">
                  <div className="animate-pulse bg-slate-700/50 rounded w-48 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SubmissionsTable({
  data,
  isLoading,
  isError,
  errorMessage,
  currentPage,
  onPageChange,
}: SubmissionsTableProps) {
  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-sm">
          {errorMessage || "Failed to load submissions."}
        </span>
      </div>
    );
  }

  if (!data || data.submissions.length === 0) {
    return (
      <div className="bg-[#05568D] rounded-2xl p-12 text-center border border-slate-800 text-slate-500">
        No submissions yet.
      </div>
    );
  }

  const { submissions, totalPages } = data;

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#033e66]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#033e66] border-b border-slate-700/50">
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Submitted At
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, idx) => (
              <tr
                key={`${sub.formSlug}-${sub.submitterEmail}-${idx}`}
                className="divide-y divide-slate-700/40"
              >
                <td className="py-4 px-6 text-sm text-slate-300">
                  {sub.submitterEmail}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {new Date(sub.submittedAt).toLocaleString()}
                </td>
                <td className="py-4 px-6 text-sm text-slate-300">
                  {Object.entries(sub.data)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-sm text-slate-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    p === currentPage
                      ? "bg-white text-[#05568D]"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
