import React from "react";
import { Sparkles, Award, Heart, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default function AboutPage({
  business = {},
  themeColors = {},
  onNavigate,
  isService = false,
}) {
  const primaryColor = themeColors.primary || "#4F46E5";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 font-sans">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white inline-block shadow-2xs"
            style={{ backgroundColor: primaryColor }}
          >
            Our Mission & Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Crafting Exceptional Experiences for Modern Customers.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
            {business.description ||
              "Founded with a relentless commitment to quality, authenticity, and design perfection. We partner with responsible growers, certified master artisans, and leading industry experts to deliver unrivaled value."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate && onNavigate(isService ? "services" : "shop")}
              className="px-6 py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <span>{isService ? "Explore Our Services" : "Browse Our Collection"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
              alt="Our Team & Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Metrics & Impact Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">50K+</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delighted Clients</p>
        </div>
        <div className="text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">99.8%</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Satisfaction Rate</p>
        </div>
        <div className="text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">100%</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organic / Certified</p>
        </div>
        <div className="text-center space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">24/7</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority Concierge</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            What Sets Us Apart
          </h2>
          <p className="text-xs text-slate-500">
            Our operating principles guide every order, appointment, and ingredient we select.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Uncompromising Quality</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              We never cut corners. Every product undergoes strict multi-point verification before it reaches your hands.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Heart size={22} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Customer Centricity</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Your happiness is our definitive metric of success. We offer direct concierge support and no-hassle guarantees.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Award size={22} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Master Craftsmanship</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              From our digital platform to our doorstep presentation, every detail is engineered for elegance and seamless ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
