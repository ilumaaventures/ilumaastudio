import React from "react";
import {
  Bookmark,
  X,
  Trash2,
  MapPin,
  ChevronUp,
  ChevronDown,
  Navigation,
  Compass,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  Coffee,
  Trees,
} from "lucide-react";
import toast from "react-hot-toast";

const TYPE_ICONS = {
  product: ShoppingBag,
  business: Store,
  service: Sparkles,
  food: Coffee,
  place: Trees,
  gift: ShoppingBag,
  event: Compass,
};

export default function NeighbourhoodPlanner({
  isOpen,
  onClose,
  planItems = [],
  onRemoveItem,
  onClearPlan,
  onMoveItem,
}) {
  if (!isOpen) return null;

  const totalDistance = planItems.reduce(
    (max, item) => Math.max(max, item.distanceKm || 0),
    0,
  );

  const distinctTypes = [...new Set(planItems.map((i) => i.type || "place"))];

  const handleStartItinerary = () => {
    toast.success(
      `Neighbourhood plan with ${planItems.length} stops saved for your visit! (Demo mode)`,
      { icon: "📍" },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight text-white flex items-center gap-2">
                <span>Plan Your Neighbourhood</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                  {planItems.length} Stops
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Custom local itinerary for your visit
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {planItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Bookmark size={26} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-800 text-sm">
                  Your plan is currently empty
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click the bookmark icon on any product, store, service, or local café to add it to your visit itinerary!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary pill */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center justify-between font-extrabold text-slate-900">
                  <span>Itinerary Overview</span>
                  <span className="text-[#2563eb]">Max span: ~{totalDistance} km</span>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-1.5 pt-0.5">
                  {distinctTypes.map((t) => (
                    <span
                      key={t}
                      className="capitalize bg-white px-2 py-0.5 rounded-md border border-blue-100 text-slate-700 font-bold"
                    >
                      {t} ({planItems.filter((i) => i.type === t).length})
                    </span>
                  ))}
                </div>
              </div>

              {/* Stops sequence */}
              <div className="space-y-2.5">
                {planItems.map((item, index) => {
                  const Icon = TYPE_ICONS[item.type] || MapPin;
                  return (
                    <div
                      key={item.id}
                      className="group p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all flex items-center gap-3"
                    >
                      {/* Step Number Indicator */}
                      <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                      )}

                      {/* Stop Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
                          <Icon size={11} />
                          <span className="capitalize">{item.type || "place"}</span>
                          {item.distanceKm && (
                            <span className="text-slate-400">• {item.distanceKm} km</span>
                          )}
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-xs truncate">
                          {item.name || item.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.area || item.city || "Local Neighbourhood"}
                        </p>
                      </div>

                      {/* Reorder / Remove buttons */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {onMoveItem && (
                          <>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => onMoveItem(index, index - 1)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600"
                                title="Move stop up"
                              >
                                <ChevronUp size={13} />
                              </button>
                            )}
                            {index < planItems.length - 1 && (
                              <button
                                type="button"
                                onClick={() => onMoveItem(index, index + 1)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600"
                                title="Move stop down"
                              >
                                <ChevronDown size={13} />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
                          title="Remove stop"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {planItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-2">
            <button
              type="button"
              onClick={handleStartItinerary}
              className="w-full py-3 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation size={15} />
              <span>Preview Route ({planItems.length} Stops)</span>
            </button>

            <button
              type="button"
              onClick={onClearPlan}
              className="w-full py-2 text-slate-500 hover:text-red-600 text-xs font-bold transition cursor-pointer"
            >
              Clear Entire Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
