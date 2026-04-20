import Link from "next/link";
import { RequestForm } from "@/components/RequestForm";

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-semibold text-slate-900">New supply request</h1>
        <p className="mt-2 text-sm text-slate-600">
          Submit a new office supply request for admin review.
        </p>
        <Link href="/employee" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Back to employee dashboard
        </Link>
      </div>
      <RequestForm title="Create request" description="Enter the item you need, quantity, and any optional remarks." />
    </div>
  );
}
