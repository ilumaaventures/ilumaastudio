import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tag,
  Gift,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Globe,
  Store,
  ShoppingBag,
  Package,
  Clock,
  ArrowRight,
  Flame,
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

  // Carousel ref and scroll indicator state
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);

  useEffect(() => {
    let isMounted = true;
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

        // Format combined dataset purely from real backend API
        const combined = [
          ...couponList.map((c) => ({
            _id: c._id,
            itemType: "coupon",
            title: c.title || `Save with ${c.code}`,
            code: c.code,
            discountType: c.discountType,
            discountAmount: c.discountAmount,
            maxDiscountAmount: c.maxDiscountAmount,
            minOrderAmount: c.minOrderAmount,
            targetScope: c.targetScope || "global",
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
            itemType: "offer",
            title: o.title || "Promotional Platform Offer",
            headline: o.headline || o.subtitle || "Exclusive Deal",
            code:
              o.code || (o.associatedCoupon ? o.associatedCoupon.code : null),
            targetScope: o.targetScope || "global",
            business: o.business,
            vendor: o.vendor,
            image: o.image || o.bannerImage,
            expiryDate: o.expiryDate || o.expiry,
            subtitle:
              o.desc || o.description || "Limited time promotional offer",
          })),
        ];

        if (isMounted) {
          // Strictly map real backend data without mock injection
          setDeals(combined);
        }
      } catch (err) {
        console.error("Failed to load real home page deals:", err);
        if (isMounted) {
          setDeals([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeDeals();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update left/right scrollable status
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll, { passive: true });
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [deals]);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const amount = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setDraggedDistance(0);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    setDraggedDistance(Math.abs(walk));
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleCopyCode = (code, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!code) return;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopiedCode(code);
    toast.success(`Coupon Code '${code}' copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCardClick = (deal) => {
    if (draggedDistance > 10) return;

    if (deal.targetProducts && deal.targetProducts.length > 0) {
      const prod = deal.targetProducts[0];
      const prodId = typeof prod === "object" ? prod._id : prod;
      if (prodId) {
        navigate(`/products/${prodId}`);
        return;
      }
    }

    if (deal.vendor) {
      const vObj = deal.vendor;
      const vSlug =
        typeof vObj === "object" ? vObj.slug || vObj.storeName : null;
      if (vSlug) {
        navigate(`/store`);
        return;
      }
    }

    if (deal.business) {
      const bObj = deal.business;
      const bSlug =
        typeof bObj === "object" ? bObj.subdomain || bObj.slug : null;
      if (bSlug) {
        navigate(`/${bSlug}`);
        return;
      }
    }

    navigate("/offers");
  };

  const getScopeBadge = (scope, businessObj, vendorObj) => {
    switch (scope?.toLowerCase()) {
      case "global":
        return {
          label: "Global Platform",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Globe,
          owner: "Platform Wide",
        };
      case "business":
        const bizName =
          typeof businessObj === "object"
            ? businessObj?.businessName
            : "Storewide Deal";
        return {
          label: "Store Offer",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Store,
          owner: bizName || "Storewide Discount",
        };
      case "vendor":
        const vName =
          typeof vendorObj === "object" ? vendorObj?.storeName : "Vendor Special";
        return {
          label: "Vendor Deal",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: ShoppingBag,
          owner: vName || "Vendor Promotion",
        };
      case "product":
        return {
          label: "Product Deal",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Package,
          owner: "Selected Product",
        };
      default:
        return {
          label: "Special Offer",
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: Sparkles,
          owner: "Promotional Discount",
        };
    }
  };

  // Only render if real deals are present in backend
  if (!loading && deals.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                <Flame size={12} className="fill-rose-600 text-rose-600" />
                <span>Active Offers & Coupons</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Exclusive Discounts & Store Vouchers
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live promotional discount vouchers and merchant codes directly mapped from our network.
            </p>
          </div>

          {/* Controls: Left/Right Buttons & View All Link */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll Left"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll Right"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollRight
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>

            <Link
              to="/offers"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0 ml-1"
            >
              <span>See All</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Shimmer Skeleton or Real Deals Track */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden py-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-white border border-slate-200 rounded-3xl p-5 h-44 shadow-xs space-y-3"
              >
                <div className="h-4 bg-slate-200 rounded-md w-1/3 shimmer-placeholder" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4 shimmer-placeholder" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2 shimmer-placeholder" />
                <div className="h-10 bg-slate-100 rounded-2xl w-full mt-auto shimmer-placeholder" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />
            )}

            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex items-stretch gap-4 sm:gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-2 px-1 select-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {deals.map((deal, idx) => {
                const scopeInfo = getScopeBadge(
                  deal.targetScope,
                  deal.business,
                  deal.vendor
                );
                const ScopeIcon = scopeInfo.icon;
                const formattedExp = formatExpiryDate(deal.expiryDate);
                const isCopied = copiedCode === deal.code;

                return (
                  <div
                    key={deal._id || idx}
                    onClick={() => handleCardClick(deal)}
                    className="group relative w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-white border border-slate-200/90 hover:border-[#004ac6]/60 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Perforated Side Ticket Notches */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-50 border-r border-slate-200 rounded-r-full z-10 pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-50 border-l border-slate-200 rounded-l-full z-10 pointer-events-none" />

                    {/* Top Content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${scopeInfo.bg}`}
                        >
                          <ScopeIcon size={11} />
                          <span>{scopeInfo.label}</span>
                        </span>

                        {deal.discountAmount !== undefined && deal.discountAmount > 0 && (
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

                    {/* Voucher Code Box & Quick Action */}
                    <div className="pt-3 space-y-2 mt-2">
                      {deal.code ? (
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-dashed border-blue-300 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Voucher Code
                            </p>
                            <p className="text-xs font-mono font-black text-slate-900 tracking-wider truncate">
                              {deal.code}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(deal.code, e)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-2xs cursor-pointer shrink-0 active:scale-95 ${
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
          </div>
        )}
      </div>
    </section>
  );
}

export default CouponsOffers;
