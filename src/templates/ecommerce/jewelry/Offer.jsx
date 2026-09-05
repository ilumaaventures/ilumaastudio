import React, { useState } from "react";
import {
  Gem,
  Sparkles,
  Tag,
  Copy,
  Check,
  Award,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onOpenVault,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Salon voucher "${code}" copied to clipboard! 💎`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const bundles = [
    {
      id: "bundle-bridal",
      title: "The Royal Solitaire Bridal Parure",
      badge: "Save 20% Parure Suite",
      description: "Includes 1.50ct Solitaire Ring + Matching Pavé Wedding Band + Diamond Stud Earrings. Hand-set in Geneva.",
      price: 2450.0,
      originalPrice: 3060.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      image2: products[1]?.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      items: [products[0], products[1]].filter(Boolean),
    },
    {
      id: "bundle-emerald",
      title: "The Imperial Emerald & Diamond Gala Set",
      badge: "Save 25% High Jewelry",
      description: "Certified unheated Colombian emerald pendant with brilliant-cut halo pave and matching drop earrings.",
      price: 3200.0,
      originalPrice: 4260.0,
      image1: products[2]?.image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
      image2: products[3]?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
      items: [products[2], products[3]].filter(Boolean),
    },
  ];

  const handleAddBundle = (bundle) => {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((item) => onAddToCart(item, 1));
      toast.success(`Added suite "${bundle.title}" to your Jewel Box! 💍`);
    } else {
      toast.success("Suite added to Jewel Box!");
    }
  };

  const vouchers = [
    {
      code: "ROYALJEWEL",
      discount: "₹25,000 OFF",
      desc: "Privileged acquisition grant applied to multi-carat high jewelry suites.",
      minSpend: "Orders over ₹150,000",
    },
    {
      code: "PLATINUMUPGRADE",
      discount: "FREE PLATINUM",
      desc: "Complimentary metallurgical upgrade from 18k Gold to Platinum 950.",
      minSpend: "All solitaire orders",
    },
    {
      code: "ARMOREDFREIGHT",
      discount: "ARMORED FREIGHT",
      desc: "Complimentary armored courier transport with diplomatic security seal.",
      minSpend: "All orders worldwide",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-serif">
      {/* 1. Haute Joaillerie Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121216] via-[#1A181F] to-[#121216] text-[#FAFAFA] p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#231F18] border border-[#D4AF37]/40 text-[#FBBF24] text-xs font-bold font-sans">
              <Sparkles size={14} />
              <span>PRIVATE SALON PRIVILEGES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Heirloom Parures & High Jewelry Suites.
            </h1>

            <p className="text-[#A89F91] text-sm leading-relaxed font-sans">
              Experience the harmony of coordinated high jewelry suites. Pair solitaires with pavé bands and certified diamond necklaces with up to 25% in curated suite privileges.
            </p>
          </div>

          <div className="bg-[#0A0A0C] text-[#FAFAFA] border border-[#D4AF37]/40 p-6 rounded-3xl text-center space-y-3 max-w-xs shadow-2xl flex-shrink-0">
            <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-widest block font-sans">
              Curated Suite Grant
            </span>
            <span className="text-3xl font-bold text-[#FBBF24] block">Up to 25% OFF</span>
            <p className="text-xs text-[#A89F91] font-sans">
              Apply valid atelier voucher grants at checkout or click "Copy" below.
            </p>
            <button
              onClick={onOpenVault}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#B88622] text-[#0A0A0C] font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore High Jewelry Vault</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Privileged Vouchers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#D4AF37]/25 pb-4">
          <Tag size={20} className="text-[#D4AF37]" />
          <h2 className="text-2xl font-black text-[#FAFAFA]">Geneva Salon Acquisition Vouchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                className="bg-[#0E0E12] rounded-3xl border border-[#D4AF37]/25 p-6 space-y-4 shadow-sm hover:border-[#D4AF37] transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-bold text-[#FBBF24] block font-sans">{v.discount}</span>
                    <span className="text-[10px] uppercase font-sans font-bold text-[#A89F91]">
                      {v.minSpend}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-[#141418] text-[#D4AF37] border border-[#D4AF37]/30">
                    <Sparkles size={16} />
                  </span>
                </div>

                <p className="text-xs text-[#A89F91] leading-relaxed font-sans">{v.desc}</p>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#1D1D24]">
                  <div className="bg-[#141418] px-3 py-1.5 rounded-xl border border-dashed border-[#D4AF37]/40 font-mono font-bold text-sm text-[#FAFAFA]">
                    {v.code}
                  </div>

                  <button
                    onClick={() => handleCopy(v.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? "bg-[#10B981] text-white"
                        : "bg-[#1C1812] hover:bg-[#2A241A] text-[#FBBF24] border border-[#D4AF37]/40"
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

      {/* 3. Heirloom Suites */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-4">
          <h2 className="text-2xl font-black text-[#FAFAFA]">Curated High Jewelry Parures</h2>
          <span className="text-xs text-[#D4AF37] font-sans">Matching GIA Certified Suites</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-[#0E0E12] rounded-3xl border border-[#D4AF37]/25 p-6 sm:p-8 space-y-6 hover:border-[#D4AF37] transition shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-[#D4AF37] text-[#0A0A0C] text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                  <div className="text-right font-sans">
                    <span className="text-2xl font-bold text-[#FBBF24] block">₹{bundle.price.toFixed(2)}</span>
                    <span className="text-xs text-[#78716C] line-through">
                      ₹{bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#FAFAFA]">{bundle.title}</h3>
                <p className="text-xs text-[#A89F91] leading-relaxed font-sans">{bundle.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#070709] border border-[#D4AF37]/20">
                    <img src={bundle.image1} alt="Jewel 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#070709] border border-[#D4AF37]/20">
                    <img src={bundle.image2} alt="Jewel 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1D1D24] flex items-center justify-between">
                <span className="text-[11px] text-[#D4AF37] font-sans flex items-center gap-1">
                  <ShieldCheck size={14} /> GIA Dossier & Diplomatic Seal
                </span>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#B88622] text-[#0A0A0C] font-black rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Acquire Parure Suite</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
