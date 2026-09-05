import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Tag,
  Copy,
  Check,
  Bookmark,
  Coffee,
  ShoppingBag,
  ArrowRight,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onOpenStacks,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Bookstore voucher "${code}" copied to clipboard! 📜`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const bundles = [
    {
      id: "bundle-fiction",
      title: "The European Literary Fiction Box",
      badge: "Save 25% Curator Box",
      description: "Includes 'The Architecture of Solitude' + 'Chronicles of the Old Quarter' + Heavyweight Organic Canvas Literary Tote Bag.",
      price: 49.0,
      originalPrice: 66.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80",
      image2: products[1]?.image || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80",
      items: [products[0], products[1]].filter(Boolean),
    },
    {
      id: "bundle-philosophy",
      title: "The Speculative Metaphysics Trilogy",
      badge: "Save 30% Reader Set",
      description: "Includes 3 hand-bound philosophical novels exploring cybernetics, human consciousness, and memory with brass bookmark.",
      price: 58.0,
      originalPrice: 84.0,
      image1: products[2]?.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
      image2: products[3]?.image || "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=900&auto=format&fit=crop&q=80",
      items: [products[2], products[3]].filter(Boolean),
    },
  ];

  const handleAddBundle = (bundle) => {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((item) => onAddToCart(item, 1));
      toast.success(`Added bundle "${bundle.title}" to your Book Bag! 📚`);
    } else {
      toast.success("Bundle added to Book Bag!");
    }
  };

  const vouchers = [
    {
      code: "READMORE",
      discount: "15% OFF",
      desc: "Valid on all bundles of 3 or more clothbound hardcover volumes.",
      minSpend: "Orders over ₹1,500",
    },
    {
      code: "BOOKCLUB",
      discount: "FREE TOTE BAG",
      desc: "Complimentary heavyweight literary quote tote with your first order.",
      minSpend: "Orders over ₹2,000",
    },
    {
      code: "ARCHIVAL",
      discount: "FREE BOOKMARK",
      desc: "Complimentary hand-letterpressed Italian linen tassel bookmark.",
      minSpend: "All hardcover acquisitions",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-serif">
      {/* 1. Literary Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1C1917] text-[#FAF7F2] p-8 sm:p-12 border border-[#78350F]/40 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] border border-[#78350F]/40 text-[#FBBF24] text-xs font-bold">
              <Sparkles size={14} />
              <span>THE CURATED LITERARY PRESS PROMOTIONS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Curated Book Boxes & Reading Sets.
            </h1>

            <p className="text-[#D5C7B8] text-sm leading-relaxed font-sans">
              Hand-selected pairings designed for deep reading weekends. Enjoy Smyth-sewn archival hardcovers, complimentary bookmarks, and exclusive author annotations.
            </p>
          </div>

          <div className="bg-[#FAF7F2] text-[#1C1917] p-6 rounded-3xl text-center space-y-3 max-w-xs shadow-2xl flex-shrink-0">
            <span className="text-xs uppercase font-bold text-[#78350F] tracking-widest block font-sans">
              Seasonal Reader Savings
            </span>
            <span className="text-3xl font-black block">Up to 30% OFF</span>
            <p className="text-xs text-[#574B40] font-sans">
              Apply valid bookstore voucher codes at checkout or click "Copy" on any card below.
            </p>
            <button
              onClick={onOpenStacks}
              className="w-full py-3 bg-[#1C1917] hover:bg-[#292524] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore All Stacks</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Literary Vouchers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E7DFD5] pb-4">
          <Tag size={20} className="text-[#9A3412]" />
          <h2 className="text-2xl font-black text-[#1C1917]">Active Literary Vouchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-sm hover:border-[#78350F] transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-bold text-[#1C1917] block">{v.discount}</span>
                    <span className="text-[10px] uppercase font-sans font-bold text-[#78350F]">
                      {v.minSpend}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-[#FAF7F2] text-[#9A3412] border border-[#E7DFD5]">
                    <Bookmark size={16} />
                  </span>
                </div>

                <p className="text-xs text-[#574B40] leading-relaxed font-sans">{v.desc}</p>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#EFE9DF]">
                  <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-dashed border-[#78350F] font-mono font-bold text-sm text-[#1C1917]">
                    {v.code}
                  </div>

                  <button
                    onClick={() => handleCopy(v.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? "bg-[#15803D] text-white"
                        : "bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1C1917] border border-[#D5C7B8]"
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

      {/* 3. Book Boxes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
          <h2 className="text-2xl font-black text-[#1C1917]">Curated Seasonal Book Boxes</h2>
          <span className="text-xs text-[#78350F]">Hand-Selected Volumes & Extras</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-6 hover:border-[#78350F] transition shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-[#1C1917] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#1C1917] block">₹{bundle.price.toFixed(2)}</span>
                    <span className="text-xs text-[#8C7A6B] line-through font-sans">
                      ₹{bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#1C1917]">{bundle.title}</h3>
                <p className="text-xs text-[#574B40] leading-relaxed font-sans">{bundle.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7DFD5]">
                    <img src={bundle.image1} alt="Book 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7DFD5]">
                    <img src={bundle.image2} alt="Book 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE9DF] flex items-center justify-between">
                <span className="text-[11px] text-[#9A3412] flex items-center gap-1 font-sans">
                  <Award size={14} /> Includes Custom Cotton Tote Bag
                </span>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Acquire Book Box</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
