import { LuMessageSquare } from "react-icons/lu";
import {
  ErrorBanner,
  FeedbackCardSkeleton,
  FeedbackFilterBarSkeleton,
  FeedbackStatsRowSkeleton,
} from "../components";
import {
  FeedbackCard,
  FeedbackDeleteModal,
  FeedbackFilterBar,
  FeedbackStatsRow,
  useFeedbackManager,
} from "../features/feedback";
import { ToastNotification } from "../components";

function FeedbackDashboard() {
  const {
    statusFilter,
    setStatusFilter,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    triggerDeleteModal,
    confirmDelete,
    toggleStatus,
    filteredFeedbacks,
    totalCount,
    unreadCount,
    resolvedCount,
    filterCount,
    filterLabel,
    isLoading,
    isError,
    error,
    refetch,
    isDeleting,
    mutationError,
    setMutationError,
    deleteError,
  } = useFeedbackManager();

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      <header className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <LuMessageSquare className="text-blue-500" size={28} /> Users Feedback
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, analyze and manage the suggestions and inquiries submitted by
          visitors and members.
        </p>
      </header>

      {isLoading ? (
        <FeedbackStatsRowSkeleton />
      ) : (
        <FeedbackStatsRow
          totalCount={totalCount}
          unreadCount={unreadCount}
          resolvedCount={resolvedCount}
          filterLabel={filterLabel}
          filterCount={filterCount}
        />
      )}

      {isLoading ? (
        <FeedbackFilterBarSkeleton />
      ) : (
        <FeedbackFilterBar
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          recordCount={filterCount}
        />
      )}

      {isError && (
        <ErrorBanner
          message={error?.message || "Failed to load feedbacks."}
          onRetry={refetch}
        />
      )}

      <section className="space-y-4">
        {isLoading && (
          <>
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
          </>
        )}

        {!isLoading && filteredFeedbacks.length === 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 text-slate-500">
            No feedback found matching the criteria.
          </div>
        )}

        {filteredFeedbacks.length > 0 &&
          filteredFeedbacks.map((fb) => (
            <FeedbackCard
              key={fb.id}
              feedback={fb}
              onStatusChange={toggleStatus}
              onDelete={triggerDeleteModal}
            />
          ))}
      </section>

      <FeedbackDeleteModal
        isOpen={isDeleteModalOpen}
        isPending={isDeleting}
        errorMessage={deleteError}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <ToastNotification
        message={mutationError}
        type="error"
        onClose={() => setMutationError(null)}
      />
    </main>
  );
}

export default FeedbackDashboard;
