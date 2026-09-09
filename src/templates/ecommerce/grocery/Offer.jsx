import React, { useState } from "react";
import {
  Tag,
  Sparkles,
  Copy,
  Check,
  Percent,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
  Zap,
  Gift,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onNavigateToAisles,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied to clipboard! 🥦`);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  const vouchers = [
    {
      code: "FRESHSTART",
      discount: "20% OFF",
      title: "New Harvest Customer Grant",
      description: "Applies to your first 3 farm-direct organic grocery orders.",
      minSpend: "Min. basket ₹499",
      badge: "Most Popular",
      color: "from-emerald-600 to-green-700",
    },
    {
      code: "ORGANICBOX",
      discount: "₹150 OFF",
      title: "Weekly Organic Crate Grant",
      description: "Save on any seasonal fruit & vegetable farm hampers.",
      minSpend: "Min. spend ₹800",
      badge: "Farm Direct",
      color: "from-amber-600 to-yellow-600",
    },
    {
      code: "COLDCHAIN",
      discount: "FREE EXPRESS",
      title: "Complimentary 25-Min Courier",
      description: "Zero delivery fees with temperature-controlled insulated packaging.",
      minSpend: "Valid on all orders",
      badge: "No Minimum",
      color: "from-teal-600 to-emerald-700",
    },
    {
      code: "HEALTHYFAMILY",
      discount: "BUY 3 GET 1",
      title: "Pantry & Juice Stock-Up",
      description: "Buy any 3 daily staples, get a free 16oz Cold-Pressed Green Elixir.",
      minSpend: "Select Pantry items",
      badge: "Limited Time",
      color: "from-indigo-600 to-blue-700",
    },
  ];

  const bundles = [
    {
      id: "bundle-breakfast",
      title: "Artisan Baker's Sunday Breakfast Crate",
      badge: "Save 22% Crate Suite",
      description:
        "Artisan Sourdough Loaf + Pasture-Raised Grade A Eggs (12ct) + Wildflower Raw Mountain Honeycomb + Cold-Pressed Orange Elixir.",
      price: 24.5,
      originalPrice: 31.4,
      image1:
        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80",
      image2:
        "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop&q=80",
      items: [
        "Artisan Sourdough Country Loaf",
        "Pasture-Raised Organic Eggs (12pk)",
        "Raw Mountain Honeycomb (350g)",
        "Fresh Orange Elixir (16oz)",
      ],
    },
    {
      id: "bundle-detox",
      title: "7-Day Immunity & Cold-Pressed Detox Crate",
      badge: "Save 28% Wellness Pack",
      description:
        "6x Cold-Pressed Green Detox Elixirs + Organic Honeycrisp Apples + Fresh Ginger Root + Wild Turmeric Extract.",
      price: 36.0,
      originalPrice: 50.0,
      image1:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80",
      image2:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
      items: [
        "6x Cold-Pressed Green Detox Juices",
        "3 lbs Organic Honeycrisp Apples",
        "Fresh Hawaiian Ginger (250g)",
        "Raw Turmeric Shots (3ct)",
      ],
    },
    {
      id: "bundle-mediterranean",
      title: "Mediterranean Gourmet Chef Pantry Hamper",
      badge: "Save ₹450 Gourmet Set",
      description:
        "Greek Kalamata First Cold Pressed Extra Virgin Olive Oil + Bronze-Cut Tagliatelle + Aged Parmigiano Wedge + Organic Garlic.",
      price: 34.0,
      originalPrice: 44.5,
      image1:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
      image2:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
      items: [
        "Kalamata Extra Virgin Olive Oil (500ml)",
        "Artisan Bronze Tagliatelle (500g)",
        "Aged Parmigiano Reggiano (150g)",
        "Organic Heirloom Garlic Bulb",
      ],
    },
  ];

  const handleAddBundle = (bundle) => {
    const bundleProduct = {
      _id: `bundle-${bundle.id}-${Date.now()}`,
      name: bundle.title,
      price: bundle.price,
      compareAtPrice: bundle.originalPrice,
      image: bundle.image1,
      category: "Value Harvest Bundles",
      unit: "Complete Crate",
      description: bundle.description,
    };
    if (onAddToCart) {
      onAddToCart(bundleProduct, 1);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-sans animate-fade-in">
      {/* ================= 1. HERO VOUCHER BANNER ================= */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#153424] to-[#0F172A] text-white p-8 sm:p-14 border border-emerald-900/50 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
            <span>EXCLUSIVE HARVEST SAVINGS & CRATES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Farm-Direct Organic Bundles & Weekly Market Coupons.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
            Save up to 35% on certified organic groceries. Use our verified harvest coupons below or order pre-curated value crates delivered to your door in 25 minutes.
          </p>
        </div>

        {/* Decorative Badge */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* ================= 2. ACTIVE COUPON CODES ================= */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-emerald-950/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              1-Click Instant Redemption
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Active Grocery Vouchers
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any voucher to copy promo code
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                onClick={() => handleCopyCode(v.code)}
                className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group space-y-4 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {v.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {v.minSpend}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-[#15803D] group-hover:scale-105 transition-transform origin-left">
                    {v.discount}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {v.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {v.code}
                  </span>
                  <div className="text-xs font-bold text-[#15803D] flex items-center gap-1 group-hover:underline">
                    {isCopied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 3. CURATED VALUE HARVEST CRATES ================= */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-emerald-950/10 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Curated Farmer's Crates
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Handcrafted Harvest Value Bundles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete chef and wellness combinations pre-packaged in insulated coolers. One click adds all items.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => {
            const savings = (bundle.originalPrice - bundle.price).toFixed(2);
            return (
              <div
                key={bundle.id}
                className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition duration-300"
              >
                <div>
                  {/* Images Split */}
                  <div className="grid grid-cols-2 h-44 bg-slate-100 relative overflow-hidden">
                    <img
                      src={bundle.image1}
                      alt={bundle.title}
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={bundle.image2}
                      alt={bundle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-[#15803D] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                        {bundle.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {bundle.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {bundle.description}
                      </p>
                    </div>

                    {/* Items Checklist */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Included in this Crate:
                      </span>
                      {bundle.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                        >
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <div className="flex items-baseline justify-between pt-4 mb-3">
                    <div>
                      <span className="text-2xl font-black text-[#15803D]">
                        ₹{bundle.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                        ₹{bundle.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Save ₹{savings}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full py-3.5 bg-[#15803D] hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={16} />
                    <span>Add Entire Crate to Basket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 4. VIP FRESH CLUB PERKS ================= */}
      <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-emerald-50 via-[#EAF5EE] to-green-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-bold shadow-2xs border border-emerald-200">
            <Gift size={14} className="text-emerald-600" />
            <span>FRESHMART GREEN PASS CLUB</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Unlimited Free 25-Min Delivery & 5% Cashback on Every Harvest.
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Join 12,000+ local organic households. Enjoy prioritized morning harvest picking, complimentary reusable insulated cooler bags, and exclusive seasonal member tastings.
          </p>
        </div>

        <button
          onClick={() => toast.success("Green Pass activated! Free delivery applied to your cart. 🌿")}
          className="px-8 py-4 bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition shadow-lg shadow-emerald-950/20 shrink-0 cursor-pointer"
        >
          Join Green Pass for ₹99/mo
        </button>
      </div>
    </div>
  );
}
