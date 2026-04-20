"use client";

import { useEffect, useState } from "react";

type RejectReasonModalProps = {
  open: boolean;
  requestItemName?: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
};

export function RejectReasonModal({
  open,
  requestItemName,
  onClose,
  onConfirm,
}: RejectReasonModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason("");
      setLoading(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleConfirm() {
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">Reject request</h3>
        <p className="mt-2 text-sm text-slate-600">
          Add an optional reason for rejecting {requestItemName ? <span className="font-medium">{requestItemName}</span> : "this request"}.
        </p>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={5}
          placeholder="Out of stock"
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-slate-500"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {loading ? "Rejecting..." : "Confirm rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}
