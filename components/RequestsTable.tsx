"use client";

import { useState } from "react";
import { SupplyRequest } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { RejectReasonModal } from "@/components/RejectReasonModal";

type RequestsTableProps = {
  requests: SupplyRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string, reason?: string) => Promise<void>;
  actionRequestId?: string;
};

export function RequestsTable({ requests, onApprove, onReject, actionRequestId }: RequestsTableProps) {
  const [rejectTarget, setRejectTarget] = useState<SupplyRequest | null>(null);

  if (!requests.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-panel">
        No requests available.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Remarks</th>
                <th className="px-4 py-3 font-medium">Rejection reason</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {requests.map((request) => {
                const busy = actionRequestId === request._id;
                const processed = request.status !== "Pending";

                return (
                  <tr key={request._id}>
                    <td className="px-4 py-4">{request.employeeName || "Employee"}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{request.itemName}</td>
                    <td className="px-4 py-4">{request.quantity}</td>
                    <td className="px-4 py-4"><StatusBadge status={request.status} /></td>
                    <td className="px-4 py-4">{request.remarks || "—"}</td>
                    <td className="px-4 py-4">{request.rejectionReason || "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={processed || busy}
                          onClick={() => onApprove(request._id)}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {busy ? "Working..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={processed || busy}
                          onClick={() => setRejectTarget(request)}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RejectReasonModal
        open={Boolean(rejectTarget)}
        requestItemName={rejectTarget?.itemName}
        onClose={() => setRejectTarget(null)}
        onConfirm={async (reason) => {
          if (!rejectTarget) {
            return;
          }

          await onReject(rejectTarget._id, reason);
          setRejectTarget(null);
        }}
      />
    </>
  );
}
