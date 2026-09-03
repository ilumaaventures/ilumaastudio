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
  Flame,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import baseApi from "../../api/baseApi";
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
  const [promoBanners, setPromoBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState("All");

  useEffect(() => {
    const fetchAllDealsAndBanners = async () => {
      try {
        setLoading(true);
        const [couponsRes, offersRes, bannersRes] = await Promise.all([
          getPublicCoupons().catch(() => []),
          getPublicOffers().catch(() => []),
          baseApi.get("/marketing/public/banners").catch(() => ({ data: [] })),
        ]);

        const couponList = Array.isArray(couponsRes)
          ? couponsRes
          : couponsRes?.coupons || couponsRes?.data || [];
        const offerList = Array.isArray(offersRes)
          ? offersRes
          : offersRes?.offers || offersRes?.data || [];
        const bannerList = Array.isArray(bannersRes.data)
          ? bannersRes.data
          : bannersRes.data?.banners || [];

        setCoupons(couponList);
        setPlatformOffers(offerList);
        setPromoBanners(bannerList);
      } catch (err) {
        console.error("Failed to load offers, coupons, and banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDealsAndBanners();
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
    if (deal.targetUrl) {
      if (deal.targetUrl.startsWith("http")) {
        window.open(deal.targetUrl, "_blank");
      } else {
        navigate(deal.targetUrl);
      }
      return;
    }

    if (deal.targetProducts && deal.targetProducts.length > 0) {
      const prod = deal.targetProducts[0];
      const prodId = typeof prod === "object" ? prod._id : prod;
      if (prodId) {
        navigate(`/products/${prodId}`);
        return;
      }
    }

    if (deal.vendor || (deal.targetVendors && deal.targetVendors.length > 0)) {
      navigate(`/shop`);
      return;
    }

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
      targetScope: c.targetScope || "global",
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
      } on eligible platform orders.${
        c.minOrderAmount > 0 ? ` Minimum spend: ₹${c.minOrderAmount}.` : ""
      }${c.maxDiscountAmount > 0 ? ` Max cap: ₹${c.maxDiscountAmount}.` : ""}`,
    })),
    ...platformOffers.map((o) => ({
      _id: o._id,
      itemType: "offer",
      title: o.title || "Global Platform Mega Deal",
      headline: o.headline || o.subtitle || "Exclusive Platform Discount",
      code: o.code || (o.associatedCoupon ? o.associatedCoupon.code : null),
      associatedCoupon: o.associatedCoupon,
      image: o.image || o.bannerImage,
      targetScope: o.targetScope || "global",
      platform: o.platform || "ILumaa Global",
      business: o.business,
      vendor: o.vendor,
      expiryDate: o.expiryDate || o.expiry,
      targetUrl: o.targetUrl,
      description: o.desc || o.description || "Special promotional global offer created across ILumaa Network.",
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
      (selectedScope === "global" && (deal.targetScope === "global" || deal.targetScope === "platform")) ||
      (selectedScope === "business" && deal.targetScope === "business") ||
      (selectedScope === "vendor" && deal.targetScope === "vendor") ||
      (selectedScope === "product" && deal.targetScope === "product");

    return matchesSearch && matchesScope;
  });

  const scopeCounts = {
    All: allDeals.length,
    global: allDeals.filter((d) => d.targetScope === "global" || d.targetScope === "platform").length,
    business: allDeals.filter((d) => d.targetScope === "business").length,
    vendor: allDeals.filter((d) => d.targetScope === "vendor").length,
    product: allDeals.filter((d) => d.targetScope === "product").length,
  };

  const getScopeBadge = (scope, businessObj, vendorObj, targetProds) => {
    switch (scope?.toLowerCase()) {
      case "global":
      case "platform":
        return {
          label: "Global Platform Deal",
          subtitle: "Valid across all stores on ILumaa Network",
          bg: "bg-[#004ac6] text-white border-[#004ac6]",
          icon: Globe,
        };
      case "business":
        const bizName = typeof businessObj === "object" ? businessObj?.businessName : "Whole Business";
        return {
          label: "Business Storewide",
          subtitle: bizName || "Applicable across store catalog",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Store,
        };
      case "vendor":
        const vName = typeof vendorObj === "object" ? vendorObj?.storeName : "Vendor Store";
        return {
          label: "Vendor Special",
          subtitle: vName,
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: ShoppingBag,
        };
      case "product":
        const prodName = targetProds && targetProds.length > 0 ? targetProds[0]?.name || targetProds[0]?.title : "Specific Item";
        return {
          label: "Product Deal",
          subtitle: prodName || "Applicable to selected product",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Package,
        };
      default:
        return {
          label: "Global Platform Offer",
          subtitle: "Featured platform deal",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Sparkles,
        };
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Top Hero Banner Section with Global Scope Accent */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#004AC6] text-white p-8 sm:p-12 shadow-xl border border-blue-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-black uppercase tracking-wider text-blue-200 border border-white/20">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span>Global Platform Offers & Flash Coupons</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Platform-Wide Flash Deals & Coupons
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              Explore global discount vouchers, campaign deals, and storewide promotional offers with global platform scope. Redeem codes directly at checkout!
            </p>

            {/* Live Stats Header Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Active Deals</p>
                <p className="text-xl font-black text-white">{allDeals.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Global Platform</p>
                <p className="text-xl font-black text-white">{scopeCounts.global}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Business Deals</p>
                <p className="text-xl font-black text-white">{scopeCounts.business}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-blue-200">Vendor Deals</p>
                <p className="text-xl font-black text-white">{scopeCounts.vendor}</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Global Promotional Banners Carousel Strip (if banners exist) */}
        {promoBanners.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Flame size={16} className="text-rose-600 fill-rose-600" />
              Featured Global Platform Banners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promoBanners.map((banner, idx) => (
                <div
                  key={banner._id || idx}
                  className="group relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)`,
                  }}
                >
                  <div className="space-y-2 text-white z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      Global Platform Banner
                    </span>
                    <h4 className="text-xl font-black">{banner.title || "Platform Flash Sale"}</h4>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">
                      {banner.subtitle || banner.description || "Limited time promotional banner offer available across all stores."}
                    </p>
                  </div>

                  {banner.code && (
                    <div className="pt-4 flex items-center justify-between z-10">
                      <span className="font-mono font-black text-xs text-amber-300 bg-black/40 px-3 py-1 rounded-xl">
                        CODE: {banner.code}
                      </span>
                      <button
                        onClick={(e) => handleCopyCode(banner.code, e)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white text-slate-900 shadow-xs cursor-pointer"
                      >
                        Copy Code
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by code, offer title, business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#004ac6] focus:bg-white transition"
              />
            </div>

            {/* Scope Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {[
                { key: "All", label: "All Deals", count: scopeCounts.All },
                { key: "global", label: "🌐 Global Platform", count: scopeCounts.global },
                { key: "business", label: "🏢 Business", count: scopeCounts.business },
                { key: "vendor", label: "🏪 Vendors", count: scopeCounts.vendor },
                { key: "product", label: "📦 Products", count: scopeCounts.product },
              ].map((scopeItem) => (
                <button
                  key={scopeItem.key}
                  onClick={() => setSelectedScope(scopeItem.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedScope === scopeItem.key
                      ? "bg-[#004ac6] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span>{scopeItem.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedScope === scopeItem.key
                        ? "bg-white/25 text-white font-black"
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
                deal.targetProducts
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
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-[#F8FAFC] border-r border-slate-200/80 rounded-r-full z-20 pointer-events-none" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-[#F8FAFC] border-l border-slate-200/80 rounded-l-full z-20 pointer-events-none" />

                  {/* Header Banner Section */}
                  <div className="p-6 pb-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100 relative">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${scopeInfo.bg}`}
                      >
                        <ScopeIcon size={12} />
                        <span>{scopeInfo.label}</span>
                      </span>

                      {deal.discountAmount !== undefined && (
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-2xs">
                          {deal.discountType === "percentage"
                            ? `${deal.discountAmount}% OFF`
                            : `FLAT ₹${deal.discountAmount} OFF`}
                        </span>
                      )}
                    </div>

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

                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
                        {deal.minOrderAmount > 0 && (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-extrabold">
                            Min Spend: ₹{deal.minOrderAmount}
                          </span>
                        )}
                        {deal.maxDiscountAmount > 0 && (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-extrabold">
                            Max Cap: ₹{deal.maxDiscountAmount}
                          </span>
                        )}
                        {formattedExpiry && (
                          <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 font-black">
                            <Clock size={11} /> Valid Till: {formattedExpiry}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {code ? (
                        <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-dashed border-blue-300 rounded-2xl p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                              Promo Voucher Code
                            </p>
                            <p className="text-base font-mono font-black text-slate-900 tracking-wider truncate">
                              {code}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(code, e)}
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
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

                      <button
                        type="button"
                        onClick={() => handleNavigateToTarget(deal)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#004ac6] bg-white hover:bg-blue-50/50 text-slate-900 hover:text-[#004ac6] text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>
                          {deal.targetScope === "product"
                            ? "Explore Product Deal"
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
              There are currently no active promotional coupons or offers matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedScope("All");
              }}
              className="inline-flex items-center gap-2 bg-[#004ac6] text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Offers;
