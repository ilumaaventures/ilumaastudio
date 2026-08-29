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
        <Link to="/productlisting">
          <div className="bg-[#eef2ff] border border-indigo-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                <ShoppingBag size={30} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Product Marketplace
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 max-w-[220px]">
                  Discover products from trusted brands
                </p>
              </div>
            </div>
          </div>
        </Link>
        {/* Live Weather Card */}
        <Link to="/servicelisting">
          <div className="bg-[#e0f2fe] border border-sky-100 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              {" "}
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md shrink-0">
                <Wrench size={30} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Service Marketplace
                </h3>
                <p className="text-xs text-slate-600">
                  Find professionals and book services
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
