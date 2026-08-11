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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Our Services
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Everything you need, all in one place
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Product Marketplace */}
            <Link
              to="/productlisting"
              className="
          group relative overflow-hidden rounded-3xl
          border border-amber-200/70
          bg-gradient-to-br from-amber-50 to-yellow-100
          shadow-sm hover:shadow-xl
          transition-all duration-300
          hover:-translate-y-1
        "
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/1219933495/photo/shopping-trolley-cart.jpg?s=2048x2048&w=is&k=20&c=nTaSxSeFe8NwZG-0QfV4mTlPhTl1NNsvfmWSJXe5tMo="
                  alt="Product Marketplace"
                  className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-amber-700">
                  Shop Products
                </span>
              </div>

              <div className="relative p-5 pt-0">
                <div
                  className="
              -mt-8 relative z-10
              w-16 h-16 rounded-2xl
              bg-gradient-to-br from-amber-100 to-amber-200
              text-amber-700
              flex items-center justify-center
              shadow-lg border-4 border-white
            "
                >
                  <ShoppingBag size={30} />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900">
                      Product Marketplace
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Discover products from trusted brands
                    </p>
                  </div>

                  <div
                    className="
              w-10 h-10 rounded-full
              bg-white flex items-center justify-center
              text-amber-700
              group-hover:bg-amber-600
              group-hover:text-white
              transition-all
            "
                  >
                    →
                  </div>
                </div>
              </div>
            </Link>

            {/* Service Marketplace */}
            <Link
              to="/servicelisting"
              className="
          group relative overflow-hidden rounded-3xl
          border border-sky-200/70
          bg-gradient-to-br from-sky-50 to-blue-100
          shadow-sm hover:shadow-xl
          transition-all duration-300
          hover:-translate-y-1
        "
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/492892828/photo/air-conditioning-engineer.jpg?s=2048x2048&w=is&k=20&c=gYu9ROXlt0JnBsToEqZR4lROh6qkwAy1sZMhPlFDFtU="
                  alt="Service Marketplace"
                  className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-sky-700">
                  Book Services
                </span>
              </div>

              <div className="relative p-5 pt-0">
                <div
                  className="
              -mt-8 relative z-10
              w-16 h-16 rounded-2xl
              bg-gradient-to-br from-sky-100 to-blue-200
              text-sky-700
              flex items-center justify-center
              shadow-lg border-4 border-white
            "
                >
                  <Wrench size={30} />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900">
                      Service Marketplace
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Find professionals and book services
                    </p>
                  </div>

                  <div
                    className="
              w-10 h-10 rounded-full
              bg-white flex items-center justify-center
              text-sky-700
              group-hover:bg-sky-600
              group-hover:text-white
              transition-all
            "
                  >
                    →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
