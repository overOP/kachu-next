type AuthPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function AuthPageHeader({ eyebrow, title, subtitle }: AuthPageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-600 dark:text-sky-400">{eyebrow}</p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}
