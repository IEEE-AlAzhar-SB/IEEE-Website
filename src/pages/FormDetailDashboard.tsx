import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { LuArrowLeft } from "react-icons/lu";
import {
  FiEdit3,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiDownload,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { useEventsQuery } from "../hooks";
import { toFriendlyErrorMessage } from "../lib/apiError";
import {
  DynamicForm,
  FormStatusBadge,
  FormSettingsModal,
  FieldBuilderModal,
  SubmissionsTable,
  useFormDetailQuery,
  useUpdateForm,
  useUpdateFormStatus,
  useAddField,
  useUpdateField,
  useDeleteField,
  useReorderFields,
  useSubmissionsQuery,
  type PublicFormDTO,
  type FormField,
  type AddFieldInput,
  type UpdateFieldInput,
} from "../features/forms";
import { getExportData } from "../features/forms/service/forms";
import { ErrorBanner, ToastNotification } from "../components";

function FormDetailDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [slugCopied, setSlugCopied] = useState(false);

  const copySlug = () => {
    if (!form) return;
    navigator.clipboard
      .writeText(form.slug)
      .then(() => {
        setSlugCopied(true);
        setTimeout(() => setSlugCopied(false), 1500);
      })
      .catch(() => {});
  };

  const {
    data: form,
    isLoading,
    isError,
    error,
    refetch,
  } = useFormDetailQuery(slug ?? "");

  const { data: events = [] } = useEventsQuery();

  const updateFormMutation = useUpdateForm(slug ?? "");
  const updateStatusMutation = useUpdateFormStatus(slug ?? "");
  const addFieldMutation = useAddField(slug ?? "");
  const updateFieldMutation = useUpdateField(slug ?? "");
  const deleteFieldMutation = useDeleteField(slug ?? "");
  const reorderFieldsMutation = useReorderFields(slug ?? "");

  const [submissionsPage, setSubmissionsPage] = useState(1);
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError: submissionsError,
  } = useSubmissionsQuery(slug ?? "", submissionsPage);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const [deletingFieldKey, setDeletingFieldKey] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const sortedFields = useMemo(() => {
    if (!form) return [];
    return [...form.fields].sort((a, b) => a.order - b.order);
  }, [form?.fields]);

  const nonSystemFieldCount = useMemo(() => {
    if (!form) return 0;
    return form.fields.filter((f) => !f.isSystem).length;
  }, [form?.fields]);

  const linkedEventName = useMemo(() => {
    if (!form?.sanityEventId) return null;
    const event = events.find((e) => e._id === form.sanityEventId);
    return event?.title ?? null;
  }, [form?.sanityEventId, events]);

  const handleStatusChange = (status: "active" | "closed") => {
    updateStatusMutation.mutate(status, {
      onError: (err) => {
        setToast({
          message: toFriendlyErrorMessage(err) || "Failed to update status.",
          type: "error",
        });
      },
    });
  };

  const handleSettingsSubmit = (data: Parameters<typeof updateFormMutation.mutate>[0]) => {
    updateFormMutation.mutate(data, {
      onSuccess: () => {
        setIsSettingsModalOpen(false);
        setSettingsError(null);
      },
      onError: (err) => {
        setSettingsError(
          toFriendlyErrorMessage(err) || "Failed to update form.",
        );
      },
    });
  };

  const handleAddField = (input: AddFieldInput) => {
    addFieldMutation.mutate(input, {
      onSuccess: () => {
        setIsFieldModalOpen(false);
        setFieldError(null);
      },
      onError: (err) => {
        setFieldError(toFriendlyErrorMessage(err) || "Failed to add field.");
      },
    });
  };

  const handleUpdateField = (input: UpdateFieldInput) => {
    if (!editingField) return;
    updateFieldMutation.mutate(
      { fieldKey: editingField.key, input },
      {
        onSuccess: () => {
          setIsFieldModalOpen(false);
          setEditingField(null);
          setFieldError(null);
        },
        onError: (err) => {
          setFieldError(
            toFriendlyErrorMessage(err) || "Failed to update field.",
          );
        },
      },
    );
  };

  const handleDeleteField = (fieldKey: string) => {
    deleteFieldMutation.mutate(fieldKey, {
      onSuccess: () => {
        setDeletingFieldKey(null);
      },
      onError: (err) => {
        setToast({
          message: toFriendlyErrorMessage(err) || "Failed to delete field.",
          type: "error",
        });
        setDeletingFieldKey(null);
      },
    });
  };

  const handleReorder = (fieldKey: string, direction: "up" | "down") => {
    const keys = sortedFields.map((f) => f.key);
    const idx = keys.indexOf(fieldKey);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= keys.length) return;
    const newKeys = [...keys];
    [newKeys[idx], newKeys[swapIdx]] = [newKeys[swapIdx], newKeys[idx]];
    reorderFieldsMutation.mutate(newKeys);
  };

  const handleExport = async () => {
    if (!slug) return;
    try {
      const exportData = await getExportData(slug);
      const headerRow = exportData.columns.map((c: { key: string; label: string; isSystem: boolean }) => c.label);
      const rows = exportData.submissions.map((sub: { data: Record<string, unknown> }) =>
        exportData.columns.map((col: { key: string }) => {
          const val = sub.data[col.key];
          if (val === undefined || val === null) return "";
          if (Array.isArray(val)) {
            return val
              .map((item) =>
                typeof item === "object" && item !== null
                  ? [item.section, item.committee, item.role].filter(Boolean).join(" > ")
                  : String(item),
              )
              .join(", ");
          }
          return String(val);
        }),
      );
      const csvContent = [headerRow, ...rows]
        .map((row: string[]) => row.map((cell: string) => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportData.formTitle || slug}_submissions.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setToast({ message: "Failed to export submissions.", type: "error" });
    }
  };

  const publicForm: PublicFormDTO | null = useMemo(() => {
    if (!form) return null;
    return {
      slug: form.slug,
      title: form.title,
      description: form.description,
      status: form.status,
      opensAt: form.opensAt,
      closesAt: form.closesAt,
      fields: form.fields,
      submittable: true,
      capacityReached: false,
    };
  }, [form]);

  const handlePreviewSubmit = async () => {
    setToast({
      message: "This is a preview \u2014 submissions are not saved.",
      type: "success",
    });
  };

  if (isLoading) {
    return (
      <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
        <div className="space-y-4">
          <div className="h-8 bg-slate-700/50 rounded w-64 animate-pulse" />
          <div className="h-4 bg-slate-700/50 rounded w-40 animate-pulse" />
        </div>
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50 animate-pulse space-y-4">
          <div className="h-5 bg-slate-700/50 rounded w-48" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-slate-700/50 rounded" />
            <div className="h-4 bg-slate-700/50 rounded" />
            <div className="h-4 bg-slate-700/50 rounded" />
            <div className="h-4 bg-slate-700/50 rounded" />
          </div>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50 animate-pulse space-y-4">
          <div className="h-5 bg-slate-700/50 rounded w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-700/50 rounded" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError || !form) {
    return (
      <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
        <button
          onClick={() => navigate("/dashboard/forms")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <LuArrowLeft size={16} /> Back to Forms
        </button>
        <ErrorBanner
          message={
            error ? toFriendlyErrorMessage(error) : "Failed to load form details."
          }
          onRetry={refetch}
        />
      </main>
    );
  }

  const hasSubmissions = form.currentSubmissionCount > 0;

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <div
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer"
        onClick={() => navigate("/dashboard/forms")}
      >
        <LuArrowLeft size={16} /> Back to Forms
      </div>

      {/* Header & Status Controls */}
      <header className="pb-4 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              {form.title}
              <FormStatusBadge status={form.status} />
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <span>/{form.slug}</span>
              <button
                type="button"
                onClick={copySlug}
                title="Copy form slug to paste into the Sanity event's formSlug field"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition cursor-pointer"
              >
                {slugCopied ? (
                  <>
                    <FiCheck size={12} className="text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy size={12} /> Copy slug
                  </>
                )}
              </button>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {form.status === "draft" && (
              <button
                onClick={() => handleStatusChange("active")}
                disabled={nonSystemFieldCount === 0 || updateStatusMutation.isPending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusMutation.isPending ? "Activating..." : "Activate"}
              </button>
            )}
            {form.status === "active" && (
              <button
                onClick={() => handleStatusChange("closed")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? "Closing..." : "Close"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Metadata Card */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Form Details</h2>
          <button
            onClick={() => {
              setSettingsError(null);
              setIsSettingsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
          >
            <FiEdit3 size={14} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Title</p>
            <p className="text-sm text-white mt-1">{form.title}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Description</p>
            <p className="text-sm text-slate-300 mt-1">{form.description || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Opens At</p>
            <p className="text-sm text-slate-300 mt-1">
              {form.opensAt ? new Date(form.opensAt).toLocaleString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Closes At</p>
            <p className="text-sm text-slate-300 mt-1">
              {form.closesAt ? new Date(form.closesAt).toLocaleString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Submission Limit</p>
            <p className="text-sm text-slate-300 mt-1">
              {form.submissionLimit != null ? form.submissionLimit : "Unlimited"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Submissions</p>
            <p className="text-sm text-slate-300 mt-1">{form.currentSubmissionCount}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-slate-400 uppercase">Linked Event</p>
            <p className="text-sm text-slate-300 mt-1">{linkedEventName || "None"}</p>
          </div>
        </div>
      </div>

      {/* Fields Section */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Fields</h2>
          <button
            onClick={() => {
              setEditingField(null);
              setFieldError(null);
              setIsFieldModalOpen(true);
            }}
            disabled={hasSubmissions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoPlus size={16} /> Add Field
          </button>
        </div>

        {hasSubmissions && (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 mb-4">
            Structural edits disabled — form has submissions.
          </p>
        )}

        {sortedFields.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No fields yet. Add a field to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFields.map((field, idx) => {
              const isDeleting = deletingFieldKey === field.key;
              return (
                <div
                  key={field.key}
                  className="flex items-center gap-3 bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3"
                >
                  {!hasSubmissions && (
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleReorder(field.key, "up")}
                        disabled={idx === 0}
                        className="p-0.5 text-slate-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(field.key, "down")}
                        disabled={idx === sortedFields.length - 1}
                        className="p-0.5 text-slate-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <FiArrowDown size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate">
                        {field.label}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-700/50 text-slate-400 text-[10px] font-semibold rounded uppercase">
                        {field.type}
                      </span>
                      {field.isSystem && (
                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-semibold rounded">
                          System
                        </span>
                      )}
                      {field.required && !field.isSystem && (
                        <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-semibold rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">Key: {field.key}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!hasSubmissions && (
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setFieldError(null);
                          setIsFieldModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                        title="Edit field"
                      >
                        <FiEdit3 size={14} />
                      </button>
                    )}

                    {!field.isSystem && !hasSubmissions && (
                      isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteField(field.key)}
                            disabled={deleteFieldMutation.isPending}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold rounded-lg transition disabled:opacity-50"
                          >
                            {deleteFieldMutation.isPending ? "..." : "Yes"}
                          </button>
                          <button
                            onClick={() => setDeletingFieldKey(null)}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] font-semibold rounded-lg transition"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingFieldKey(field.key)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                          title="Delete field"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submissions Section */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Submissions</h2>
          <button
            onClick={handleExport}
            disabled={!submissionsData || submissionsData.submissions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
        <SubmissionsTable
          data={submissionsData}
          isLoading={submissionsLoading}
          isError={submissionsError}
          errorMessage="Failed to load submissions."
          currentPage={submissionsPage}
          onPageChange={setSubmissionsPage}
        />
      </div>

      {/* Live Visitor Preview */}
      {publicForm && (
        <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700/50">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Visitor Preview</h2>
            <p className="text-slate-400 text-sm mt-1">
              This is what visitors see on the event page.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <DynamicForm form={publicForm} onSubmit={handlePreviewSubmit} />
          </div>
        </div>
      )}

      {/* Modals */}
      <FormSettingsModal
        isOpen={isSettingsModalOpen}
        isEditing={true}
        form={form}
        events={events}
        isPending={updateFormMutation.isPending}
        errorMessage={settingsError}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setSettingsError(null);
        }}
        onSubmit={handleSettingsSubmit}
      />

      <FieldBuilderModal
        isOpen={isFieldModalOpen}
        isEditing={!!editingField}
        field={editingField}
        isPending={addFieldMutation.isPending || updateFieldMutation.isPending}
        errorMessage={fieldError}
        onClose={() => {
          setIsFieldModalOpen(false);
          setEditingField(null);
          setFieldError(null);
        }}
        onAdd={handleAddField}
        onUpdate={handleUpdateField}
      />

      <ToastNotification
        message={toast?.message ?? null}
        type={toast?.type ?? "error"}
        onClose={() => setToast(null)}
      />
    </main>
  );
}

export default FormDetailDashboard;

