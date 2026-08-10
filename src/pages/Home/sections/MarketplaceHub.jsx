import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Wrench,
  PartyPopper,
  Users,
  Headphones,
  Sun,
  CloudSun,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MarketplaceHub() {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* AI Assistant & Live Weather Widgets Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Assistant Card */}
        <div className="bg-[#eef2ff] border border-indigo-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                AI Assistant Card
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-[220px]">
                Ask Neighborly AI to events as you search
              </p>
            </div>
          </div>
        </div>

        {/* Live Weather Card */}
        <div className="bg-[#e0f2fe] border border-sky-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md shrink-0">
              <CloudSun size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Weather Card
              </h3>
              <p className="text-xs text-slate-600">
                HSR Layout:{" "}
                <span className="font-bold text-slate-800">
                  38°C Partly Cloudy
                </span>
              </p>
            </div>
          </div>
          <div className="font-black text-slate-900 text-sm sm:text-base bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/60">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Product Marketplace */}
          <Link
            to="/productlisting"
            className="bg-[#fef3c7]/60 hover:bg-[#fef3c7] border border-amber-200/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group"
          >
            <img
              src="https://media.istockphoto.com/id/1219933495/photo/shopping-trolley-cart.jpg?s=2048x2048&w=is&k=20&c=nTaSxSeFe8NwZG-0QfV4mTlPhTl1NNsvfmWSJXe5tMo="
              alt="Marketplace"
              className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center -mt-10 shadow-lg">
                <ShoppingBag size={32} />
              </div>

              <h3 className="mt-4 font-black text-lg text-slate-900 group-hover:text-amber-800">
                Product Marketplace
              </h3>
            </div>
          </Link>

          {/* 2. Service Marketplace */}
          <Link
            to="/servicelisting"
            className="bg-[#fef3c7]/60 hover:bg-[#fef3c7] border border-amber-200/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group"
          >
            <img
              src="https://media.istockphoto.com/id/492892828/photo/air-conditioning-engineer.jpg?s=2048x2048&w=is&k=20&c=gYu9ROXlt0JnBsToEqZR4lROh6qkwAy1sZMhPlFDFtU="
              alt="Marketplace"
              className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center -mt-10 shadow-lg">
                <Wrench size={32} />
              </div>

              <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-sky-800">
                Service Marketplace
              </h3>
            </div>
          </Link>

          {/* 3. Event Marketplace */}
          <Link
            to="/"
            className="bg-[#fef3c7]/60 hover:bg-[#fef3c7] border border-amber-200/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group"
          >
            <img
              src="https://media.istockphoto.com/id/1759436430/photo/back-view-of-a-female-speaker-giving-a-speech-in-front-of-people-at-convention-center.jpg?s=2048x2048&w=is&k=20&c=yOkhPOVj1J73fXnFUBj21CtGt0TXqskYJu9Nm0Brj6Q="
              alt="Marketplace"
              className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center -mt-10 shadow-lg">
                <PartyPopper size={32} />
              </div>

              <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-rose-800">
                Discover Events{" "}
              </h3>
            </div>
          </Link>

          {/* 4. Community Marketplace */}
          <Link
            to="/"
            className="bg-[#fef3c7]/60 hover:bg-[#fef3c7] border border-amber-200/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group"
          >
            <img
              src="https://images.unsplash.com/photo-1461088945293-0c17689e48ac?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Marketplace"
              className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center -mt-10 shadow-lg">
                <Users size={32} />
              </div>

              <h3 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-indigo-800">
                Join Community
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
