"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { RequestForm } from "@/components/RequestForm";
import { RequestHistoryTable } from "@/components/RequestHistoryTable";
import { ApiResponse, SupplyRequest } from "@/lib/types";

export default function EmployeeDashboardPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const loadRequests = useCallback(async (currentName?: string) => {
    setLoading(true);
    setError("");

    try {
      const savedName = currentName ?? window.localStorage.getItem("office-employee-name") ?? "";
      setEmployeeName(savedName);
      const query = savedName ? `?employeeName=${encodeURIComponent(savedName)}` : "";
      const response = await fetch(`/api/requests${query}`, { cache: "no-store" });
      const result = (await response.json()) as ApiResponse<SupplyRequest[]>;

      if (!response.ok || !result.success) {
        setError(result.message || result.error || "Failed to load request history.");
        setRequests([]);
        return;
      }

      setRequests(result.data);
    } catch {
      setError("Could not load request history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employee dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Submit a request and track the latest status updates. {employeeName ? `Showing history for ${employeeName}.` : "Enter your name in the form to keep history grouped for the demo."}
          </p>
        </div>
        <Link
          href="/employee/new-request"
          className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Open full request form
        </Link>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_1.4fr]">
        <RequestForm onSubmitted={(_, identity) => loadRequests(identity.employeeName)} />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Request history</h2>
            <p className="mt-2 text-sm text-slate-600">Track Pending, Approved, and Rejected requests, including rejection reasons.</p>
          </div>
          {loading ? <LoadingState label="Loading request history..." /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={() => loadRequests()} /> : null}
          {!loading && !error ? <RequestHistoryTable requests={requests} /> : null}
        </section>
      </div>
    </div>
  );
}
