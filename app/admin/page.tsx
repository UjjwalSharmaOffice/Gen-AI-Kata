"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ApiResponse, InventoryItem, SupplyRequest } from "@/lib/types";

export default function AdminDashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [inventoryResponse, requestsResponse] = await Promise.all([
        fetch("/api/inventory", { cache: "no-store" }),
        fetch("/api/requests", { cache: "no-store" }),
      ]);

      const inventoryResult = (await inventoryResponse.json()) as ApiResponse<InventoryItem[]>;
      const requestsResult = (await requestsResponse.json()) as ApiResponse<SupplyRequest[]>;

      if (!inventoryResponse.ok || !inventoryResult.success) {
        throw new Error(inventoryResult.message || inventoryResult.error || "Failed to load inventory.");
      }

      if (!requestsResponse.ok || !requestsResult.success) {
        throw new Error(requestsResult.message || requestsResult.error || "Failed to load requests.");
      }

      setInventory(inventoryResult.data);
      setRequests(requestsResult.data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingCount = requests.filter((request) => request.status === "Pending").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review current stock, watch pending requests, and jump into the approval flow.
        </p>
      </section>

      {loading ? <LoadingState label="Loading admin dashboard..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-panel">
              <p className="text-sm text-slate-500">Inventory items</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{inventory.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-panel">
              <p className="text-sm text-slate-500">All requests</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{requests.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-panel">
              <p className="text-sm text-slate-500">Pending requests</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{pendingCount}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-panel">
              <h2 className="text-lg font-semibold text-slate-900">Inventory snapshot</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {inventory.slice(0, 5).map((item) => (
                  <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.quantity}</span>
                  </div>
                ))}
              </div>
              <Link href="/admin/inventory" className="mt-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
                View full inventory →
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-panel">
              <h2 className="text-lg font-semibold text-slate-900">Pending queue</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {requests.filter((request) => request.status === "Pending").slice(0, 5).map((request) => (
                  <div key={request._id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-slate-900">{request.itemName}</span>
                      <span>x{request.quantity}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{request.employeeName || "Employee"}</p>
                  </div>
                ))}
                {!pendingCount ? <p className="text-sm text-slate-500">No pending requests right now.</p> : null}
              </div>
              <Link href="/admin/requests" className="mt-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
                Open requests manager →
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
