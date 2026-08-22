import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useBoardMetaQuery } from "../../../hooks/queries/useBoardMetaQuery";
import type { FormField, CommitteeRegistration } from "../types";

interface CommitteeSelectorFieldProps {
  field: FormField;
  value: CommitteeRegistration[];
  onChange: (entries: CommitteeRegistration[]) => void;
}

const EMPTY_ENTRY: CommitteeRegistration = {
  section: "",
  committee: "",
  role: "",
};

const selectClass =
  "w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#05568D]/40 focus:border-[#05568D] transition duration-200 bg-white";

const CommitteeSelectorField = ({
  field,
  value,
  onChange,
}: CommitteeSelectorFieldProps) => {
  const { data: boardMeta, isLoading } = useBoardMetaQuery();

  const sections = ["technical", "branding", "operation"];

  const getCommitteeOptions = (section: string): string[] => {
    if (!section || !boardMeta) return [];
    if (section === "officer") {
      return boardMeta.allowedPositionsByType["officer"] ?? [];
    }
    return boardMeta.allowedTracksByType[section] ?? [];
  };

  const handleSectionChange = (index: number, section: string) => {
    const committeeOptions = getCommitteeOptions(section);
    const next = value.map((entry, i) =>
      i === index
        ? { ...entry, section, committee: committeeOptions[0] ?? "", role: "" }
        : entry,
    );
    onChange(next);
  };

  const handleCommitteeChange = (index: number, committee: string) => {
    const next = value.map((entry, i) =>
      i === index ? { ...entry, committee, role: "" } : entry,
    );
    onChange(next);
  };

  const handleRoleChange = (index: number, role: string) => {
    const next = value.map((entry, i) =>
      i === index ? { ...entry, role } : entry,
    );
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...value, { ...EMPTY_ENTRY }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {value.map((entry, index) => {
        const committeeOptions = getCommitteeOptions(entry.section);
        return (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-2 items-end border border-gray-200 rounded-xl p-3"
          >
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Section
              </label>
              <select
                value={entry.section}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                className={selectClass}
              >
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Committee
              </label>
              <select
                value={entry.committee}
                onChange={(e) => handleCommitteeChange(index, e.target.value)}
                disabled={!entry.section}
                className={selectClass}
              >
                <option value="">
                  {entry.section ? "Select committee" : "Select section first"}
                </option>
                {entry.section === "technical" &&
                boardMeta?.technicalTrackGroups
                  ? Object.entries(boardMeta.technicalTrackGroups).map(
                      ([group, tracks]) => (
                        <optgroup key={group} label={group}>
                          {tracks
                            .filter((t) => committeeOptions.includes(t))
                            .map((track) => (
                              <option key={track} value={track}>
                                {track}
                              </option>
                            ))}
                        </optgroup>
                      ),
                    )
                  : committeeOptions.map((committee) => (
                      <option key={committee} value={committee}>
                        {committee}
                      </option>
                    ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Role
              </label>
              <select
                value={entry.role}
                onChange={(e) => handleRoleChange(index, e.target.value)}
                disabled={!entry.section}
                className={selectClass}
              >
                <option value="">
                  {entry.section ? "Select role" : "Select section first"}
                </option>
                {field.options.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-3 text-slate-400 hover:text-red-500 transition shrink-0"
              aria-label="Remove affiliation"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm hover:bg-slate-200 transition"
      >
        <FiPlus size={14} />
        Add affiliation
      </button>

      {field.required && value.length === 0 && (
        <p className="text-xs text-red-600">
          At least one affiliation is required.
        </p>
      )}
    </div>
  );
};

export default CommitteeSelectorField;
