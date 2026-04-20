"use client";

import { useEffect, useState } from "react";
import { ApiResponse, SupplyRequest } from "@/lib/types";
import { SuccessMessage } from "@/components/SuccessMessage";

type RequestFormProps = {
  title?: string;
  description?: string;
  onSubmitted?: (request: SupplyRequest, identity: { employeeName: string }) => void;
};

export function RequestForm({
  title = "Submit a supply request",
  description = "Fill in the item details below. New requests start in Pending status.",
  onSubmitted,
}: RequestFormProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedName = window.localStorage.getItem("office-employee-name") ?? "";
    setEmployeeName(savedName);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedItemName = itemName.trim();
    const trimmedEmployeeName = employeeName.trim();

    if (!trimmedItemName) {
      setError("Item name is required.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName: trimmedEmployeeName,
          itemName: trimmedItemName,
          quantity,
          remarks: remarks.trim(),
        }),
      });

      const result = (await response.json()) as ApiResponse<SupplyRequest>;

      if (!response.ok || !result.success) {
        setError(result.message || result.error || "Failed to submit request.");
        return;
      }

      window.localStorage.setItem("office-employee-name", trimmedEmployeeName);
      setSuccess(result.message || "Request submitted successfully.");
      setItemName("");
      setQuantity(1);
      setRemarks("");
      onSubmitted?.(result.data, { employeeName: trimmedEmployeeName });
    } catch {
      setError("Could not submit the request right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Your name (optional)</label>
          <input
            value={employeeName}
            onChange={(event) => setEmployeeName(event.target.value)}
            placeholder="Aseem"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Item name</label>
          <input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="Whiteboard Marker"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            rows={4}
            placeholder="For meeting room B"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-slate-500"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {success ? <SuccessMessage message={success} /> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </section>
  );
}
