import { Link } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import type { AdminFormDTO } from "../types";
import FormStatusBadge from "./FormStatusBadge";

interface FormsTableProps {
  forms: AdminFormDTO[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onDelete: (slug: string) => void;
}

const FormsTable = ({
  forms,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onDelete,
}: FormsTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto w-full animate-pulse">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#033e66] border-b border-slate-700/50">
              {["Title", "Status", "Submissions", "Actions"].map((h) => (
                <th key={h} className="py-4 px-6">
                  <div className="h-4 bg-slate-700/50 rounded w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <td key={j} className="py-4 px-6">
                    <div className="h-4 bg-slate-700/50 rounded w-32" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3 text-red-400">
          <p className="text-sm font-medium">
            {errorMessage || "Failed to load forms."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold transition"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="bg-[#05568D] rounded-2xl p-12 text-center border border-slate-800 text-slate-500">
        No forms created yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#033e66] border-b border-slate-700/50">
            <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Title
            </th>
            <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Submissions
            </th>
            <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {forms.map((form) => (
            <tr
              key={form.slug}
              className="hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-4 px-6">
                <Link
                  to={`/dashboard/forms/${form.slug}`}
                  className="text-white font-medium hover:text-white transition-colors"
                >
                  {form.title}
                </Link>
                {form.sanityEventId && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <IoCalendarOutline size={12} /> Linked event
                  </p>
                )}
              </td>
              <td className="py-4 px-6">
                <FormStatusBadge status={form.status} />
              </td>
              <td className="py-4 px-6 text-sm text-slate-300">
                {form.currentSubmissionCount}
                {form.submissionLimit != null && (
                  <span className="text-slate-500">
                    {" "}
                    / {form.submissionLimit}
                  </span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/dashboard/forms/${form.slug}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <FiEdit3 size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(form.slug)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable;
