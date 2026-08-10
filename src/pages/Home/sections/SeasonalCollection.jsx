import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SEASONS = [
  {
    id: "festive",
    tabLabel: "Festive Spark ✨",
    title: "The Regal Festive Collection",
    tagline: "Illuminating Indian Celebrations",
    description: "Discover brass urlis, marigold-scented incense cones, hand-painted clay diyas, and premium corporate hampers perfect for Diwali, Eid, and grand weddings.",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=650&auto=format&fit=crop",
    link: "/shop?season=festive"
  },
  {
    id: "summer",
    tabLabel: "Summer Air 🍃",
    title: "The Breezy Summer Vibe",
    tagline: "Light, Floral & Organic Essentials",
    description: "Welcome the warmth with lemongrass diffusers, natural block-print table linens, handcrafted terracotta water pots, and fresh aromatherapy oils.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=650&auto=format&fit=crop",
    link: "/shop?season=summer"
  },
  {
    id: "winter",
    tabLabel: "Winter Cozy ☕",
    title: "Cozy Winter Snug",
    tagline: "Rich Aromatics & Heavy Weaves",
    description: "Indulge in warming sandalwood candles, double-woven wool throws, gourmet hot chocolate kits, and artisanal wood-turned serverware.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=650&auto=format&fit=crop",
    link: "/shop?season=winter"
  }
];

function SeasonalCollection() {
  const [activeSeasonId, setActiveSeasonId] = useState("festive");
  const activeSeason = SEASONS.find(s => s.id === activeSeasonId);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[#C9956C] font-semibold text-xs uppercase tracking-widest block">
              Annual Cycles
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Seasonal Collection
            </h2>
          </div>

          {/* Season Tabs */}
          <div className="flex gap-1.5 bg-gray-50 border border-gray-100 p-1.5 rounded-2xl">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeasonId(s.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeSeasonId === s.id
                    ? "bg-[#C9956C] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#111]"
                }`}
              >
                {s.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Season Detail Card */}
        <div className="bg-[#FAFAF9] rounded-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row h-full">
          {/* Left Description */}
          <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9956C]">
                <Sparkles size={13} />
                <span>{activeSeason.tagline}</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
                  {activeSeason.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {activeSeason.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <Link
                to={activeSeason.link}
                className="group inline-flex items-center gap-2 bg-black hover:bg-[#C9956C] text-white text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl shadow-sm transition-all"
              >
                <span>View Full Catalog</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 aspect-[4/3] md:aspect-auto min-h-[300px] relative bg-gray-200">
            <img
              src={activeSeason.image}
              alt={activeSeason.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeasonalCollection;
