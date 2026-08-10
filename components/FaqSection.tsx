import type { ContactFaq } from "@/lib/data/contact-faqs";

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  description = "Tap a question to expand the answer.",
}: {
  faqs: ContactFaq[];
  title?: string;
  description?: string;
}) {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14 bg-emerald-50/40 dark:bg-zinc-900/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-zinc-50 tracking-tight px-2 sm:px-0">
          {title}
        </h2>
        <p className="mt-2 px-2 text-sm text-slate-600 dark:text-zinc-300 sm:px-0">{description}</p>

        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-emerald-100 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 p-4 sm:p-5 open:bg-white dark:open:bg-zinc-950 open:shadow-md open:shadow-emerald-900/5 dark:open:shadow-black/40 transition-colors"
            >
              <summary className="flex list-none cursor-pointer items-center justify-between gap-4 rounded-lg py-3 pl-1 pr-2 min-h-11">
                <span className="text-sm font-bold text-emerald-950 dark:text-zinc-100 sm:text-base">
                  {faq.question}
                </span>
                <span
                  className="text-lg font-black text-emerald-700 dark:text-sky-300 transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-1 pr-2 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
