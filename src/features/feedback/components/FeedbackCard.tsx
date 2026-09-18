import { LuClock3, LuMail, LuTrash2, LuUser } from "react-icons/lu";
import { FeedbackItem, FeedbackStatus } from "../hooks/useFeedbackManager";

interface FeedbackCardProps {
  feedback: FeedbackItem;
  onStatusChange: (id: string, newStatus: FeedbackStatus) => void;
  onDelete: (id: string) => void;
}

const FeedbackCard = ({
  feedback,
  onStatusChange,
  onDelete,
}: FeedbackCardProps) => {
  const isUnread = feedback.status === "unread";
  const id = feedback.id ?? feedback._id ?? "";

  return (
    <div
      className={`p-5 rounded-2xl border transition flex flex-col gap-4 ${
        isUnread
          ? "bg-[#1E293B] border-blue-500/30 shadow-md shadow-blue-500/5"
          : "bg-[#1E293B]/60 border-slate-800"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-base flex items-center gap-1.5">
              <LuUser size={14} className="text-slate-400" /> {feedback.name}
            </span>
            {isUnread && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-blue-500 text-white rounded-full animate-pulse">
                New Message
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <LuMail size={12} /> {feedback.email}
          </div>
          {feedback.phone && (
            <div className="text-xs text-slate-500">
              Phone: {feedback.phone}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-auto">
          <span className="flex items-center gap-1">
            <LuClock3 size={12} />
            {new Date(
              feedback.createdAt || feedback.date || "",
            ).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-1.5">
          Subject:{" "}
          <span className="text-white font-medium">
            {feedback.subject || "No Subject"}
          </span>
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed bg-[#0F172A]/40 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
          {feedback.message}
        </p>
      </div>

      <div className="flex justify-end items-center gap-2 pt-1">
        <select
          value={feedback.status}
          onChange={(e) => onStatusChange(id, e.target.value as FeedbackStatus)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isUnread
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600"
              : "bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/20"
          }`}
        >
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/10"
          title="Delete message"
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
