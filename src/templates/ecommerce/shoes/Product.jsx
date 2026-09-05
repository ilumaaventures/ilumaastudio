import React, { useState, useMemo } from "react";
import {
  Search,
  Sliders,
  Zap,
  Flame,
  ArrowUpDown,
  Grid,
  List,
  Check,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function Product({
  products = [],
  onSelectProduct = () => {},
  onAddToCart = () => {},
  sizeStandard = "US",
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTech, setSelectedTech] = useState("all");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "telemetry-table"

  const categories = [
    { id: "all", label: "All Silhouettes" },
    { id: "Running", label: "Carbon Marathon" },
    { id: "Basketball", label: "Court '85 Retro" },
    { id: "Luxury Casual", label: "Italian Artisan" },
    { id: "Outdoor Trail", label: "Vibram Trail" },
    { id: "Streetwear", label: "Horizon Chunky" },
  ];

  const techFilters = [
    { id: "all", label: "All Sole Tech" },
    { id: "carbon", label: "Curved Carbon Plate" },
    { id: "nitro", label: "Nitrogen Supercritical Foam" },
    { id: "vibram", label: "Vibram Megagrip" },
    { id: "margom", label: "Margom Italian Cupsole" },
  ];

  const sizeOptions = ["all", "7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13"];

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          if (p.category !== selectedCategory) return false;
        }

        // Tech filter
        if (selectedTech !== "all") {
          const techKey = selectedTech.toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const tag = (p.propulsionTag || "").toLowerCase();
          if (!desc.includes(techKey) && !tag.includes(techKey)) return false;
        }

        // Size filter
        if (selectedSizeFilter !== "all") {
          if (p.sizes && !p.sizes.includes(selectedSizeFilter)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "return-high") {
          const retA = parseInt(a.energyReturn || "80", 10);
          const retB = parseInt(b.energyReturn || "80", 10);
          return retB - retA;
        }
        return 0; // featured
      });
  }, [products, searchQuery, selectedCategory, selectedTech, selectedSizeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#121217] to-zinc-950 p-6 sm:p-10 rounded-3xl border border-zinc-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
            <Zap size={14} />
            <span>AUTHENTIC DEADSTOCK ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-mono tracking-tight leading-tight">
            The Sneaker Vault
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
            Every silhouette is engineered with biomechanical propulsion, inspected for counterfeit stitching, and verified through our dual-step RFID tagging protocol.
          </p>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 font-mono font-black text-8xl text-zinc-800/15 select-none pointer-events-none tracking-tighter">
          VAULT
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
        {/* Category Silhouettes Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-lime-400 text-black border-lime-400 shadow-md shadow-lime-500/20"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Row 2: Tech Filter + Size Filters + Sort + View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/60 font-mono text-xs">
          {/* Quick Size Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">
              {sizeStandard} SIZE:
            </span>
            {sizeOptions.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(sz)}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                  selectedSizeFilter === sz
                    ? "bg-lime-400 text-black border-lime-400"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {sz === "all" ? "All Sizes" : sz}
              </button>
            ))}
          </div>

          {/* Sort & Table/Grid Toggle */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-xl border border-zinc-800 focus:border-lime-400 outline-none cursor-pointer"
              >
                <option value="featured">Featured Drop</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="return-high">Highest Energy Return</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-lime-400 text-black font-black" : "text-zinc-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode("telemetry-table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "telemetry-table" ? "bg-lime-400 text-black font-black" : "text-zinc-400 hover:text-white"
                }`}
                title="Sole Telemetry Table"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedCategory !== "all" || selectedSizeFilter !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-zinc-400">
            <span>Active filters:</span>
            {selectedCategory !== "all" && (
              <span className="bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded border border-lime-500/30 flex items-center gap-1">
                {selectedCategory}
                <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </span>
            )}
            {selectedSizeFilter !== "all" && (
              <span className="bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded border border-lime-500/30 flex items-center gap-1">
                Size {selectedSizeFilter}
                <X size={12} className="cursor-pointer" onClick={() => setSelectedSizeFilter("all")} />
              </span>
            )}
            {searchQuery && (
              <span className="bg-zinc-800 text-white px-2 py-0.5 rounded flex items-center gap-1">
                "{searchQuery}"
                <X size={12} className="cursor-pointer" onClick={() => setSearchQuery("")} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSizeFilter("all");
                setSearchQuery("");
              }}
              className="text-xs text-lime-400 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Catalog Results */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-zinc-950 rounded-3xl border border-zinc-800">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-mono font-bold text-white">No silhouettes match your query</h3>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
            Try adjusting your silhouette category, shoe size filters, or clear your search terms.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSizeFilter("all");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs uppercase"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((shoe) => (
            <ProductCard
              key={shoe._id}
              product={shoe}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              sizeStandard={sizeStandard}
            />
          ))}
        </div>
      ) : (
        /* Sole Telemetry Table View */
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden font-mono text-xs shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#111115] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4 pl-6">Silhouette</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Propulsion Midsole</th>
                  <th className="p-4">Heel Drop</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Energy Return</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filteredProducts.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => onSelectProduct(item)}
                    className="hover:bg-zinc-900/60 transition cursor-pointer group"
                  >
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-white group-hover:text-lime-400 block transition">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-500">RFID #SC-{item._id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400">{item.category}</td>
                    <td className="p-4 text-lime-400 font-bold">{item.propulsionTag || "Nitro Supercritical"}</td>
                    <td className="p-4 text-zinc-300">{item.heelDrop || "8mm"}</td>
                    <td className="p-4 text-zinc-300">{item.weight || "185g"}</td>
                    <td className="p-4 text-lime-400 font-black">{item.energyReturn || "86%"}</td>
                    <td className="p-4 font-black text-white">₹{Number(item.price).toLocaleString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item, `${sizeStandard} 10`);
                        }}
                        className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-black font-black rounded-lg text-[10px] uppercase transition cursor-pointer"
                      >
                        Quick Cop
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
