import React from "react";
import { Truck, Lock, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: <Truck size={24} className="text-[#2563eb]" />,
    title: "Fast Delivery",
    desc: "On-time delivery",
  },
  {
    icon: <Lock size={24} className="text-[#2563eb]" />,
    title: "Secure Payment",
    desc: "100% secure payment",
  },
  {
    icon: <RotateCcw size={24} className="text-[#2563eb]" />,
    title: "Easy Returns",
    desc: "14-days easy returns",
  },
  {
    icon: <ShieldCheck size={24} className="text-[#2563eb]" />,
    title: "Genuine Products",
    desc: "Original & genuine",
  },
  {
    icon: <Headphones size={24} className="text-[#2563eb]" />,
    title: "24/7 Customer Support",
    desc: "We are here to help",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TRUST_FEATURES.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
