export function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-panel">
      {message}
    </div>
  );
}
