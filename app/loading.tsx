export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-emerald-50/40 dark:bg-zinc-950 px-6">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-sky-500 dark:border-t-transparent"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Loading…</p>
    </div>
  );
}
