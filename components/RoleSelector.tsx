import { getSampleCredentials } from "@/lib/auth";

export function RoleSelector() {
  const credentials = getSampleCredentials();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {credentials.map((credential) => (
        <div
          key={credential.username}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel"
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${credential.role === "employee" ? "text-blue-600" : "text-emerald-600"}`}>
            {credential.role}
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">{credential.displayName}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use these sample credentials to sign in and test the {credential.role} experience.
          </p>
          <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p><span className="font-semibold">Username:</span> {credential.username}</p>
            <p><span className="font-semibold">Password:</span> {credential.password}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
