import { TbAlertTriangle } from "react-icons/tb";

interface FeedbackDeleteModalProps {
  isOpen: boolean;
  isPending: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const FeedbackDeleteModal = ({
  isOpen,
  isPending,
  errorMessage,
  onCancel,
  onConfirm,
}: FeedbackDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <TbAlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Delete Submission</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Are you completely sure you want to remove this feedback? This cannot
          be undone.
        </p>
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl p-3 mb-6 text-left">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition disabled:opacity-50"
          >
            No, Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-500 shadow-lg shadow-red-500/20 transition disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Yes, Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDeleteModal;
