import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

function AppNewsletterSocial() {
  return (
    <footer className="w-full space-y-8 pt-4">
      {/* Summer Festival Offers Bottom Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#e8f5e9] border border-emerald-100 p-6 sm:p-8 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider rounded-full">
              Banner
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Summer Festival Offers!
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              20% Cashback on Groceries
            </p>
            <div className="pt-1">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#1e6091] hover:bg-[#1a5276] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="z-10 w-full md:w-1/2 flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"
              alt="Summer Festival Offers"
              className="w-full max-w-[340px] h-44 sm:h-48 object-cover rounded-2xl shadow-md border-2 border-white/80"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppNewsletterSocial;
