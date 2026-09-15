import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { ErrorBanner, TableSkeleton, CloudinaryImage } from "../../../components";
import { BoardMember } from "../hooks/useBoardMembers";

interface MemberTableProps {
  members: BoardMember[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onEdit: (member: BoardMember) => void;
  onDelete: (id: string) => void;
}

const MemberTable = ({
  members,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
}: MemberTableProps) => {
  if (isError) {
    return (
      <ErrorBanner
        message={errorMessage || "Failed to load board members."}
        onRetry={onRetry}
      />
    );
  }

  return (
    <section className="bg-[#05568D] rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
      {isLoading ? (
        <TableSkeleton cols={5} rows={5} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#033e66] border-b border-slate-700/50 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-4 px-6">Member Info</th>
                <th className="py-4 px-6">Position / Track</th>
                <th className="py-4 px-6">Classification</th>
                <th className="py-4 px-6">Board Year</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-sm">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member._id || member.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      {member.image_public_id ? (
                        <CloudinaryImage
                          publicId={member.image_public_id}
                          sizes="36px"
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600"
                        />
                      ) : (
                        <img
                          src={
                            member.image_url ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          }
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600"
                        />
                      )}
                      <span className="font-semibold text-white">
                        {member.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex flex-col">
                        <span>{member.position || "-"}</span>
                        {member.track && (
                          <span className="text-xs text-slate-500">
                            {member.track}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          member.memberType === "officer"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : member.memberType === "technical"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-slate-600/20 text-slate-400"
                        }`}
                      >
                        {member.memberType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {member.boardYear}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => onEdit(member)}
                          className="p-1.5 hover:bg-white/10 text-white/80 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            onDelete(member._id || member.id || "")
                          }
                          className="p-1.5 hover:bg-red-500/10 text-red-400 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MemberTable;
