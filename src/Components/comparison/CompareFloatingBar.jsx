import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Scale,
  X,
  Plus,
  ArrowRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  removeFromCompare,
  clearCompare,
  addToCompare,
  MAX_COMPARE_PRODUCTS,
  MIN_COMPARE_PRODUCTS,
} from "../../redux/reducers/compareReducer";
import CompareProductPickerModal from "./CompareProductPickerModal";

export default function CompareFloatingBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMinimized, setIsMinimized] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const compareItems = useSelector((s) => s.compare?.items || []);
  const count = compareItems.length;

  // Don't render on the dedicated comparison page or if empty
  if (count === 0 || location.pathname === "/compare") {
    return null;
  }

  const isReady = count >= MIN_COMPARE_PRODUCTS;

  const handleCompareNow = () => {
    if (!isReady) return;
    const query = compareItems.map((i) => i.id || i._id).join(",");
    navigate(`/compare?products=${encodeURIComponent(query)}`);
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(removeFromCompare(id));
  };

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(clearCompare());
  };

  const handleSelectFromPicker = (product) => {
    dispatch(addToCompare(product));
  };

  // -------------------------------------------------------------
  // MINIMIZED FLOATING PILL (Shows overlapping thumbnails + count)
  // -------------------------------------------------------------
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-fadeInUp">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-3 pl-3 pr-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-[0_12px_35px_-8px_rgba(15,23,42,0.35)] border border-slate-700/80 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to expand comparison dock"
          aria-label="Expand Product Comparison Dock"
        >
          {/* Overlapping Thumbnails */}
          <div className="flex -space-x-2 overflow-hidden">
            {compareItems.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-white overflow-hidden shrink-0"
              >
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100"
                  }
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight">Compare</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full border ${
                isReady
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }`}
            >
              {count}
            </span>
          </div>

          <ChevronUp
            size={14}
            className="text-slate-400 group-hover:text-white transition-transform group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL INTERACTIVE FLOATING DOCK (Showing ONLY Added Products)
  // -------------------------------------------------------------
  return (
    <>
      <aside
        aria-label="Product comparison dock"
        className="fixed bottom-4 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-300 ease-out"
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_16px_45px_-10px_rgba(15,23,42,0.18)] p-2 sm:p-3 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
              {/* Left Section: Status & Counter */}
              <div className="flex items-center justify-between sm:justify-start gap-2.5 shrink-0 border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                      isReady ? "bg-[#2563eb] text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    <Scale size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 tracking-tight">
                        Compare
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                          isReady
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-[#2563eb] border-blue-200"
                        }`}
                      >
                        {count}/{MAX_COMPARE_PRODUCTS}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isReady ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[10px] font-semibold text-slate-500">
                        {isReady ? "Ready to compare" : "Add 1 more"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Quick Controls */}
                <div className="flex sm:hidden items-center gap-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Clear all"
                    aria-label="Clear all compared products"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Minimize"
                    aria-label="Minimize dock"
                  >
                    <ChevronDown size={15} />
                  </button>
                </div>
              </div>

              {/* Center: ONLY ADDED PRODUCTS (Dynamic List) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1">
                {compareItems.map((item, index) => {
                  const itemId = item.id || item._id;
                  const isHovered = hoveredItemId === itemId;

                  return (
                    <div
                      key={itemId}
                      onMouseEnter={() => setHoveredItemId(itemId)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => navigate(`/products/${itemId}`)}
                      className="group relative flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all duration-200 shrink-0 max-w-[170px] sm:max-w-[190px] cursor-pointer hover:shadow-xs"
                      title={`Click to view ${item.name}`}
                    >
                      {/* Thumbnail with hover zoom */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white p-0.5 border border-slate-200/70 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150"
                          }
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-[#2563eb] transition-colors leading-tight">
                          {item.name}
                        </p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-[11px] font-black text-[#2563eb]">
                            ₹{Number(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(itemId, e)}
                        className="w-4.5 h-4.5 rounded-full bg-slate-200/80 hover:bg-rose-500 text-slate-500 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shrink-0"
                        title={`Remove ${item.name}`}
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={10} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}

                {/* Quick Add Button if less than MAX_COMPARE_PRODUCTS */}
                {count < MAX_COMPARE_PRODUCTS && (
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-200 hover:border-[#2563eb] bg-slate-50/50 hover:bg-blue-50/40 text-slate-500 hover:text-[#2563eb] transition-all text-center shrink-0 cursor-pointer group active:scale-95"
                    title="Search and add another product"
                  >
                    <Plus
                      size={13}
                      strokeWidth={2.5}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[11px] font-bold">Add Item</span>
                  </button>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0">
                {/* Desktop Clear Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                  title="Clear all selected products"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>

                {/* Compare Now CTA Button */}
                <button
                  type="button"
                  onClick={handleCompareNow}
                  disabled={!isReady}
                  className={`group relative overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    isReady
                      ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <span>{isReady ? `Compare Now (${count})` : "Add 1 More"}</span>
                  <ArrowRight
                    size={13}
                    strokeWidth={2.5}
                    className={
                      isReady ? "group-hover:translate-x-1 transition-transform" : ""
                    }
                  />
                </button>

                {/* Desktop Minimize Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="hidden sm:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Minimize comparison bar"
                  aria-label="Minimize comparison bar"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Quick Add Product Picker Modal */}
      <CompareProductPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectProduct={handleSelectFromPicker}
        currentProductIds={compareItems.map((p) => String(p.id || p._id))}
        replaceSlotIndex={null}
        currentProductToReplace={null}
      />
    </>
  );
}
