"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { InventoryTable } from "@/components/InventoryTable";
import { LoadingState } from "@/components/LoadingState";
import { ApiResponse, InventoryItem } from "@/lib/types";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/inventory", { cache: "no-store" });
      const result = (await response.json()) as ApiResponse<InventoryItem[]>;

      if (!response.ok || !result.success) {
        setError(result.message || result.error || "Failed to load inventory.");
        setItems([]);
        return;
      }

      setItems(result.data);
    } catch {
      setError("Could not load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-semibold text-slate-900">Inventory</h1>
        <p className="mt-2 text-sm text-slate-600">Track current stock levels before approving employee requests.</p>
      </section>

      {loading ? <LoadingState label="Loading inventory..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadInventory} /> : null}
      {!loading && !error ? <InventoryTable items={items} /> : null}
    </div>
  );
}
