import React, { useState, useMemo } from "react";
import { Search, Calendar, Clock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function ServicesCatalogPage({
  services = [],
  onOpenBooking,
  themeColors = {},
  business = {},
}) {
  const [search, setSearch] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("all");

  const primaryColor = themeColors.primary || "#4F46E5";

  // Unique tags/badges from services
  const badges = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.badge) set.add(s.badge);
      if (s.duration) set.add(s.duration);
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchBadge =
        selectedBadge === "all" ||
        srv.badge === selectedBadge ||
        srv.duration === selectedBadge;

      const q = search.toLowerCase();
      const matchSearch =
        !search.trim() ||
        (srv.serviceName || srv.name || "").toLowerCase().includes(q) ||
        (srv.description || "").toLowerCase().includes(q);

      return matchBadge && matchSearch;
    });
  }, [services, selectedBadge, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 font-sans">
      {/* Title */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Complete Service Offerings & Menu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Services & Pricing ({filteredServices.length})
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by service name, specialty, technique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden"
          />
        </div>

        {badges.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedBadge("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                selectedBadge === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            {badges.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBadge(b)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedBadge === b
                    ? "text-white shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                style={selectedBadge === b ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv._id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={srv.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"}
                  alt={srv.serviceName || srv.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {srv.badge || srv.duration || "Service"}
                </span>
                {srv.duration && (
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={12} /> {srv.duration}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {srv.serviceName || srv.name}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {srv.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-base font-black text-slate-900">
                ₹{Number(srv.price).toFixed(2)}
              </span>
              <button
                onClick={() => onOpenBooking && onOpenBooking(srv)}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar size={13} />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
