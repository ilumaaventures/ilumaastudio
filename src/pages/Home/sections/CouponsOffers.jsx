import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingBag, CheckCircle, Package, Gift, Tag, Sparkles } from "lucide-react";
import { getPublicOffers } from "../../../api/offerService";

function CouponsOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getPublicOffers();
        const list = Array.isArray(data) ? data : data?.offers || data?.data || [];
        setOffers(list);
      } catch (err) {
        console.error("Failed to load home coupons:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (!loading && offers.length === 0) {
    return null;
  }

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-[#2563eb]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Coupons & Special Discounts
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Active promotional vouchers and store discount codes from database
          </p>
        </div>

        <Link
          to="/offers"
          className="text-xs sm:text-sm font-bold text-[#2563eb] hover:underline transition-colors flex items-center gap-1 shrink-0"
        >
          <span>See all offers</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.slice(0, 4).map((offer, idx) => {
            const code = offer.code || "SAVE10";
            const title = offer.title || "Special Coupon";
            const headline = offer.headline || offer.subtitle || "Store Discount";
            const bgStyles = [
              "bg-blue-50 border-blue-100 text-blue-900",
              "bg-purple-50 border-purple-100 text-purple-900",
              "bg-emerald-50 border-emerald-100 text-emerald-900",
              "bg-amber-50 border-amber-100 text-amber-900",
            ];
            const currentStyle = bgStyles[idx % bgStyles.length];

            return (
              <Link
                key={offer._id || offer.id || idx}
                to="/offers"
                className={`${currentStyle} border rounded-3xl p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-between group`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-xs font-mono">
                      {code}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base truncate group-hover:text-[#2563eb] transition-colors">
                    {title}
                  </h3>
                  <p className="text-[11px] opacity-80 font-medium truncate mt-0.5">
                    {headline}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-2xl bg-white/90 shadow-2xs flex items-center justify-center text-slate-700 group-hover:bg-[#2563eb] group-hover:text-white transition-all shrink-0">
                  <ChevronRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CouponsOffers;

