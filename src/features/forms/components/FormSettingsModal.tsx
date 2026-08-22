import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { CreateFormInput, UpdateFormInput, AdminFormDTO } from "../types";
import type { SanityEvent } from "../../../service/events";

interface FormSettingsModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form?: AdminFormDTO | null;
  events: SanityEvent[];
  isPending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: CreateFormInput | UpdateFormInput) => void;
}

const FormSettingsModal = ({
  isOpen,
  isEditing,
  form,
  events,
  isPending,
  errorMessage,
  onClose,
  onSubmit,
}: FormSettingsModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [submissionLimit, setSubmissionLimit] = useState("");
  const [sanityEventId, setSanityEventId] = useState("");

  useEffect(() => {
    if (isEditing && form) {
      setTitle(form.title);
      setDescription(form.description || "");
      setOpensAt(form.opensAt ? form.opensAt.slice(0, 16) : "");
      setClosesAt(form.closesAt ? form.closesAt.slice(0, 16) : "");
      setSubmissionLimit(form.submissionLimit?.toString() ?? "");
      setSanityEventId(form.sanityEventId || "");
    } else {
      setTitle("");
      setDescription("");
      setOpensAt("");
      setClosesAt("");
      setSubmissionLimit("");
      setSanityEventId("");
    }
  }, [isEditing, form, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        opensAt: opensAt ? new Date(opensAt).toISOString() : undefined,
        closesAt: closesAt ? new Date(closesAt).toISOString() : undefined,
        submissionLimit: submissionLimit ? Number(submissionLimit) : undefined,
      });
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        opensAt: opensAt ? new Date(opensAt).toISOString() : undefined,
        closesAt: closesAt ? new Date(closesAt).toISOString() : undefined,
        submissionLimit: submissionLimit ? Number(submissionLimit) : undefined,
        sanityEventId: sanityEventId || undefined,
      });
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? "Edit Form Settings" : "Create New Form"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. IEEE Spring 2026"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Opens At
              </label>
              <input
                type="datetime-local"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Closes At
              </label>
              <input
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Submission Limit
            </label>
            <input
              type="number"
              min={1}
              value={submissionLimit}
              onChange={(e) => setSubmissionLimit(e.target.value)}
              className={inputClass}
              placeholder="Leave empty for unlimited"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Link to Event (optional)
              </label>
              <select
                value={sanityEventId}
                onChange={(e) => setSanityEventId(e.target.value)}
                className={`${inputClass} capitalize`}
              >
                <option value="">No linked event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl p-3">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm hover:bg-slate-700 transition"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSettingsModal;
