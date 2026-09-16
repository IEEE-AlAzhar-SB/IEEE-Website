import { useState } from "react";
import {
  LuFileText,
  LuCircleCheck,
  LuClock,
  LuCircleX,
} from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import {
  FormsTable,
  FormSettingsModal,
  FormDeleteModal,
  useFormsQuery,
  useCreateForm,
  useDeleteForm,
  type CreateFormInput,
  type UpdateFormInput,
} from "../features/forms";
import { useEventsQuery } from "../hooks";
import { ToastNotification } from "../components";
import { toFriendlyErrorMessage } from "../lib/apiError";

function FormsDashboard() {
  const {
    data: forms,
    isLoading,
    isError,
    error,
    refetch,
  } = useFormsQuery();

  const { data: events = [] } = useEventsQuery();

  const totalCount = forms?.length ?? 0;
  const activeCount = forms?.filter((f) => f.status === "active").length ?? 0;
  const draftCount = forms?.filter((f) => f.status === "draft").length ?? 0;
  const closedCount = forms?.filter((f) => f.status === "closed").length ?? 0;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useDeleteForm();

  const triggerDeleteModal = (slug: string) => {
    setSlugToDelete(slug);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!slugToDelete) return;
    deleteMutation.mutate(slugToDelete, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSlugToDelete(null);
      },
      onError: (err) => {
        setDeleteError(
          toFriendlyErrorMessage(err) || "Failed to delete form.",
        );
      },
    });
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const createMutation = useCreateForm();

  const handleCreate = (data: CreateFormInput | UpdateFormInput) => {
    createMutation.mutate(data as CreateFormInput, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
      onError: (err) => {
        setMutationError(
          toFriendlyErrorMessage(err) || "Failed to create form.",
        );
      },
    });
  };

  const stats = [
    {
      label: "Total Forms",
      count: totalCount,
      Icon: LuFileText,
      color: "text-white",
    },
    {
      label: "Active",
      count: activeCount,
      Icon: LuCircleCheck,
      color: "text-emerald-500",
    },
    {
      label: "Draft",
      count: draftCount,
      Icon: LuClock,
      color: "text-amber-500",
    },
    {
      label: "Closed",
      count: closedCount,
      Icon: LuCircleX,
      color: "text-red-500",
    },
  ];

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <LuFileText className="text-white" size={28} /> Form Builder
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create and manage dynamic registration forms for events.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white hover:bg-white/90 text-[#05568D] font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-black/20 transition flex items-center justify-center gap-2 text-sm"
        >
          <GoPlus size={18} /> New Form
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {stats.map(({ label, count, Icon, color }) => (
          <div
            key={label}
            className="bg-[#05568D] p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4"
          >
            <Icon className={color} size={28} />
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          </div>
        ))}
      </section>

      <FormsTable
        forms={forms ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error ? toFriendlyErrorMessage(error) : undefined}
        onRetry={refetch}
        onDelete={triggerDeleteModal}
      />

      <FormDeleteModal
        isOpen={isDeleteModalOpen}
        isPending={deleteMutation.isPending}
        errorMessage={deleteError}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <FormSettingsModal
        isOpen={isCreateModalOpen}
        isEditing={false}
        events={events}
        isPending={createMutation.isPending}
        errorMessage={
          createMutation.error
            ? toFriendlyErrorMessage(createMutation.error)
            : (mutationError ?? undefined)
        }
        onClose={() => {
          setIsCreateModalOpen(false);
          setMutationError(null);
        }}
        onSubmit={handleCreate}
      />

      <ToastNotification
        message={mutationError}
        type="error"
        onClose={() => setMutationError(null)}
      />
    </main>
  );
}

export default FormsDashboard;
