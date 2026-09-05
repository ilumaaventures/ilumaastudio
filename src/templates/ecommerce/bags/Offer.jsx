import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  Tag,
  Copy,
  Check,
  Award,
  ShieldCheck,
  ShoppingBag,
  Plane,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onOpenCatalog,
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState("Delta");

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Atelier voucher "${code}" copied to clipboard! ✨`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const bundles = [
    {
      id: "bundle-executive",
      title: "The Executive Travel Suite",
      badge: "Save 20% Atelier Set",
      description: "Executive Full-Grain Briefcase + Minimalist Day Tote. Cut from matching Vachetta Tan hides with solid brass closures.",
      price: 548.0,
      originalPrice: 680.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      image2: products[2]?.image || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      items: [products[0], products[2]].filter(Boolean),
    },
    {
      id: "bundle-voyager",
      title: "The Tuscan 48-Hour Voyager",
      badge: "Save 25% Heritage",
      description: "Heritage Weekender Duffel + Urban Commuter Roll-Top Backpack. Padded ergonomics for train journeys and long-haul flights.",
      price: 599.0,
      originalPrice: 800.0,
      image1: products[1]?.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      image2: products[3]?.image || "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
      items: [products[1], products[3]].filter(Boolean),
    },
  ];

  const handleAddBundle = (bundle) => {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((item) => onAddToCart(item, 1));
      toast.success(`Added bundle "${bundle.title}" to Carry Cart with instant set discount! 🧳`);
    } else {
      toast.success("Bundle added to Carry Cart!");
    }
  };

  const vouchers = [
    {
      code: "TUSCANY20",
      discount: "20% OFF",
      desc: "Valid on all Vachetta and Cognac leather weekenders and briefcases.",
      minSpend: "Orders over ₹18,000",
    },
    {
      code: "BESPOKEFREE",
      discount: "FREE 24K MONOGRAM",
      desc: "Complimentary hot-foil initials stamping on all orders.",
      minSpend: "No minimum required",
    },
    {
      code: "HERITAGECARE",
      discount: "FREE BALM KIT",
      desc: "Complimentary organic beeswax leather conditioner & cotton buffing cloth.",
      minSpend: "Orders over ₹25,000",
    },
  ];

  const airlineCompliance = {
    Delta: { maxDims: "56 x 36 x 23 cm", status: "100% Compliant as Overhead Carry-On" },
    Emirates: { maxDims: "55 x 38 x 20 cm", status: "100% Compliant as Overhead Carry-On" },
    Lufthansa: { maxDims: "55 x 40 x 23 cm", status: "100% Compliant as Overhead Carry-On" },
    "British Airways": { maxDims: "56 x 45 x 25 cm", status: "100% Compliant (Ample Room)" },
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-serif">
      {/* 1. Atelier Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#2C1810] text-[#FAF7F2] p-8 sm:p-12 border border-[#8C6D58]/40 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D2217] border border-[#8C6D58]/40 text-[#FBBF24] text-xs font-serif font-bold">
              <Sparkles size={14} />
              <span>BESPOKE ATELIER PROMOTIONS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Heritage Sets & Curated Travel Bundles.
            </h1>

            <p className="text-[#D5C7B8] text-sm leading-relaxed font-sans">
              Pair matching leather silhouettes for seamless travel. Enjoy guaranteed carry-on compliance, complimentary foil monogramming, and heirloom leather longevity.
            </p>
          </div>

          <div className="bg-[#FAF7F2] text-[#2C1810] p-6 rounded-3xl text-center space-y-3 max-w-xs shadow-2xl flex-shrink-0">
            <span className="text-xs uppercase font-bold text-[#8C6D58] tracking-widest block">
              Curated Travel Savings
            </span>
            <span className="text-3xl font-black block">Up to 25% OFF</span>
            <p className="text-xs text-[#6B5344] font-sans">
              Apply valid atelier promo codes at checkout or click "Copy" on any card below.
            </p>
            <button
              onClick={onOpenCatalog}
              className="w-full py-3 bg-[#2C1810] hover:bg-[#3D2217] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <span>Explore All Silhouettes</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Vouchers */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E7DFD5] pb-4">
          <Tag size={20} className="text-[#B45309]" />
          <h2 className="text-2xl font-black text-[#2C1810]">Atelier Promotional Vouchers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                className="bg-white rounded-3xl border border-[#E7DFD5] p-6 space-y-4 shadow-sm hover:border-[#8C6D58] transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-bold text-[#2C1810] block">{v.discount}</span>
                    <span className="text-[10px] uppercase font-sans font-bold text-[#8C6D58]">
                      {v.minSpend}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-[#FAF7F2] text-[#B45309] border border-[#E7DFD5]">
                    <Sparkles size={16} />
                  </span>
                </div>

                <p className="text-xs text-[#6B5344] leading-relaxed font-sans">{v.desc}</p>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#EFE9DF]">
                  <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-dashed border-[#8C6D58] font-mono font-bold text-sm text-[#2C1810]">
                    {v.code}
                  </div>

                  <button
                    onClick={() => handleCopy(v.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? "bg-[#16A34A] text-white"
                        : "bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#2C1810] border border-[#D5C7B8]"
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

      {/* 3. Bundles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
          <h2 className="text-2xl font-black text-[#2C1810]">Curated Heritage Luggage Bundles</h2>
          <span className="text-xs text-[#8C6D58]">Matching Tuscan Hides</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-6 hover:border-[#8C6D58] transition shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-[#2C1810] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#2C1810] block">₹{bundle.price.toFixed(2)}</span>
                    <span className="text-xs text-[#8C6D58] line-through font-sans">
                      ₹{bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#2C1810]">{bundle.title}</h3>
                <p className="text-xs text-[#6B5344] leading-relaxed font-sans">{bundle.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7DFD5]">
                    <img src={bundle.image1} alt="Bundle 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7DFD5]">
                    <img src={bundle.image2} alt="Bundle 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE9DF] flex items-center justify-between">
                <span className="text-[11px] text-[#B45309] font-serif flex items-center gap-1">
                  <ShieldCheck size={14} /> Lifetime Stitching Included
                </span>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="px-5 py-2.5 bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 cursor-pointer shadow active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Acquire Heritage Set</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Carry-On Airline Checker */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Plane size={20} className="text-[#B45309]" />
          <h3 className="text-xl font-black text-[#2C1810]">
            Airline Carry-On Luggage Compliance Checker
          </h3>
        </div>
        <p className="text-xs text-[#6B5344] font-sans">
          Verify that "The Weekender 48-Hour Heritage Duffel" fits the overhead bins of your preferred international carrier.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#8C6D58] uppercase mb-1 font-sans">
              Select International Carrier
            </label>
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="w-full bg-white text-xs text-[#2C1810] p-3 rounded-xl border border-[#D5C7B8] focus:border-[#B45309] focus:outline-none cursor-pointer"
            >
              <option value="Delta">Delta Air Lines (Domestic & International)</option>
              <option value="Emirates">Emirates (A380 / Boeing 777)</option>
              <option value="Lufthansa">Lufthansa (European & Long-Haul)</option>
              <option value="British Airways">British Airways (Club World & World Traveller)</option>
            </select>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7DFD5] flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-[#8C6D58] font-sans">
              Max Dimensions for {selectedAirline}: {airlineCompliance[selectedAirline]?.maxDims}
            </span>
            <span className="text-sm font-bold text-[#16A34A] mt-1 flex items-center gap-1.5">
              <Check size={16} /> {airlineCompliance[selectedAirline]?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
