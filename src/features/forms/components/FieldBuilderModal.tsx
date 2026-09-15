import { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import type { FormField, AddFieldInput, UpdateFieldInput } from "../types";

type FieldType = FormField["type"];

interface FieldBuilderModalProps {
  isOpen: boolean;
  isEditing: boolean;
  field?: FormField | null;
  isPending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onAdd?: (input: AddFieldInput) => void;
  onUpdate?: (input: UpdateFieldInput) => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "committeeSelector", label: "Committee Selector" },
];

export default function FieldBuilderModal({
  isOpen,
  isEditing,
  field,
  isPending,
  errorMessage,
  onClose,
  onAdd,
  onUpdate,
}: FieldBuilderModalProps) {
  const [type, setType] = useState<FieldType>("text");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [helpText, setHelpText] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [pattern, setPattern] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [errMsgRequired, setErrMsgRequired] = useState("");
  const [errMsgPattern, setErrMsgPattern] = useState("");
  const [errMsgMinLength, setErrMsgMinLength] = useState("");
  const [errMsgMaxLength, setErrMsgMaxLength] = useState("");
  const [errMsgMin, setErrMsgMin] = useState("");
  const [errMsgMax, setErrMsgMax] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (isEditing && field) {
        setType(field.type);
        setLabel(field.label);
        setRequired(field.required);
        setPlaceholder(field.placeholder ?? "");
        setHelpText(field.helpText ?? "");
        setOptions(field.options ? [...field.options] : []);
        setMinLength(field.validation?.minLength?.toString() ?? "");
        setMaxLength(field.validation?.maxLength?.toString() ?? "");
        setPattern(field.validation?.pattern ?? "");
        setMin(field.validation?.min?.toString() ?? "");
        setMax(field.validation?.max?.toString() ?? "");
        setErrMsgRequired(field.errorMessages?.required ?? "");
        setErrMsgPattern(field.errorMessages?.pattern ?? "");
        setErrMsgMinLength(field.errorMessages?.minLength ?? "");
        setErrMsgMaxLength(field.errorMessages?.maxLength ?? "");
        setErrMsgMin(field.errorMessages?.min ?? "");
        setErrMsgMax(field.errorMessages?.max ?? "");
      } else {
        setType("text");
        setLabel("");
        setRequired(false);
        setPlaceholder("");
        setHelpText("");
        setOptions([]);
        setNewOption("");
        setMinLength("");
        setMaxLength("");
        setPattern("");
        setMin("");
        setMax("");
        setErrMsgRequired("");
        setErrMsgPattern("");
        setErrMsgMinLength("");
        setErrMsgMaxLength("");
        setErrMsgMin("");
        setErrMsgMax("");
      }
      setNewOption("");
    }
  }, [isOpen, isEditing, field]);

  useEffect(() => {
    if (!isEditing && type === "committeeSelector" && options.length === 0) {
      setOptions(["Head", "Vice", "Member"]);
    }
  }, [type, isEditing]);

  if (!isOpen) return null;

  const hasOptions =
    type === "select" ||
    type === "radio" ||
    type === "checkbox" ||
    type === "committeeSelector";
  const isTextType =
    type === "text" ||
    type === "email" ||
    type === "tel" ||
    type === "textarea";

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions((prev) => [...prev, trimmed]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const errorMessages: Record<string, string> = {};
    if (isTextType) {
      if (errMsgMinLength) errorMessages.minLength = errMsgMinLength;
      if (errMsgMaxLength) errorMessages.maxLength = errMsgMaxLength;
      if (errMsgPattern) errorMessages.pattern = errMsgPattern;
    }
    if (type === "number") {
      if (errMsgMin) errorMessages.min = errMsgMin;
      if (errMsgMax) errorMessages.max = errMsgMax;
    }
    if (errMsgRequired) errorMessages.required = errMsgRequired;
    const errorMessagesOut =
      Object.keys(errorMessages).length > 0 ? errorMessages : undefined;

    if (isEditing) {
      onUpdate?.({
        label: label.trim(),
        placeholder,
        helpText,
        options,
        errorMessages: errorMessagesOut,
      });
    } else {
      const validation: Record<string, unknown> = {};
      if (isTextType) {
        if (minLength) validation.minLength = Number(minLength);
        if (maxLength) validation.maxLength = Number(maxLength);
        if (pattern) validation.pattern = pattern;
      }
      if (type === "number") {
        if (min) validation.min = Number(min);
        if (max) validation.max = Number(max);
      }

      onAdd?.({
        type,
        label: label.trim(),
        required,
        placeholder,
        helpText,
        options: hasOptions ? options : [],
        validation: Object.keys(validation).length > 0 ? validation : undefined,
        errorMessages: errorMessagesOut,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#05568D] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Field" : "Add New Field"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl p-3 mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Field Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FieldType)}
                className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
              >
                {FIELD_TYPES.map((ft) => (
                  <option key={ft.value} value={ft.value}>
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Full Name"
              className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
              required
            />
          </div>

          {!isEditing && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="field-required"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-[#033e66] text-[#05568D] focus:ring-[#05568D]"
              />
              <label
                htmlFor="field-required"
                className="text-sm text-slate-300 select-none"
              >
                Required
              </label>
            </div>
          )}

          {type !== "committeeSelector" && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Optional placeholder text"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Help Text
                </label>
                <input
                  type="text"
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  placeholder="Optional helper text below the field"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Required Error Message
            </label>
            <input
              type="text"
              value={errMsgRequired}
              onChange={(e) => setErrMsgRequired(e.target.value)}
              placeholder="e.g. This field is required"
              className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
            />
          </div>

          {hasOptions && (
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Options
              </label>
              {options.length > 0 && (
                <div className="space-y-2 mb-3">
                  {options.map((opt, index) => (
                    <div
                      key={`${opt}-${index}`}
                      className="flex items-center gap-2 bg-[#033e66] border border-slate-600 rounded-xl px-3 py-2"
                    >
                      <span className="text-sm text-white flex-1 truncate">
                        {opt}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-1 text-slate-400 hover:text-red-400 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  placeholder="New option"
                  className="flex-1 px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={!newOption.trim()}
                  className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-xl text-sm hover:bg-slate-600 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FiPlus size={14} />
                  Add
                </button>
              </div>
            </div>
          )}

          {isTextType && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Min Length
                </label>
                <input
                  type="number"
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                  placeholder="Min"
                  min={0}
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  placeholder="Max"
                  min={0}
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Pattern
                </label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g. ^[A-Za-z]+$"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div className="col-span-2 mt-2 border-t border-slate-600 pt-3">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  Error Messages
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Min Length Error
                </label>
                <input
                  type="text"
                  value={errMsgMinLength}
                  onChange={(e) => setErrMsgMinLength(e.target.value)}
                  placeholder="e.g. Too short"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Max Length Error
                </label>
                <input
                  type="text"
                  value={errMsgMaxLength}
                  onChange={(e) => setErrMsgMaxLength(e.target.value)}
                  placeholder="e.g. Too long"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Pattern Error
                </label>
                <input
                  type="text"
                  value={errMsgPattern}
                  onChange={(e) => setErrMsgPattern(e.target.value)}
                  placeholder="e.g. Invalid format"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
            </div>
          )}

          {type === "number" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Min Value
                </label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Min"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Max Value
                </label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Max"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div className="col-span-2 mt-2 border-t border-slate-600 pt-3">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  Error Messages
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Min Value Error
                </label>
                <input
                  type="text"
                  value={errMsgMin}
                  onChange={(e) => setErrMsgMin(e.target.value)}
                  placeholder="e.g. Value too low"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                  Max Value Error
                </label>
                <input
                  type="text"
                  value={errMsgMax}
                  onChange={(e) => setErrMsgMax(e.target.value)}
                  placeholder="e.g. Value too high"
                  className="w-full px-4 py-2.5 bg-[#033e66] border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-[#05568D]"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !label.trim()}
              className="px-5 py-2 bg-white text-[#05568D] rounded-xl text-sm font-semibold hover:bg-white/90 shadow-lg shadow-black/20 transition disabled:opacity-50"
            >
              {isPending
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
