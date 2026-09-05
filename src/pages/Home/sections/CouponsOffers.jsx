import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tag,
  Gift,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Globe,
  Store,
  ShoppingBag,
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicOffers, getPublicCoupons } from "../../../api/offerService";

// Safe expiry date formatter
const formatExpiryDate = (exp) => {
  if (!exp) return null;
  const d = new Date(exp);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function CouponsOffers() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeScopeFilter, setActiveScopeFilter] = useState("All");

  useEffect(() => {
    const fetchHomeDeals = async () => {
      try {
        setLoading(true);
        const [couponsRes, offersRes] = await Promise.all([
          getPublicCoupons().catch(() => []),
          getPublicOffers().catch(() => []),
        ]);

        const couponList = Array.isArray(couponsRes)
          ? couponsRes
          : couponsRes?.coupons || couponsRes?.data || [];
        const offerList = Array.isArray(offersRes)
          ? offersRes
          : offersRes?.offers || offersRes?.data || [];

        // Format combined dataset from DB
        const combined = [
          ...couponList.map((c) => ({
            _id: c._id,
            type: "coupon",
            title: c.title || `Save with ${c.code}`,
            code: c.code,
            discountType: c.discountType,
            discountAmount: c.discountAmount,
            maxDiscountAmount: c.maxDiscountAmount,
            minOrderAmount: c.minOrderAmount,
            targetScope: c.targetScope || "business",
            business: c.business,
            vendor: c.vendor,
            targetProducts: c.targetProducts,
            expiryDate: c.expiryDate,
            subtitle:
              c.discountType === "percentage"
                ? `Get ${c.discountAmount}% OFF on your order`
                : `Save FLAT ₹${c.discountAmount} at checkout`,
          })),
          ...offerList.map((o) => ({
            _id: o._id,
            type: "offer",
            title: o.title || "Promotional Platform Offer",
            headline: o.headline || o.subtitle || "Exclusive Deal",
            code:
              o.code || (o.associatedCoupon ? o.associatedCoupon.code : null),
            targetScope: o.targetScope || "global",
            business: o.business,
            vendor: o.vendor,
            expiryDate: o.expiryDate || o.expiry,
            subtitle:
              o.desc || o.description || "Limited time promotional offer",
          })),
        ];

        setDeals(combined);
      } catch (err) {
        console.error("Failed to load home page deals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeDeals();
  }, []);

  const handleCopyCode = (code, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!code) return;

    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon Code '${code}' copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCardClick = (deal) => {
    // 1. If product coupon
    if (deal.targetProducts && deal.targetProducts.length > 0) {
      const prod = deal.targetProducts[0];
      const prodId = typeof prod === "object" ? prod._id : prod;
      if (prodId) {
        navigate(`/products/${prodId}`);
        return;
      }
    }

    // 2. If vendor deal
    if (deal.vendor) {
      const vObj = deal.vendor;
      const vSlug =
        typeof vObj === "object" ? vObj.slug || vObj.storeName : null;
      if (vSlug) {
        navigate(`/store`);
        return;
      }
    }

    // 3. If business deal
    if (deal.business) {
      const bObj = deal.business;
      const bSlug =
        typeof bObj === "object" ? bObj.subdomain || bObj.slug : null;
      if (bSlug) {
        navigate(`/${bSlug}`);
        return;
      }
    }

    // Default to Offers Hub
    navigate("/offers");
  };

  // Scope pill counts
  const filteredDeals = deals.filter((d) => {
    if (activeScopeFilter === "All") return true;
    return d.targetScope?.toLowerCase() === activeScopeFilter.toLowerCase();
  });

  const getScopeBadge = (scope, businessObj, vendorObj) => {
    switch (scope?.toLowerCase()) {
      case "global":
        return {
          label: "Global",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Globe,
          owner: "Platform Wide",
        };
      case "business":
        const bizName =
          typeof businessObj === "object"
            ? businessObj?.businessName
            : "Whole Business";
        return {
          label: "Business",
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: Store,
          owner: bizName || "Whole Store Catalog",
        };
      case "vendor":
        const vName =
          typeof vendorObj === "object" ? vendorObj?.storeName : "Vendor Store";
        return {
          label: "Vendor Deal",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: ShoppingBag,
          owner: vName || "Vendor Store",
        };
      case "product":
        return {
          label: "Product Deal",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Package,
          owner: "Selected Product Item",
        };
      default:
        return {
          label: "Special Offer",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: Sparkles,
          owner: "Promotional Sale",
        };
    }
  };

  if (!loading && deals.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004ac6] flex items-center justify-center font-bold">
                <Tag size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Exclusive Coupons & Store Discounts
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Active promotional discount vouchers and targeted store codes from
              our database
            </p>
          </div>

          {/* Scope Quick Filters & View All Link */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Link
              to="/offers"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
            >
              <span>See All</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Content Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-5 h-44 animate-pulse space-y-3 shadow-xs"
              >
                <div className="h-5 bg-slate-200 rounded-md w-1/2" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-10 bg-slate-100 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDeals.slice(0, 4).map((deal, idx) => {
              const scopeInfo = getScopeBadge(
                deal.targetScope,
                deal.business,
                deal.vendor,
              );
              const ScopeIcon = scopeInfo.icon;
              const formattedExp = formatExpiryDate(deal.expiryDate);
              const isCopied = copiedCode === deal.code;

              return (
                <div
                  key={deal._id || idx}
                  onClick={() => handleCardClick(deal)}
                  className="group relative bg-white border border-slate-200/90 hover:border-[#004ac6]/50 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
                >
                  {/* Side Ticket Cutouts */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-50 border-r border-slate-200 rounded-r-full z-10 pointer-events-none" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-50 border-l border-slate-200 rounded-l-full z-10 pointer-events-none" />

                  {/* Header Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${scopeInfo.bg}`}
                      >
                        <ScopeIcon size={11} />
                        <span>{scopeInfo.label}</span>
                      </span>

                      {deal.discountAmount !== undefined && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[11px] shadow-2xs">
                          {deal.discountType === "percentage"
                            ? `${deal.discountAmount}% OFF`
                            : `₹${deal.discountAmount} OFF`}
                        </span>
                      )}
                    </div>

                    <p
                      className="text-[10px] font-bold text-slate-400 truncate"
                      title={scopeInfo.owner}
                    >
                      {scopeInfo.owner}
                    </p>

                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#004ac6] transition-colors line-clamp-1">
                      {deal.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {deal.subtitle}
                    </p>
                  </div>

                  {/* Voucher Box & Actions */}
                  <div className="pt-3 space-y-2 mt-2">
                    {deal.code ? (
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-dashed border-blue-300 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Code
                          </p>
                          <p className="text-xs font-mono font-black text-slate-900 tracking-wider truncate">
                            {deal.code}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(deal.code, e)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-2xs cursor-pointer shrink-0 ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#004ac6] text-white hover:bg-blue-700"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="w-full py-2 bg-blue-50 text-[#004ac6] text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                        <span>Claim Special Offer</span>
                        <ArrowRight size={13} />
                      </div>
                    )}

                    {formattedExp && (
                      <p className="text-[9px] font-bold text-amber-700 flex items-center gap-1 justify-end">
                        <Clock size={10} /> Valid till {formattedExp}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-xs text-slate-500 font-medium">
            No active deals found for this scope category.
          </div>
        )}
      </div>
    </section>
  );
}

export default CouponsOffers;
