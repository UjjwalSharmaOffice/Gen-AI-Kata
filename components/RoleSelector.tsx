"use client";

import Link from "next/link";

function saveRole(role: "employee" | "admin") {
  if (typeof window !== "undefined") {
    localStorage.setItem("office-role", role);
  }
}

export function RoleSelector() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Link
        href="/employee"
        onClick={() => saveRole("employee")}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel transition hover:-translate-y-1 hover:shadow-xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Employee</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Submit supply requests</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Raise a request, track its status, and see rejection reasons when the admin cannot fulfill it.
        </p>
        <span className="mt-6 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Open employee dashboard
        </span>
      </Link>

      <Link
        href="/admin"
        onClick={() => saveRole("admin")}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel transition hover:-translate-y-1 hover:shadow-xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Review inventory and requests</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          See current stock, approve valid requests, reject when needed, and keep the demo flow moving.
        </p>
        <span className="mt-6 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
          Open admin dashboard
        </span>
      </Link>
    </div>
  );
}
