const descriptionMaxClass = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
} as const;

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  descriptionMaxWidth?: keyof typeof descriptionMaxClass;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  descriptionMaxWidth = "3xl",
}: PageHeroProps) {
  return (
    <section className="bg-white dark:bg-zinc-950 px-4 sm:px-6 py-12 sm:py-16 border-b border-emerald-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-600 dark:text-sky-400">{eyebrow}</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">{title}</h1>
        <p
          className={`mt-4 text-sm sm:text-base text-slate-600 dark:text-zinc-400 ${descriptionMaxClass[descriptionMaxWidth]}`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
