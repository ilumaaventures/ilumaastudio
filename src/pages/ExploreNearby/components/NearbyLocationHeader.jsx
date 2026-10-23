import React, { useState } from "react";
import {
  MapPin,
  Search,
  Sliders,
  Navigation,
  Compass,
  Check,
  ChevronDown,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { POPULAR_EXPLORE_LOCATIONS } from "../../../data/nearbyMockData";
import { getUserLocation } from "../../../utils/location";
import toast from "react-hot-toast";

const RADIUS_OPTIONS = [5, 10, 15, 25, 50];

export default function NearbyLocationHeader({
  currentCity = "Lucknow",
  currentArea = "Gomti Nagar",
  currentPincode = "226010",
  currentRadius = 15,
  searchQuery = "",
  onSearchChange,
  onRadiusChange,
  onLocationChange,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [manualCity, setManualCity] = useState(currentCity);
  const [manualArea, setManualArea] = useState(currentArea);
  const [manualPincode, setManualPincode] = useState(currentPincode);
  const [isLocating, setIsLocating] = useState(false);

  const handleApplyLocation = (city, area, pincode) => {
    onLocationChange({
      city: city || manualCity,
      area: area || manualArea,
      pincode: pincode || manualPincode,
    });
    setIsPickerOpen(false);
    toast.success(`Location set to ${area ? `${area}, ` : ""}${city || manualCity}`);
  };

  const handleGPSDetect = async () => {
    try {
      setIsLocating(true);
      const loc = await getUserLocation();
      if (loc && (loc.city || loc.pincode)) {
        const detectedCity = loc.city || "Lucknow";
        const detectedPincode = loc.pincode || "";
        setManualCity(detectedCity);
        setManualPincode(detectedPincode);
        handleApplyLocation(detectedCity, loc.state || "", detectedPincode);
        toast.success(`Detected GPS Location: ${detectedCity}`);
      } else {
        toast.error("Could not determine precise city from GPS.");
      }
    } catch (err) {
      toast.error(err.message || "Location permission denied or unavailable.");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Top Badges & Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
              <Compass size={14} className="animate-spin-slow text-blue-400" />
              <span>Explore Near You</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-amber-300/90 font-medium">Sample local catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Local Discovery</span>
              <span className="text-blue-400 font-extrabold text-lg sm:text-xl font-mono">
                • {currentRadius} km
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Discover stores, artisan products, doorstep services, trending cafés, and neighbourhood experiences around you.
            </p>
          </div>

          {/* Active Location Card / Changer Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-left transition-all cursor-pointer group shadow-lg"
              title="Click to change location"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <MapPin size={18} />
              </div>
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
                  <span>Selected Location</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                  <span>
                    {currentArea ? `${currentArea}, ` : ""}
                    {currentCity}
                  </span>
                  {currentPincode && (
                    <span className="text-[10px] text-blue-300 font-mono">({currentPincode})</span>
                  )}
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
                </div>
              </div>
            </button>

            {/* Location Selector Dropdown Popover */}
            {isPickerOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#2563eb]" />
                    <span className="font-extrabold text-sm text-slate-900">Change Location</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* GPS detect trigger */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={handleGPSDetect}
                    disabled={isLocating}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 text-[#2563eb] hover:bg-blue-100 font-bold text-xs transition cursor-pointer border border-blue-200"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Detecting GPS Location...</span>
                      </>
                    ) : (
                      <>
                        <Navigation size={14} />
                        <span>Use My Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Popular Pre-set Hubs */}
                <div className="space-y-1.5 py-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                    Popular Hubs
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {POPULAR_EXPLORE_LOCATIONS.map((loc, idx) => {
                      const isSelected =
                        currentCity.toLowerCase() === loc.city.toLowerCase() &&
                        currentArea.toLowerCase() === loc.area.toLowerCase();
                      return (
                        <button
                          key={`${loc.city}-${loc.area}-${idx}`}
                          type="button"
                          onClick={() => handleApplyLocation(loc.city, loc.area, loc.pincode)}
                          className={`flex flex-col text-left p-2 rounded-xl border text-xs transition cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200"
                          }`}
                        >
                          <span className="font-bold truncate">{loc.area}</span>
                          <span className="text-[10px] opacity-75 truncate">{loc.city}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Entry Form */}
                <div className="space-y-2 pt-3 border-t border-slate-100 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                    Or Enter Manually
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. Lucknow)"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#2563eb]"
                    />
                    <input
                      type="text"
                      placeholder="Area (e.g. Gomti Nagar)"
                      value={manualArea}
                      onChange={(e) => setManualArea(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode (optional e.g. 226010)"
                    value={manualPincode}
                    onChange={(e) => setManualPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyLocation(manualCity, manualArea, manualPincode)}
                    className="w-full py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    Confirm & Update Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Input & Radius Selector Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-white/10 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-white/15 backdrop-blur-md">
          {/* Main Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search size={18} className="absolute left-3.5 text-slate-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, stores, services, food and places around you..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/95 text-slate-900 placeholder-slate-400 pl-10 pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search Radius Pills (5, 10, 15, 25, 50 km) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 shrink-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-300 shrink-0 hidden sm:inline px-1">
              Radius:
            </span>
            {RADIUS_OPTIONS.map((r) => {
              const isActive = Number(currentRadius) === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRadiusChange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/30 scale-102 ring-2 ring-white/30"
                      : "bg-white/15 text-slate-200 hover:bg-white/25 hover:text-white"
                  }`}
                >
                  {r} km
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
