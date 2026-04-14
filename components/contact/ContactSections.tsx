import { CONTACT_FAQS } from "@/lib/data/contact-faqs";

export default function ContactSections() {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14 bg-emerald-50/40 dark:bg-zinc-900/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-6 sm:p-8 shadow-xl shadow-emerald-900/5 dark:shadow-black/50 lg:col-span-1 h-fit">
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-zinc-50 tracking-tight">Need direct help?</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Reach us for urgent support, bulk pricing, and sourcing requests.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-50 dark:bg-zinc-800/80 p-4 border border-emerald-100 dark:border-zinc-700">
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400 font-bold">WhatsApp</p>
              <a href="https://wa.me/9779857043288" className="mt-1 block text-lg font-black text-emerald-950 dark:text-zinc-100">
                +977 9857043288
              </a>
            </div>
            <div className="rounded-2xl bg-emerald-50 dark:bg-zinc-800/80 p-4 border border-emerald-100 dark:border-zinc-700">
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400 font-bold">Email</p>
              <a href="mailto:support@kachukart.com" className="mt-1 block text-sm sm:text-base font-bold text-emerald-950 dark:text-zinc-100">
                support@kachukart.com
              </a>
            </div>
            <div className="rounded-2xl bg-emerald-50 dark:bg-zinc-800/80 p-4 border border-emerald-100 dark:border-zinc-700">
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400 font-bold">Support Hours</p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-zinc-300">Sun - Fri, 9:00 AM to 8:00 PM</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-4 sm:p-8 shadow-xl shadow-emerald-900/5 dark:shadow-black/50 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-zinc-50 tracking-tight px-2 sm:px-0">FAQs</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400 px-2 sm:px-0">Tap a question to expand the answer.</p>

          <div className="mt-6 space-y-3">
            {CONTACT_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-emerald-100 dark:border-zinc-800 bg-emerald-50/40 dark:bg-zinc-800/50 p-4 sm:p-5 open:bg-white dark:open:bg-zinc-950 open:shadow-md open:shadow-emerald-900/5 dark:open:shadow-black/40 transition-colors"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                  <span className="text-sm sm:text-base font-bold text-emerald-950 dark:text-zinc-100">{faq.question}</span>
                  <span className="text-emerald-600 dark:text-sky-400 text-lg font-black transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed pr-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
