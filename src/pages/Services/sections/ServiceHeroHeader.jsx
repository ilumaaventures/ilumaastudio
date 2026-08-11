import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ServiceHeroHeader({ title, subtitle, tag }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-[#2563eb]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 dark:text-white font-bold">Doorstep Services</span>
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
        {tag || "Book Doorstep Services"}
      </span>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {title || "Verified Services, Coaching & Repairs"}
      </h1>

      <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
        {subtitle || "Explore nearby home experts, sports trainers, personal tutors, and top-rated doorstep professionals."}
      </p>
    </div>
  );
}
