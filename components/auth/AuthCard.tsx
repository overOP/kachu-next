export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 shadow-xl shadow-emerald-900/5 dark:shadow-black/40 dark:ring-1 dark:ring-zinc-800 p-6 sm:p-8">
      {children}
    </div>
  );
}
