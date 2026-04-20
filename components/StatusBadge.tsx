import { RequestStatus } from "@/lib/types";

const styles: Record<RequestStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}
