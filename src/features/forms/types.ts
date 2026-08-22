export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FormFieldErrorMessages {
  required?: string;
  pattern?: string;
  minLength?: string;
  maxLength?: string;
  min?: string;
  max?: string;
}

export interface CommitteeRegistration {
  section: string;
  committee: string;
  role: string;
}

export interface FormField {
  key: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | "committeeSelector";
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options: string[];
  order: number;
  isSystem: boolean;
  validation?: FormFieldValidation;
  errorMessages?: FormFieldErrorMessages;
}

export type FormStatus = "draft" | "active" | "closed";

export interface PublicFormDTO {
  slug: string;
  title: string;
  description: string;
  status: FormStatus;
  opensAt: string | null;
  closesAt: string | null;
  fields: FormField[];
  submittable: boolean;
  capacityReached: boolean;
}

export interface AdminFormDTO {
  slug: string;
  title: string;
  description: string;
  status: FormStatus;
  opensAt: string | null;
  closesAt: string | null;
  submissionLimit: number | null;
  currentSubmissionCount: number;
  fields: FormField[];
  sanityEventId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  formSlug: string;
  submitterEmail: string;
  data: Record<string, unknown>;
  submittedAt: string;
}

export interface SubmissionsResponse {
  submissions: FormSubmission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExportResponse {
  formTitle: string;
  columns: { key: string; label: string; isSystem: boolean }[];
  submissions: FormSubmission[];
  total: number;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  opensAt?: string;
  closesAt?: string;
  submissionLimit?: number;
  sanityEventId?: string;
}

export interface UpdateFormInput {
  title?: string;
  description?: string;
  opensAt?: string;
  closesAt?: string;
  submissionLimit?: number;
}

export interface AddFieldInput {
  type: FormField["type"];
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  validation?: FormFieldValidation;
  errorMessages?: FormFieldErrorMessages;
}

export interface UpdateFieldInput {
  label?: string;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  order?: number;
  errorMessages?: FormFieldErrorMessages;
}
