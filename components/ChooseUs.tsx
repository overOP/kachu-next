"use client";

import React from "react";
import { CHOOSE_US_FEATURES, type ChooseUsFeature } from "@/lib/content/choose-us-features";

const FEATURES: ChooseUsFeature[] = CHOOSE_US_FEATURES;

const ChooseUs: React.FC = () => {
  return (
    <section className="bg-gray-50 dark:bg-zinc-950 py-16 px-4 font-sans">
      <div className="bg-[#064E3B] dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800 max-w-7xl mx-auto rounded-3xl py-12 px-4 sm:px-8">
        <header className="mb-10 sm:mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center tracking-tight">
            Why Choose Us
          </h2>
          <div className="h-1 w-12 bg-emerald-400 dark:bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-center text-sm text-emerald-50/70 dark:text-zinc-400 sm:hidden">
            Swipe to explore
          </p>
        </header>

        <div className="flex gap-4 overflow-x-auto px-1 pb-3 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="min-w-[85%] snap-center bg-white dark:bg-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/40 sm:min-w-0"
            >
              <div className="bg-emerald-100 text-[#064E3B] dark:bg-sky-950 dark:text-sky-300 p-3 rounded-xl mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-gray-900 dark:text-zinc-100 font-bold text-lg mb-3 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2 sm:hidden" aria-hidden>
          {FEATURES.map((feature) => (
            <span
              key={feature.id}
              className="h-1.5 w-1.5 rounded-full bg-white/30 dark:bg-zinc-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;