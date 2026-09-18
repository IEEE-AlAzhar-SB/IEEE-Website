import { FiImage, FiX } from "react-icons/fi";

import type { SubmitEvent, ChangeEvent } from "react";
import { CurrentMemberFormState, BoardMemberType } from "../hooks/useBoardMembers";
import { BoardMetaResponse } from "../../../service/board";

interface MemberFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentMember: CurrentMemberFormState;
  selectedFile: File | null;
  isPending: boolean;
  errorMessage?: string | null;
  boardMeta?: BoardMetaResponse | null;
  onClose: () => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof CurrentMemberFormState>(
    field: K,
    value: CurrentMemberFormState[K],
  ) => void;
  onFileChange: (file: File | null) => void;
}

const MemberFormModal = ({
  isOpen,
  isEditing,
  currentMember,
  selectedFile,
  isPending,
  errorMessage,
  boardMeta,
  onClose,
  onSubmit,
  onFieldChange,
  onFileChange,
}: MemberFormModalProps) => {
  if (!isOpen) return null;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    if (id === "boardYear") {
      onFieldChange(
        id as keyof CurrentMemberFormState,
        Number.parseInt(value) || 2026,
      );
      return;
    }

    if (id === "memberType") {
      const newType = value as BoardMemberType;
      onFieldChange("memberType", newType);

      const allowedPositions = boardMeta?.allowedPositionsByType[newType];
      const firstPosition = allowedPositions?.[0] ?? "";
      onFieldChange("position", firstPosition);

      onFieldChange("track", "");
      return;
    }

    onFieldChange(id as keyof CurrentMemberFormState, value as never);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange(file);
  };

  const memberTypes = boardMeta?.memberTypes ?? ["officer", "technical", "branding", "operation"];

  const allowedPositions = boardMeta?.allowedPositionsByType[currentMember.memberType] ?? (
    currentMember.memberType === "officer"
      ? ["chair", "vice technical", "vice branding", "secretary", "treasurer"]
      : ["head", "vice"]
  );

  const allowedTracks = boardMeta?.allowedTracksByType[currentMember.memberType] ?? [];
  const trackGroups = boardMeta?.technicalTrackGroups;

  const genders = boardMeta?.genders ?? ["male", "female"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? "Edit Board Member" : "Add New Council Member"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={currentMember.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. Mahmoud Ahmed"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={currentMember.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="test@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="memberType"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Member Type
              </label>
              <select
                id="memberType"
                value={currentMember.memberType}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
              >
                {memberTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="boardYear"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Board Year
              </label>
              <input
                id="boardYear"
                type="number"
                required
                value={currentMember.boardYear}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={currentMember.memberType === "officer" ? "col-span-2" : ""}>
              <label
                htmlFor="position"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Position
              </label>
              <select
                id="position"
                value={currentMember.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
              >
                {allowedPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
            {currentMember.memberType !== "officer" && (
              <div>
                <label
                  htmlFor="track"
                  className="text-xs font-semibold text-slate-300 uppercase block mb-1"
                >
                  Track
                </label>
                {boardMeta ? (
                  <select
                    id="track"
                    value={currentMember.track}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
                  >
                    <option value="">Select a track</option>
                    {currentMember.memberType === "technical" && trackGroups
                      ? Object.entries(trackGroups).map(([group, tracks]) => (
                          <optgroup key={group} label={group}>
                            {tracks.map((track) => (
                              <option key={track} value={track}>
                                {track}
                              </option>
                            ))}
                          </optgroup>
                        ))
                      : allowedTracks.map((track) => (
                          <option key={track} value={track}>
                            {track}
                          </option>
                        ))}
                  </select>
                ) : (
                  <input
                    id="track"
                    type="text"
                    value={currentMember.track}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Front End"
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gender"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                value={currentMember.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="linkedin_url"
                className="text-xs font-semibold text-slate-300 uppercase block mb-1"
              >
                LinkedIn URL
              </label>
              <input
                id="linkedin_url"
                type="url"
                value={currentMember.linkedin_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="text-xs font-semibold text-slate-300 uppercase block mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={currentMember.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#0F172A] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Short biography..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Avatar Image
            </label>
            <div
              className="border border-dashed border-slate-600 rounded-xl p-4 text-center cursor-pointer text-xs text-slate-300 flex flex-col items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 transition"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <FiImage size={24} className="text-slate-500" />
              <span>
                {selectedFile
                  ? selectedFile.name
                  : "Click to select an image file NOT LARGER than 10MB"}
              </span>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl p-3 flex items-center gap-2">
              <FiX className="text-red-400 shrink-0 cursor-pointer" size={16} onClick={() => {}} />
              <span>{errorMessage}</span>
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
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;
