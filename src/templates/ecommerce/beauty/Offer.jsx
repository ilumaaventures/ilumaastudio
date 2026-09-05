import React, { useState } from "react";
import {
  Sparkles,
  Tag,
  Copy,
  Check,
  Heart,
  Droplets,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onOpenCatalog,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Beauty voucher "${code}" copied to clipboard! ✨`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const bundles = [
    {
      id: "bundle-morning",
      title: "The 3-Step Morning Radiance Ritual",
      badge: "Save 25% Routine Set",
      description: "Hydra-Luminous Cleansing Milk + 2% Hyaluronic Dew Drop Serum + Barrier Repair Silk Cream. Everything you need for glass skin.",
      price: 68.0,
      originalPrice: 91.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      image2: products[1]?.image || "https://images.unsplash.com/photo-1608248597359-2451515bb529?w=800&auto=format&fit=crop&q=80",
      items: [products[0], products[1]].filter(Boolean),
    },
    {
      id: "bundle-night",
      title: "The Overnight Cell Renewal Duo",
      badge: "Save 30% VIP Ritual",
      description: "Bakuchiol Retinol-Alternative Night Elixir + Ceramide Restorative Sleeping Balm. Reawaken with calm, nourished, velvety skin.",
      price: 79.0,
      originalPrice: 113.0,
      image1: products[2]?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      image2: products[3]?.image || "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
      items: [products[2], products[3]].filter(Boolean),
    },
  ];

  const handleAddBundle = (bundle) => {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((item) => onAddToCart(item, 1));
      toast.success(`Added "${bundle.title}" to your Beauty Bag! 🌸`);
    } else {
      toast.success("Bundle added to Beauty Bag!");
    }
  };

  const vouchers = [
    {
      code: "GLOW15",
      discount: "15% OFF",
      desc: "Valid on all full-size active botanical serums and barrier moisturizers.",
      minSpend: "Orders over ₹1,999",
    },
    {
      code: "DELUXEMINI",
      discount: "FREE MINI TRIAL",
      desc: "Complimentary 15ml deluxe glass dropper sample with every purchase.",
      minSpend: "Orders over ₹2,500",
    },
    {
      code: "CLEANSHIP",
      discount: "FREE CARBON SHIPPING",
      desc: "100% carbon-neutral express delivery in recyclable compostable box.",
      minSpend: "All routine sets",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-sans">
      {/* 1. Hero Promo Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white p-8 sm:p-12 shadow-xl shadow-rose-300/30">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Gift size={14} />
              <span>SEASONAL BOTANICAL OFFERS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
              Synergistic Ritual Sets & VIP Vouchers.
            </h1>

            <p className="text-rose-100 text-sm leading-relaxed">
              Experience the power of multi-step botanical synergy. Pair cleansers, active essences, and peptide moisturizers for up to 30% in bundle savings.
            </p>
          </div>

          <div className="bg-white text-rose-950 p-6 rounded-3xl text-center space-y-3 max-w-xs shadow-2xl flex-shrink-0">
            <span className="text-xs uppercase font-bold text-rose-500 tracking-widest block">
              Curated Ritual Savings
            </span>
            <span className="text-3xl font-serif font-bold block">Up to 30% OFF</span>
            <p className="text-xs text-rose-700">
              Apply valid clean beauty vouchers at checkout or click "Copy" on any card below.
            </p>
            <button
              onClick={onOpenCatalog}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore Clean Formulas</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Active Vouchers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-4">
          <Tag size={20} className="text-rose-500" />
          <h2 className="text-2xl font-serif font-black text-rose-950">Active Clean Beauty Vouchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                className="bg-white rounded-3xl border border-rose-100 p-6 space-y-4 shadow-sm hover:border-rose-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-serif font-bold text-rose-950 block">{v.discount}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-500">
                      {v.minSpend}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
                    <Sparkles size={16} />
                  </span>
                </div>

                <p className="text-xs text-rose-800 leading-relaxed">{v.desc}</p>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-rose-100">
                  <div className="bg-rose-50 px-3 py-1.5 rounded-xl border border-dashed border-rose-300 font-mono font-bold text-sm text-rose-900">
                    {v.code}
                  </div>

                  <button
                    onClick={() => handleCopy(v.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200"
                    }`}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={13} />}
                    <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Ritual Sets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <h2 className="text-2xl font-serif font-black text-rose-950">Complete Botanical Ritual Sets</h2>
          <span className="text-xs text-rose-500">Formulated to Layer Together</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 space-y-6 hover:border-rose-300 transition shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-rose-950 block">₹{bundle.price.toFixed(2)}</span>
                    <span className="text-xs text-rose-400 line-through">
                      ₹{bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-rose-950">{bundle.title}</h3>
                <p className="text-xs text-rose-800 leading-relaxed">{bundle.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100">
                    <img src={bundle.image1} alt="Bundle 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100">
                    <img src={bundle.image2} alt="Bundle 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
                <span className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                  <ShieldCheck size={14} /> 60-Day Radiance Guarantee
                </span>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Claim Ritual Set</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
