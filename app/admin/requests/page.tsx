"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { InventoryTable } from "@/components/InventoryTable";
import { LoadingState } from "@/components/LoadingState";
import { RequestsTable } from "@/components/RequestsTable";
import { SuccessMessage } from "@/components/SuccessMessage";
import { ApiResponse, InventoryItem, SupplyRequest } from "@/lib/types";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionRequestId, setActionRequestId] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const requestsUrl = filter === "pending" ? "/api/requests?status=Pending" : "/api/requests";
      const [requestsResponse, inventoryResponse] = await Promise.all([
        fetch(requestsUrl, { cache: "no-store" }),
        fetch("/api/inventory", { cache: "no-store" }),
      ]);

      const requestsResult = (await requestsResponse.json()) as ApiResponse<SupplyRequest[]>;
      const inventoryResult = (await inventoryResponse.json()) as ApiResponse<InventoryItem[]>;

      if (!requestsResponse.ok || !requestsResult.success) {
        throw new Error(requestsResult.message || requestsResult.error || "Failed to load requests.");
      }

      if (!inventoryResponse.ok || !inventoryResult.success) {
        throw new Error(inventoryResult.message || inventoryResult.error || "Failed to load inventory.");
      }

      setRequests(requestsResult.data);
      setInventory(inventoryResult.data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter((request) => request.status === "Pending").length,
    };
  }, [requests]);

  async function handleApprove(requestId: string) {
    setActionRequestId(requestId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/requests/${requestId}/approve`, { method: "PATCH" });
      const result = (await response.json()) as ApiResponse<SupplyRequest>;

      if (!response.ok || !result.success) {
        setError(result.message || result.error || "Failed to approve request.");
        return;
      }

      setSuccess(result.message || "Request approved successfully.");
      await loadData();
    } catch {
      setError("Could not approve the request.");
    } finally {
      setActionRequestId("");
    }
  }

  async function handleReject(requestId: string, reason?: string) {
    setActionRequestId(requestId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: reason ?? "" }),
      });
      const result = (await response.json()) as ApiResponse<SupplyRequest>;

      if (!response.ok || !result.success) {
        setError(result.message || result.error || "Failed to reject request.");
        return;
      }

      setSuccess(result.message || "Request rejected successfully.");
      await loadData();
    } catch {
      setError("Could not reject the request.");
    } finally {
      setActionRequestId("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Request management</h1>
            <p className="mt-2 text-sm text-slate-600">Approve valid requests, reject when needed, and keep inventory in sync.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              All ({summary.all})
            </button>
            <button
              type="button"
              onClick={() => setFilter("pending")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === "pending" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Pending ({summary.pending})
            </button>
          </div>
        </div>
      </section>

      {success ? <SuccessMessage message={success} /> : null}
      {loading ? <LoadingState label="Loading requests and inventory..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          <RequestsTable
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
            actionRequestId={actionRequestId}
          />
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Live inventory snapshot</h2>
              <p className="mt-2 text-sm text-slate-600">Inventory refreshes after each approve or reject action.</p>
            </div>
            <InventoryTable items={inventory} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
