import { useMemo, useState } from "react";
import { useFeedbackQuery } from "../../../hooks";
import {
  useUpdateFeedbackStatus,
  useDeleteFeedback,
} from "../../../hooks/mutations/useFeedbackMutations";
import { toFriendlyErrorMessage } from "../../../lib/apiError";
import { FeedbackItem, FeedbackStatus } from "../../../service/feedback";

export type { FeedbackItem, FeedbackStatus };
export type FeedbackFilter = "All" | FeedbackStatus;


export const useFeedbackManager = () => {
  const [statusFilter, setStatusFilter] = useState<FeedbackFilter>("unread");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: feedbacks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFeedbackQuery();

  const { mutate: updateStatus } = useUpdateFeedbackStatus();
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();

  const triggerDeleteModal = (id: string) => {
    setFeedbackIdToDelete(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (feedbackIdToDelete === null) return;
    deleteFeedback(
      { id: feedbackIdToDelete },
      {
        onSuccess: () => {
          setDeleteError(null);
          setIsDeleteModalOpen(false);
          setFeedbackIdToDelete(null);
        },
        onError: (err: unknown) => {
          setDeleteError(
            toFriendlyErrorMessage(err) || "Failed to delete feedback.",
          );
        },
      }
    );
  };

  const toggleStatus = (id: string, newStatus: FeedbackStatus) => {
    setMutationError(null);
    updateStatus(
      { id, status: newStatus },
      {
        onError: (err: unknown) => {
          setMutationError(
            toFriendlyErrorMessage(err) || "Failed to update feedback status.",
          );
        },
      }
    );
  };

  const filteredFeedbacks = useMemo(() => {
    const list = Array.isArray(feedbacks) ? feedbacks : [];
    return list.filter((fb: FeedbackItem) => {
      const status = fb.status;
      return statusFilter === "All" || status === statusFilter;
    });
  }, [feedbacks, statusFilter]);

  const totalCount = feedbacks.length;

  const unreadCount = useMemo(() => {
    return feedbacks.filter((f: FeedbackItem) => f.status === "unread").length;
  }, [feedbacks]);

  const resolvedCount = useMemo(() => {
    return feedbacks.filter((f: FeedbackItem) => f.status === "resolved").length;
  }, [feedbacks]);

  const filterCount = filteredFeedbacks.length;

  const filterLabel = useMemo(() => {
    if (statusFilter === "All") return "All";
    return statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
  }, [statusFilter]);

  return {
    statusFilter,
    setStatusFilter,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    triggerDeleteModal,
    confirmDelete,
    toggleStatus,
    feedbacks,
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
    setDeleteError,
  };
};
