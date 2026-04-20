import { SupplyRequest } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export function RequestHistoryTable({ requests }: { requests: SupplyRequest[] }) {
  if (!requests.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-panel">
        No requests found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Remarks</th>
              <th className="px-4 py-3 font-medium">Rejection reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-4 py-4 font-medium text-slate-900">{request.itemName}</td>
                <td className="px-4 py-4">{request.quantity}</td>
                <td className="px-4 py-4"><StatusBadge status={request.status} /></td>
                <td className="px-4 py-4">{request.remarks || "—"}</td>
                <td className="px-4 py-4">{request.rejectionReason || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
