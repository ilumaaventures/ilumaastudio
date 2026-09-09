import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  ThermometerSnowflake,
  Clock,
  Leaf,
  Activity,
  Award,
  CheckCircle2,
  Layers,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

export default function FreshnessLab({ onNavigateToAisles }) {
  // Harvest Time Slider in hours: 6h to 72h
  const [supplyHours, setSupplyHours] = useState(14);

  // Dynamic nutrient calculation
  const vitaminCRetention = Math.max(
    38,
    Math.round(98 - (supplyHours - 6) * 0.9)
  );
  const enzymeActivity = Math.max(
    30,
    Math.round(96 - (supplyHours - 6) * 1.05)
  );
  const crunchScore = Math.max(
    42,
    Math.round(99 - (supplyHours - 6) * 0.85)
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left font-sans animate-fade-in">
      {/* ================= 1. HERO ================= */}
      <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#065F46] text-white p-8 sm:p-14 border border-emerald-400/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
            <Sparkles size={14} className="text-yellow-300" />
            <span>FARM-TO-FORK TRANSPARENCY & SCIENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Science of 30-Minute Farm Freshness.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Conventional grocery store produce spends an average of 5 to 7 days in transit, losing up to 60% of its vital antioxidants. FreshMart harvest cycles bridge the orchard to your kitchen in under 24 hours.
          </p>
        </div>
      </div>

      {/* ================= 2. INTERACTIVE HARVEST CLOCK SIMULATOR ================= */}
      <div className="p-8 sm:p-12 rounded-[32px] bg-white border border-emerald-100 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Interactive Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Nutrient Degradation Over Transit Hours
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Drag the timeline slider to visualize how rapid cold-chain delivery protects cellular nutrient density.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-[#15803D] font-bold text-sm">
            <Clock size={16} />
            <span>Time Since Harvest: {supplyHours} Hours</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span className="text-emerald-700">🌱 FreshMart Standard (6–18 Hours)</span>
            <span className="text-slate-400">Regional Warehousing (36 Hours)</span>
            <span className="text-rose-600">Conventional Supermarkets (72+ Hours)</span>
          </div>

          <input
            type="range"
            min="6"
            max="72"
            step="1"
            value={supplyHours}
            onChange={(e) => setSupplyHours(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#15803D]"
          />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Vitamin C */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Active Vitamin C
              </span>
              <Activity size={18} className="text-emerald-600" />
            </div>
            <div className="text-4xl font-black text-[#15803D]">
              {vitaminCRetention}%
            </div>
            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${vitaminCRetention}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-800">
              {supplyHours <= 20
                ? "Peak bioavailability and maximum immune-protective antioxidants."
                : "Ascorbic acid degrades rapidly once detached from vine without refrigeration."}
            </p>
          </div>

          {/* Card 2: Enzyme Activity */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Living Enzymes
              </span>
              <Sparkles size={18} className="text-amber-600" />
            </div>
            <div className="text-4xl font-black text-amber-700">
              {enzymeActivity}%
            </div>
            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${enzymeActivity}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-800">
              {supplyHours <= 20
                ? "Intact digestive enzymes aiding gut bioavailability."
                : "Cellular respiration ceases, diminishing natural enzymatic potency."}
            </p>
          </div>

          {/* Card 3: Crispness & Brix */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Crispness & Brix Sugar
              </span>
              <ShieldCheck size={18} className="text-slate-600" />
            </div>
            <div className="text-4xl font-black text-slate-900">
              {crunchScore}%
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-700 rounded-full transition-all duration-300"
                style={{ width: `${crunchScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600">
              {supplyHours <= 20
                ? "Turgor cell pressure remains intact for extraordinary orchard crunch."
                : "Moisture evaporation leads to soft textures and diminished aromatic bouquet."}
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. COLD CHAIN & LABORATORY PROTOCOL ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cold-Chain Telemetry */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <ThermometerSnowflake size={22} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Unbroken 4°C Insulated Cold-Chain
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every harvest crate leaves the farm in temperature-stabilized vehicles and enters our micro-fulfillment centers within 90 minutes. Electric couriers carry insulated coolers lined with dry ice gel packs to prevent thermal shock.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Target Temp: 2°C – 4°C
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Humidity: 88% Controlled
            </span>
          </div>
        </div>

        {/* Laboratory Testing Certificate */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Triple Laboratory Residue Verification
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All produce lots are screened using high-precision liquid chromatography (HPLC-MS) for 400+ agricultural synthetic pesticides, herbicides, and artificial ripeners. Zero detected residues across all certified growers.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Latest Batch Test: PASSED (0.00 ppm)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 4. CTA BANNER ================= */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-[#15803D] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black">
            Taste the 30-Minute Organic Difference Today.
          </h3>
          <p className="text-xs text-emerald-100">
            Orchard-picked honeycrisps, freshly baked sourdoughs, and raw mountain honey.
          </p>
        </div>

        <button
          onClick={onNavigateToAisles}
          className="px-8 py-3.5 rounded-2xl bg-white text-[#15803D] hover:bg-emerald-50 text-xs font-black uppercase tracking-wider transition shadow-md shrink-0 cursor-pointer"
        >
          Explore Fresh Aisles →
        </button>
      </div>
    </div>
  );
}
