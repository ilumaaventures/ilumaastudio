import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingBag, CheckCircle, Package, Gift } from "lucide-react";

const REWARD_ITEMS = [
  {
    id: "r1",
    title: "Specific Store",
    subtitle: "App 5gox",
    icon: ShoppingBag,
    iconBg: "bg-amber-100 text-amber-700",
    link: "/offers",
  },
  {
    id: "r2",
    title: "Coupons: 1250",
    subtitle: "Rescooable offers",
    icon: CheckCircle,
    iconBg: "bg-emerald-100 text-emerald-600",
    link: "/offers",
  },
  {
    id: "r3",
    title: "Songo Store",
    subtitle: "Resseonable offers",
    icon: Package,
    iconBg: "bg-amber-100 text-amber-800",
    link: "/offers",
  },
  {
    id: "r4",
    title: "Redeemable offers",
    subtitle: "Resseonable offers",
    icon: Gift,
    iconBg: "bg-rose-100 text-rose-600",
    link: "/offers",
  },
];

function CouponsOffers() {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Coupons & Rewards
        </h2>
        <Link
          to="/offers"
          className="text-xs sm:text-sm font-bold text-[#1e6091] hover:text-[#1a5276] transition-colors"
        >
          See all
        </Link>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REWARD_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.link}
              className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#1e6091] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Chevron Pill */}
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1e6091] group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CouponsOffers;

