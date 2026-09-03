import React from "react";
import { Check, Sparkles, Calendar, ArrowRight } from "lucide-react";

export default function PricingPackagesPage({
  onOpenBooking,
  themeColors = {},
  business = {},
}) {
  const primaryColor = themeColors.primary || "#4F46E5";

  const tiers = [
    {
      name: "Essential Tier",
      price: "₹2,999",
      period: "per month / session",
      description: "Ideal for individuals seeking routine care, standard repairs, or foundational coaching.",
      features: [
        "1-on-1 Dedicated Specialist Assessment",
        "Full Inspection & Progress Report",
        "Standard Business Hours Dispatch",
        "Email & In-App Customer Support",
        "Standard Equipment & Materials",
      ],
      popular: false,
    },
    {
      name: "Signature Pro",
      price: "₹5,999",
      period: "per month / multi-pass",
      description: "Our most popular comprehensive package with priority scheduling and premium treatments.",
      features: [
        "Everything in Essential Tier",
        "Priority Same-Day Scheduling",
        "Complimentary Follow-up Consultation",
        "Full Warranty & Satisfaction Guarantee",
        "Dedicated Senior Lead Practitioner",
        "WhatsApp Direct Concierge Access",
      ],
      popular: true,
    },
    {
      name: "VIP All-Access",
      price: "₹9,999",
      period: "per month / unlimited",
      description: "White-glove executive service with unlimited perks, emergency dispatch, and tailored protocols.",
      features: [
        "Everything in Signature Pro",
        "24/7 Priority Emergency Access",
        "Unlimited Routine Consultations",
        "Personalized Custom Care Plan",
        "Complimentary Guest / Family Passes",
        "Executive Director Direct Attention",
      ],
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white inline-block shadow-2xs"
          style={{ backgroundColor: primaryColor }}
        >
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Flexible Plans & Service Tiers.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Upfront flat rates. Zero hidden surcharges. Choose the membership or session tier that best fits your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl p-8 flex flex-col justify-between transition duration-300 relative ${
              tier.popular
                ? "bg-white border-2 border-indigo-600 shadow-xl ring-4 ring-indigo-50"
                : "bg-white border border-slate-200 shadow-xs hover:shadow-md"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">{tier.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">{tier.price}</span>
                <span className="text-xs text-slate-400 font-medium">/{tier.period}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included Privileges</span>
                {tier.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenBooking && onOpenBooking({ serviceName: tier.name, price: tier.price.replace(/[$₹,]/g, "") })}
              className={`w-full mt-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                tier.popular
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <Calendar size={14} />
              <span>Get Started with {tier.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
