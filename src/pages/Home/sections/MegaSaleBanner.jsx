import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function MegaSaleBanner({ title, description, imageUrl, linkUrl }) {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-2xl md:rounded-3xl bg-[#262626] text-white p-5 sm:p-7 overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side Content & Call to Action */}
        <div className="space-y-2 z-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">{description}</p>
        </div>

        {/* Center / Right Banner Image */}
        <div className="flex items-center gap-4 z-10">
          <img
            src={imageUrl}
            alt="Delicious Dish"
            className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-xl shadow-md border border-white/20"
          />
          <Link
            to={linkUrl}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Shop Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MegaSaleBanner;
