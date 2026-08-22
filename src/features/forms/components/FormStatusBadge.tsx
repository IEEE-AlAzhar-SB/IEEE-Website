import type { FormStatus } from "../types";

const statusStyles: Record<FormStatus, string> = {
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const FormStatusBadge = ({ status }: { status: FormStatus }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles[status]}`}
  >
    {status}
  </span>
);

export default FormStatusBadge;
