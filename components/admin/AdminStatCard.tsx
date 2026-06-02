type AdminStatCardProps = {
  title: string;
  value: string | number;
  hint?: string;
};

export default function AdminStatCard({ title, value, hint }: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-sky-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black tabular-nums text-emerald-950 dark:text-zinc-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
