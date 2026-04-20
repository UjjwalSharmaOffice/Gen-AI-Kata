import { LoginForm } from "@/components/LoginForm";
import { RoleSelector } from "@/components/RoleSelector";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-panel sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Hackathon demo</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Office Supply Management System</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
          Employees can submit supply requests and track their status. Admins can review inventory,
          approve valid requests, or reject them with a clear reason.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
        <LoginForm />
        <RoleSelector />
      </div>
    </div>
  );
}
