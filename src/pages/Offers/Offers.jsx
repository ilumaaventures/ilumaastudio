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
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicOffers } from "../../api/offerService";

// Helper for safe expiry date formatting (prevents "Invalid Date")
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
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getPublicOffers();
        const list = Array.isArray(data) ? data : data?.offers || data?.data || [];
        setOffers(list);
      } catch (err) {
        console.error("Failed to load offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!code) return;

    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon Code '${code}' copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleApplyOffer = (offer) => {
    if (offer.targetUrl) {
      if (offer.targetUrl.startsWith("http")) {
        window.open(offer.targetUrl, "_blank");
      } else {
        navigate(offer.targetUrl);
      }
    } else if (offer.business) {
      const bSlug =
        typeof offer.business === "object"
          ? offer.business.slugName || offer.business.slug
          : offer.business;
      if (bSlug) navigate(`/${bSlug}`);
      else navigate("/shop");
    } else {
      navigate("/shop");
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      offer.title?.toLowerCase().includes(q) ||
      offer.headline?.toLowerCase().includes(q) ||
      offer.code?.toLowerCase().includes(q) ||
      offer.desc?.toLowerCase().includes(q) ||
      offer.description?.toLowerCase().includes(q);

    const matchesPlatform =
      selectedPlatform === "All" ||
      offer.platform?.toLowerCase() === selectedPlatform.toLowerCase();

    return matchesSearch && matchesPlatform;
  });

  // Calculate platform counts
  const platformCounts = {
    All: offers.length,
    "E-Commerce": offers.filter((o) => o.platform?.toLowerCase() === "e-commerce").length,
    Services: offers.filter((o) => o.platform?.toLowerCase() === "services").length,
    Gifting: offers.filter((o) => o.platform?.toLowerCase() === "gifting").length,
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#4f46e5] text-white p-6 sm:p-10 shadow-xl border border-blue-500/20">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-blue-100 border border-white/20">
              <Sparkles size={14} className="text-amber-300 fill-amber-300" />
              <span>Official Coupon & Offer Store</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
              Exclusive Coupons & Discount Offers
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 font-medium">
              Save big on your orders with verified promotional discount codes directly from ILumaa partners.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-blue-100">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-300" /> 100% Verified Deals
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                <Ticket size={16} className="text-amber-300" /> Instant Redeem Codes
              </span>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-24 top-0 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search coupon code, discount, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Platform Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["All", "E-Commerce", "Services", "Gifting"].map((plat) => {
              const count = platformCounts[plat] || 0;
              return (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedPlatform === plat
                      ? "bg-[#2563eb] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{plat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedPlatform === plat
                        ? "bg-white/30 text-white font-extrabold"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 h-72 animate-pulse space-y-4 shadow-2xs"
              >
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
                <div className="h-10 bg-slate-200 rounded-xl w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => {
              const code = offer.code || "DISCOUNT";
              const title = offer.title || "Special Offer";
              const headline = offer.headline || offer.subtitle || "Exclusive Partner Discount";
              const desc = offer.desc || offer.description || "Valid on eligible store orders.";
              const formattedExpiry = formatExpiryDate(offer.expiry);
              const isCopied = copiedCode === code;

              const getScopeIcon = (scope) => {
                switch (scope?.toLowerCase()) {
                  case "business":
                    return <Store size={12} />;
                  case "vendor":
                    return <ShoppingBag size={12} />;
                  case "product":
                    return <Package size={12} />;
                  default:
                    return <Globe size={12} />;
                }
              };

              return (
                <div
                  key={offer._id || offer.id || index}
                  className="group relative bg-white border border-slate-200/90 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Decorative Side Ticket Cutouts */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#FAFBFD] border-r border-slate-200/80 rounded-r-full z-20 pointer-events-none" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#FAFBFD] border-l border-slate-200/80 rounded-l-full z-20 pointer-events-none" />

                  {/* Card Header Banner Image or Styled Header */}
                  {offer.image ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={offer.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-extrabold uppercase text-blue-700 shadow-xs">
                          {offer.platform || "E-Commerce"}
                        </span>
                        {offer.targetScope && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold uppercase text-white flex items-center gap-1">
                            {getScopeIcon(offer.targetScope)}
                            <span>{offer.targetScope}</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-lg font-black leading-tight drop-shadow-sm group-hover:text-blue-200 transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-200 font-semibold truncate mt-0.5">
                          {headline}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 p-5 border-b border-slate-100 relative">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase">
                          {offer.platform || "E-Commerce"}
                        </span>
                        {offer.targetScope && (
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            {getScopeIcon(offer.targetScope)}
                            <span>Scope: {offer.targetScope}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#2563eb] transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        {headline}
                      </p>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {desc}
                    </p>

                    {/* Expiry Badge */}
                    {formattedExpiry && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                        <Clock size={13} className="text-amber-500 shrink-0" />
                        <span>Valid till {formattedExpiry}</span>
                      </div>
                    )}

                    {/* Dashed Separator */}
                    <div className="border-t border-dashed border-slate-200 my-1" />

                    {/* Promo Code Coupon Voucher Box */}
                    <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-dashed border-blue-300 rounded-2xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Promo Code
                        </p>
                        <p className="text-base font-black text-slate-900 tracking-wider truncate font-mono">
                          {code}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleCopyCode(code, e)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-[#2563eb] text-white hover:bg-blue-700"
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
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Apply / Shop Button */}
                    <button
                      onClick={() => handleApplyOffer(offer)}
                      className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>Shop Eligible Products</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Gift size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800">No Offers Found</h3>
            <p className="text-xs text-slate-500 font-medium">
              There are currently no active promotional coupons matching your filter. Check back soon for new discounts!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-2xs"
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Offers;
