import React from "react";

import { FEATURE_DATA, type Feature } from "../utlis/utlity";

const FEATURES: Feature[] = FEATURE_DATA;

const ChooseUs: React.FC = React.memo(() => {
  return (
    <section className="bg-gray-50 py-16 px-4 font-sans">
      <div className="bg-[#064E3B] max-w-7xl mx-auto rounded-3xl py-12 px-8">
        <header className="mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center tracking-tight">
            Why Choose Us
          </h2>
          <div className="h-1 w-12 bg-emerald-400 mx-auto mt-4 rounded-full" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-emerald-100 text-[#064E3B] p-3 rounded-xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-gray-900 font-bold text-lg mb-3 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ChooseUs;
