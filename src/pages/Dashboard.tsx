import { useState, type SubmitEvent } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { LuShieldCheck, LuMenu } from "react-icons/lu";

import { FeedbackDashboard } from "../pages";
import { SideBarContent } from "../components";
import { signOut } from "../lib/auth-client";
import { toFriendlyErrorMessage, type ApiError } from "../lib/apiError";
import FormsDashboard from "./FormsDashboard";
import FormDetailDashboard from "./FormDetailDashboard";
import {
  useBoardMembers,
  CurrentMemberFormState,
  BoardMember,
  MemberFilters,
  MemberTable,
  MemberFormModal,
  DeleteModal,
  StatsRow,
} from "../features/board";

function Dashboard() {
  const navigate = useNavigate();

  const {
    boardYears,
    typeFilter,
    setTypeFilter,
    yearFilter,
    setYearFilter,
    members,
    totalCount,
    officerCount,
    currentYearCount,
    isLoading,
    isError,
    error,
    refetch,
    createMember,
    updateMember,
    deleteMember,
    isCreating,
    isUpdating,
    isDeleting,
    boardMeta,
  } = useBoardMembers();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentMember, setCurrentMember] = useState<CurrentMemberFormState>({
    name: "",
    email: "",
    bio: "",
    position: "",
    memberType: "officer",
    track: "",
    gender: "male",
    linkedin_url: "",
    boardYear: 2026,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      setFormError("Sign out failed. Please check your connection.");
      return;
    }
    navigate("/login");
  };

  /** Show backend validation detail only for 400s; generic otherwise. */
  const describeMemberError = (err: unknown, fallback: string) => {
    const status = (err as ApiError)?.status;
    if (status === 400 && err instanceof Error) {
      return err.message.slice(0, 300);
    }
    if (err instanceof Error && /avatar|image|large|size/i.test(err.message)) {
      return err.message.slice(0, 300);
    }
    return toFriendlyErrorMessage(err) || fallback;
  };

  const openAddModal = () => {
    setCurrentMember({
      name: "",
      email: "",
      bio: "",
      position: "",
      memberType: "officer",
      track: "",
      gender: "male",
      linkedin_url: "",
      boardYear: 2026,
    });
    setSelectedFile(null);
    setIsEditing(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: BoardMember) => {
    setCurrentMember({
      id: member._id || member.id,
      name: member.name,
      email: member.email,
      bio: member.bio || "",
      position: member.position || "",
      memberType: member.memberType || "officer",
      track: member.track || "",
      gender: member.gender || "male",
      linkedin_url: member.linkedin_url || "",
      boardYear: member.boardYear || 2026,
    });
    setSelectedFile(null);
    setIsEditing(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", currentMember.name);
    if (currentMember.email) {
      formData.append("email", currentMember.email);
    }
    formData.append("bio", currentMember.bio);
    formData.append("position", currentMember.position);
    formData.append("memberType", currentMember.memberType);
    if (currentMember.memberType !== "officer") {
      formData.append("track", currentMember.track);
    }
    formData.append("gender", currentMember.gender);
    if (currentMember.linkedin_url) {
      formData.append("linkedin_url", currentMember.linkedin_url);
    }
    formData.append("boardYear", currentMember.boardYear.toString());

    if (selectedFile) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (
        !allowed.includes(selectedFile.type) ||
        selectedFile.size > 10 * 1024 * 1024
      ) {
        setFormError("Avatar must be a JPEG, PNG, or WebP image under 10MB.");
        return;
      }
      formData.append("avatar", selectedFile);
    }

    if (isEditing && currentMember.id) {
      updateMember(
        { id: currentMember.id, formData },
        {
          onSuccess: () => {
            setFormError(null);
            setIsModalOpen(false);
          },
          onError: (err: unknown) => {
            setFormError(describeMemberError(err, "Failed to update member."));
          },
        },
      );
    } else {
      createMember(
        { formData },
        {
          onSuccess: () => {
            setFormError(null);
            setIsModalOpen(false);
          },
          onError: (err: unknown) => {
            setFormError(
              describeMemberError(err, "Failed to create member."),
            );
          },
        },
      );
    }
  };

  const handleFieldChange = <K extends keyof CurrentMemberFormState>(
    field: K,
    value: CurrentMemberFormState[K],
  ) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setFormError("Avatar must be a JPEG, PNG, or WebP image.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormError("Avatar must not be larger than 10MB.");
        setSelectedFile(null);
        return;
      }
      setFormError(null);
    }
    setSelectedFile(file);
  };

  const triggerDeleteModal = (id: string) => {
    setMemberIdToDelete(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!memberIdToDelete) return;

    deleteMember(
      { id: memberIdToDelete },
      {
        onSuccess: () => {
          setDeleteError(null);
          setIsDeleteModalOpen(false);
          setMemberIdToDelete(null);
        },
        onError: (err: unknown) => {
          setDeleteError(
            describeMemberError(err, "Failed to delete member."),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#033e66] text-slate-100 font-sans flex relative">
      <aside className="w-64 bg-[#05568D] border-r border-slate-700/50 p-6 hidden md:block shrink-0 h-screen sticky top-0">
        <SideBarContent
          sideBarOnclick={() => setIsMobileMenuOpen(false)}
          handleLogOut={handleLogout}
        />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] md:hidden flex">
          <button
            type="button"
            aria-label="Close mobile menu"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-64 bg-[#05568D] border-r border-slate-700 h-full p-6 flex flex-col animate-in slide-in-from-left duration-200">
            <SideBarContent
              sideBarOnclick={() => setIsMobileMenuOpen(false)}
              handleLogOut={handleLogout}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 bg-[#05568D] border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <LuShieldCheck className="text-white" size={20} />
            <span className="font-bold text-xs text-white">IEEE Panel</span>
          </div>
          <button
            className="p-2 text-slate-400 hover:text-white bg-[#033e66] rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <LuMenu size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <main className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
                  <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                        Board Members
                      </h1>
                      <p className="text-slate-400 text-sm mt-1">
                        Manage and update the IEEE student branch council
                        records.
                      </p>
                    </div>
                    <button
                      onClick={openAddModal}
                      className="bg-white hover:bg-white/90 text-[#05568D] font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-black/20 transition flex items-center justify-center gap-2 text-sm self-start sm:self-auto"
                    >
                      <GoPlus size={16} /> Add Member
                    </button>
                  </header>

                  <StatsRow
                    totalCount={totalCount}
                    officerCount={officerCount}
                    currentYearCount={currentYearCount}
                  />

                  <MemberFilters
                    boardYears={boardYears}
                    typeFilter={typeFilter}
                    yearFilter={yearFilter}
                    onTypeChange={setTypeFilter}
                    onYearChange={setYearFilter}
                    recordCount={members.length}
                  />

                  <MemberTable
                    members={members}
                    isLoading={isLoading}
                    isError={isError}
                    errorMessage={
                      error ? toFriendlyErrorMessage(error) : undefined
                    }
                    onRetry={refetch}
                    onEdit={openEditModal}
                    onDelete={triggerDeleteModal}
                  />
                </main>
              }
            />
            <Route path="/feedback" element={<FeedbackDashboard />} />
            <Route path="/forms" element={<FormsDashboard />} />
            <Route path="/forms/:slug" element={<FormDetailDashboard />} />
          </Routes>
        </div>
      </div>

      <MemberFormModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        currentMember={currentMember}
        selectedFile={selectedFile}
        isPending={isCreating || isUpdating}
        errorMessage={formError}
        boardMeta={boardMeta}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveMember}
        onFieldChange={handleFieldChange}
        onFileChange={handleFileChange}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        isPending={isDeleting}
        errorMessage={deleteError}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Dashboard;
