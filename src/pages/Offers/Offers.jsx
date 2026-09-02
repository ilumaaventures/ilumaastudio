import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tag,
  Gift,
  Percent,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Store,
  Search,
  Filter,
  Ticket,
  Globe,
  Package,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicOffers, getPublicCoupons } from "../../api/offerService";

// Helper for safe expiry date formatting
const formatExpiryDate = (exp) => {
  if (!exp) return null;
  const d = new Date(exp);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function Offers() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [platformOffers, setPlatformOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  useEffect(() => {
    const fetchAllDeals = async () => {
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

        setCoupons(couponList);
        setPlatformOffers(offerList);
      } catch (err) {
        console.error("Failed to load offers and coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDeals();
  }, []);

  const handleCopyCode = (code, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!code) return;

    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon Code '${code}' copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleNavigateToTarget = (deal) => {
    // 1. If product specific coupon with populated target product
    if (deal.targetProducts && deal.targetProducts.length > 0) {
      const prod = deal.targetProducts[0];
      const prodId = typeof prod === "object" ? prod._id : prod;
      if (prodId) {
        navigate(`/products/${prodId}`);
        return;
      }
    }

    // 2. If vendor coupon
    if (deal.vendor || (deal.targetVendors && deal.targetVendors.length > 0)) {
      const vObj = deal.vendor || deal.targetVendors[0];
      const vSlug = typeof vObj === "object" ? vObj.slug || vObj.storeName : null;
      if (vSlug) {
        navigate(`/store`);
        return;
      }
    }

    // 3. If business coupon
    if (deal.business || (deal.targetBusinesses && deal.targetBusinesses.length > 0)) {
      const bObj = deal.business || deal.targetBusinesses[0];
      const bSlug =
        typeof bObj === "object"
          ? bObj.subdomain || bObj.slugName || (typeof bObj.slug === "object" ? bObj.slug?.slugName : bObj.slug)
          : null;
      if (bSlug) {
        navigate(`/${bSlug}`);
        return;
      }
    }

    // 4. Default Shop
    navigate("/shop");
  };

  // Combine and format all items
  const allDeals = [
    ...coupons.map((c) => ({
      _id: c._id,
      itemType: "coupon",
      title: c.title || `Save with code ${c.code}`,
      code: c.code,
      discountType: c.discountType,
      discountAmount: c.discountAmount,
      maxDiscountAmount: c.maxDiscountAmount,
      minOrderAmount: c.minOrderAmount,
      targetScope: c.targetScope || "business",
      business: c.business,
      vendor: c.vendor,
      targetBusinesses: c.targetBusinesses,
      targetVendors: c.targetVendors,
      targetProducts: c.targetProducts,
      expiryDate: c.expiryDate,
      startDate: c.startDate,
      autoApply: c.autoApply,
      description: `Get ${
        c.discountType === "percentage"
          ? `${c.discountAmount}% OFF`
          : `FLAT ₹${c.discountAmount} OFF`
      } on eligible orders.${
        c.minOrderAmount > 0 ? ` Minimum spend: ₹${c.minOrderAmount}.` : ""
      }${c.maxDiscountAmount > 0 ? ` Max cap: ₹${c.maxDiscountAmount}.` : ""}`,
    })),
    ...platformOffers.map((o) => ({
      _id: o._id,
      itemType: "offer",
      title: o.title || "Platform Promotional Sale",
      headline: o.headline || o.subtitle || "Exclusive Platform Discount",
      code: o.code || (o.associatedCoupon ? o.associatedCoupon.code : null),
      associatedCoupon: o.associatedCoupon,
      image: o.image || o.bannerImage,
      targetScope: "platform",
      platform: o.platform || "E-Commerce",
      business: o.business,
      vendor: o.vendor,
      expiryDate: o.expiryDate || o.expiry,
      targetUrl: o.targetUrl,
      description: o.desc || o.description || "Special promotional offer created for ILumaa users.",
    })),
  ];

  // Filtering
  const filteredDeals = allDeals.filter((deal) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      deal.title?.toLowerCase().includes(q) ||
      deal.code?.toLowerCase().includes(q) ||
      deal.description?.toLowerCase().includes(q) ||
      deal.business?.businessName?.toLowerCase().includes(q) ||
      deal.vendor?.storeName?.toLowerCase().includes(q);

    const matchesScope =
      selectedScope === "All" ||
      (selectedScope === "global" && deal.targetScope === "global") ||
      (selectedScope === "business" && deal.targetScope === "business") ||
      (selectedScope === "vendor" && deal.targetScope === "vendor") ||
      (selectedScope === "product" && deal.targetScope === "product") ||
      (selectedScope === "platform" && deal.targetScope === "platform");

    const matchesPlatform =
      selectedPlatform === "All" ||
      (deal.platform && deal.platform.toLowerCase() === selectedPlatform.toLowerCase());

    return matchesSearch && matchesScope && matchesPlatform;
  });

  // Calculate scope statistics
  const scopeCounts = {
    All: allDeals.length,
    global: allDeals.filter((d) => d.targetScope === "global").length,
    business: allDeals.filter((d) => d.targetScope === "business").length,
    vendor: allDeals.filter((d) => d.targetScope === "vendor").length,
    product: allDeals.filter((d) => d.targetScope === "product").length,
    platform: allDeals.filter((d) => d.targetScope === "platform").length,
  };

  const getScopeBadge = (scope, businessObj, vendorObj, targetProds) => {
    switch (scope?.toLowerCase()) {
      case "global":
        return {
          label: "Platform Global",
          subtitle: "Applicable across all ILumaa stores",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Globe,
        };
      case "business":
        const bizName = typeof businessObj === "object" ? businessObj?.businessName : "Whole Business";
        return {
          label: "Whole Business",
          subtitle: bizName || "Applicable across store catalog",
          bg: "bg-[#004ac6]/10 text-[#004ac6] border-[#004ac6]/20",
          icon: Store,
        };
      case "vendor":
        const bName = typeof businessObj === "object" ? businessObj?.businessName : null;
        const vName = typeof vendorObj === "object" ? vendorObj?.storeName : "Vendor Store";
        return {
          label: "Vendor Deal",
          subtitle: bName && vName ? `${bName} ➔ ${vName}` : vName,
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: ShoppingBag,
        };
      case "product":
        const prodName = targetProds && targetProds.length > 0 ? targetProds[0]?.name || targetProds[0]?.title : "Specific Product";
        return {
          label: "Specific Product",
          subtitle: prodName || "Applicable to selected product",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Package,
        };
      default:
        return {
          label: "Promotional Offer",
          subtitle: "Featured platform sale",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: Sparkles,
        };
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#004AC6] text-white p-8 sm:p-12 shadow-xl border border-blue-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-blue-200 border border-white/20">
              <Sparkles size={14} className="text-amber-400 fill-amber-400" />
              <span>Official Coupon & Discount Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Promotional Coupons & Special Offers
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              Explore targeted discount codes for whole business catalogs, specific vendor stores, and featured products. Save instantly at checkout!
            </p>

            {/* Live Stats Header Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Active Deals</p>
                <p className="text-xl font-black text-white">{allDeals.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Global Coupons</p>
                <p className="text-xl font-black text-white">{scopeCounts.global}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Business Coupons</p>
                <p className="text-xl font-black text-white">{scopeCounts.business}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Vendor Deals</p>
                <p className="text-xl font-black text-white">{scopeCounts.vendor}</p>
              </div>
            </div>
          </div>

          {/* Background Decorative Lighting */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by code, title, business, or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#004ac6] focus:bg-white transition"
              />
            </div>

            {/* Scope Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { key: "All", label: "All Deals", count: scopeCounts.All },
                { key: "global", label: "🌐 Global", count: scopeCounts.global },
                { key: "business", label: "🏢 Business", count: scopeCounts.business },
                { key: "vendor", label: "🏪 Vendors", count: scopeCounts.vendor },
                { key: "product", label: "📦 Products", count: scopeCounts.product },
                { key: "platform", label: "🚀 Campaigns", count: scopeCounts.platform },
              ].map((scopeItem) => (
                <button
                  key={scopeItem.key}
                  onClick={() => setSelectedScope(scopeItem.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedScope === scopeItem.key
                      ? "bg-[#004ac6] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>{scopeItem.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedScope === scopeItem.key
                        ? "bg-white/25 text-white font-extrabold"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {scopeItem.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 h-80 animate-pulse space-y-4 shadow-xs"
              >
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-14 bg-slate-100 rounded-2xl w-full" />
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => {
              const scopeInfo = getScopeBadge(
                deal.targetScope,
                deal.business,
                deal.vendor,
                deal.targetProducts,
              );
              const ScopeIcon = scopeInfo.icon;
              const formattedExpiry = formatExpiryDate(deal.expiryDate);
              const code = deal.code || (deal.associatedCoupon ? deal.associatedCoupon.code : null);
              const isCopied = copiedCode === code;

              return (
                <div
                  key={deal._id || index}
                  className="group relative bg-white border border-slate-200/90 hover:border-[#004ac6]/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Side Ticket Cutouts */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-[#F8FAFC] border-r border-slate-200/80 rounded-r-full z-20 pointer-events-none" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-[#F8FAFC] border-l border-slate-200/80 rounded-l-full z-20 pointer-events-none" />

                  {/* Header Banner Section */}
                  <div className="p-6 pb-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100 relative">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Scope Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${scopeInfo.bg}`}
                      >
                        <ScopeIcon size={12} />
                        <span>{scopeInfo.label}</span>
                      </span>

                      {/* Discount Value Badge */}
                      {deal.discountAmount !== undefined && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-2xs">
                          {deal.discountType === "percentage"
                            ? `${deal.discountAmount}% OFF`
                            : `FLAT ₹${deal.discountAmount} OFF`}
                        </span>
                      )}
                    </div>

                    {/* Owner Subtitle */}
                    <p className="text-[11px] font-bold text-slate-500 truncate mb-1">
                      {scopeInfo.subtitle}
                    </p>

                    <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-[#004ac6] transition-colors line-clamp-2">
                      {deal.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 pt-4 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                        {deal.description}
                      </p>

                      {/* Spend Conditions Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
                        {deal.minOrderAmount > 0 && (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                            Min Order: ₹{deal.minOrderAmount}
                          </span>
                        )}
                        {deal.maxDiscountAmount > 0 && (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                            Max Savings: ₹{deal.maxDiscountAmount}
                          </span>
                        )}
                        {formattedExpiry && (
                          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                            <Clock size={11} /> Expires: {formattedExpiry}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Coupon Voucher Copy Box */}
                      {code ? (
                        <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-dashed border-blue-300 rounded-2xl p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Promo Code
                            </p>
                            <p className="text-base font-mono font-black text-slate-900 tracking-wider truncate">
                              {code}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(code, e)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-[#004ac6] text-white hover:bg-blue-700"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check size={14} />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}

                      {/* Navigation CTA */}
                      <button
                        type="button"
                        onClick={() => handleNavigateToTarget(deal)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#004ac6] bg-white hover:bg-blue-50/50 text-slate-800 hover:text-[#004ac6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>
                          {deal.targetScope === "product"
                            ? "View Product Deal"
                            : deal.targetScope === "vendor" || deal.targetScope === "business"
                              ? "Shop Store Catalog"
                              : "Explore Platform Deals"}
                        </span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#004ac6] flex items-center justify-center mx-auto">
              <Gift size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Deals Found</h3>
            <p className="text-xs text-slate-500 font-medium">
              There are currently no active promotional coupons or offers matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedScope("All");
                setSelectedPlatform("All");
              }}
              className="inline-flex items-center gap-2 bg-[#004ac6] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Offers;
