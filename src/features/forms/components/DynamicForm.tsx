import { useState, type ChangeEvent, type FormEvent } from "react";
import type { PublicFormDTO, FormField, CommitteeRegistration } from "../types";
import CommitteeSelectorField from "./CommitteeSelectorField";

interface DynamicFormProps {
  form: PublicFormDTO;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const buildInitialValues = (fields: FormField[]): Record<string, unknown> => {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "checkbox" || field.type === "committeeSelector") {
      values[field.key] = [];
    } else {
      values[field.key] = "";
    }
  }
  return values;
};

const DynamicForm = ({ form, onSubmit }: DynamicFormProps) => {
  const [values, setValues] = useState<Record<string, unknown>>(
    () => buildInitialValues(form.fields),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [locked, setLocked] = useState(false);

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = sortedFields.find((f) => f.key === name);
    if (!field) return;
    clearFieldError(name);

    if (field.type === "number") {
      setValues((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (key: string, option: string) => {
    clearFieldError(key);
    setValues((prev) => {
      const current = (prev[key] as string[]) ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  };

  const handleCommitteeChange = (
    key: string,
    entries: CommitteeRegistration[],
  ) => {
    clearFieldError(key);
    setValues((prev) => ({ ...prev, [key]: entries }));
  };

  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required) {
      if (field.type === "committeeSelector") {
        if (!(value as CommitteeRegistration[]).length) {
          return field.errorMessages?.required || "This field is required.";
        }
      } else if (field.type === "checkbox") {
        if (!(value as string[]).length) {
          return field.errorMessages?.required || "This field is required.";
        }
      } else if (value === "" || value == null) {
        return field.errorMessages?.required || "This field is required.";
      }
    }

    if (field.validation && value !== "" && value != null) {
      if (field.type === "number" || field.type === "date") {
        const num = Number(value);
        if (field.validation.min != null && num < field.validation.min) {
          return (
            field.errorMessages?.min ||
            `Minimum value is ${field.validation.min}.`
          );
        }
        if (field.validation.max != null && num > field.validation.max) {
          return (
            field.errorMessages?.max ||
            `Maximum value is ${field.validation.max}.`
          );
        }
      }
      if (typeof value === "string") {
        if (
          field.validation.minLength != null &&
          value.length < field.validation.minLength
        ) {
          return (
            field.errorMessages?.minLength ||
            `Minimum length is ${field.validation.minLength}.`
          );
        }
        if (
          field.validation.maxLength != null &&
          value.length > field.validation.maxLength
        ) {
          return (
            field.errorMessages?.maxLength ||
            `Maximum length is ${field.validation.maxLength}.`
          );
        }
        if (
          field.validation.pattern &&
          !new RegExp(field.validation.pattern).test(value)
        ) {
          return field.errorMessages?.pattern || "Invalid format.";
        }
      }
    }

    return null;
  };

  const clearFieldError = (key: string) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const errors: Record<string, string> = {};
    for (const field of sortedFields) {
      const msg = validateField(field, values[field.key]);
      if (msg) errors[field.key] = msg;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(values);
      setFieldErrors({});
      setSuccess(true);
    } catch (err: unknown) {
      const status = (err as Error & { status?: number }).status;
      let message =
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.";

      if (status === 409) {
        message = "You have already registered with this email.";
        setLocked(true);
      } else if (status === 410) {
        message = "Registration is closed.";
        setLocked(true);
      } else if (status === 403) {
        message = "Registration has not opened yet.";
        setLocked(true);
      } else if (status === 429) {
        message = "Too many attempts, try again later.";
      }

      if (status === 400 || status == null) {
        const apiFieldErrors: Record<string, string> = {};
        const parts = message.split("; ");
        for (const part of parts) {
          const colonIdx = part.indexOf(":");
          if (colonIdx > 0) {
            const key = part.substring(0, colonIdx).trim();
            if (sortedFields.some((f) => f.key === key)) {
              apiFieldErrors[key] = part.substring(colonIdx + 1).trim();
            }
          }
        }
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors(apiFieldErrors);
        }
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 text-sm">
          Thank you for registering. We'll be in touch soon.
        </p>
      </div>
    );
  }

  if (!form.submittable) {
    let message = "Registration is not available at this time.";
    if (form.status === "closed") message = "This registration is closed.";
    else if (form.status === "draft") message = "This registration has not opened yet.";
    else if (form.capacityReached) message = "This registration is full.";

    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sortedFields.map((field) => {
        const baseClass =
          "w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#05568D]/40 focus:border-[#05568D] transition duration-200";

        return (
          <div key={field.key}>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              {field.label} {field.required && <span className="text-red-600">*</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                name={field.key}
                required={field.required}
                placeholder={field.placeholder}
                value={(values[field.key] as string) ?? ""}
                onChange={handleChange}
                rows={4}
                minLength={field.validation?.minLength}
                maxLength={field.validation?.maxLength}
                className={`${baseClass} resize-none`}
              />
            ) : field.type === "select" ? (
              <select
                name={field.key}
                required={field.required}
                value={(values[field.key] as string) ?? ""}
                onChange={handleChange}
                className={`${baseClass} bg-white`}
              >
                <option value="">{field.placeholder || "Select an option"}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="flex flex-col gap-2 mt-1">
                {field.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name={field.key}
                      value={opt}
                      checked={values[field.key] === opt}
                      onChange={handleChange}
                      required={field.required}
                      className="text-[#05568D] focus:ring-[#05568D]/40"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : field.type === "date" ? (
              <input
                type="date"
                name={field.key}
                required={field.required}
                placeholder={field.placeholder}
                value={(values[field.key] as string) ?? ""}
                onChange={handleChange}
                min={field.validation?.min}
                max={field.validation?.max}
                className={baseClass}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex flex-col gap-2 mt-1">
                {field.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={((values[field.key] as string[]) ?? []).includes(opt)}
                      onChange={() => handleCheckboxChange(field.key, opt)}
                      className="text-[#05568D] focus:ring-[#05568D]/40 rounded"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : field.type === "committeeSelector" ? (
              <CommitteeSelectorField
                field={field}
                value={(values[field.key] as CommitteeRegistration[]) ?? []}
                onChange={(entries) =>
                  handleCommitteeChange(field.key, entries)
                }
              />
            ) : (
              <input
                type={field.type}
                name={field.key}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.key] as string | number}
                onChange={handleChange}
                minLength={field.validation?.minLength}
                maxLength={field.validation?.maxLength}
                pattern={field.validation?.pattern}
                min={field.validation?.min}
                max={field.validation?.max}
                className={baseClass}
              />
            )}

            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}

            {fieldErrors[field.key] && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors[field.key]}</p>
            )}
          </div>
        );
      })}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting || locked}
          className="bg-[#05568D] text-white px-8 py-2.5 rounded-full hover:bg-[#033e66] active:scale-95 transition-all duration-300 font-semibold shadow-md hover:shadow-lg w-full sm:w-auto disabled:opacity-50"
        >
          {submitting ? "Submitting..." : locked ? "Registration Unavailable" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
