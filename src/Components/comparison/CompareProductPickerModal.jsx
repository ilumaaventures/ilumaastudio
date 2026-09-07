import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Plus,
  RotateCcw,
  Check,
  Star,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { getallProducts } from "../../api/productService";
import { fetchCategories } from "../../api/categoryService";
import { normalizeCompareProduct } from "../../redux/reducers/compareReducer";

export default function CompareProductPickerModal({
  isOpen,
  onClose,
  onSelectProduct,
  currentProductIds = [],
  replaceSlotIndex = null,
  currentProductToReplace = null,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.allSettled([
          getallProducts({ limit: 100 }),
          fetchCategories(),
        ]);

        if (isMounted) {
          if (prodRes.status === "fulfilled") {
            const list =
              prodRes.value?.products ||
              prodRes.value?.data ||
              (Array.isArray(prodRes.value) ? prodRes.value : []);
            setProducts(list);
          }
          if (catRes.status === "fulfilled") {
            const cats =
              catRes.value?.categories ||
              catRes.value?.data ||
              (Array.isArray(catRes.value) ? catRes.value : []);
            setCategories(cats);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog for comparison picker:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const pName = (prod.name || prod.title || "").toLowerCase();
      const pBrand = (
        prod.brand ||
        prod.business?.businessName ||
        ""
      ).toLowerCase();
      const pCat = (
        typeof prod.category === "object"
          ? prod.category?.name || prod.category?.title || ""
          : prod.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        pName.includes(searchQuery.toLowerCase()) ||
        pBrand.includes(searchQuery.toLowerCase()) ||
        pCat.includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" ||
        pCat === selectedCategory.toLowerCase() ||
        pCat.includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3
              id="picker-modal-title"
              className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2"
            >
              {replaceSlotIndex !== null ? (
                <>
                  <RotateCcw size={18} className="text-[#2563eb]" />
                  <span>Replace Product in Comparison</span>
                </>
              ) : (
                <>
                  <Plus size={18} className="text-[#2563eb]" />
                  <span>Add Product to Compare</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {replaceSlotIndex !== null
                ? `Select a new product to replace ${currentProductToReplace?.name || "this slot"}.`
                : "Select another product to compare side-by-side."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product name, category, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#2563eb] focus:bg-white transition"
              autoFocus
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1 rounded-full font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Products
            </button>
            {categories.slice(0, 10).map((cat, cIdx) => {
              const catName = cat.name || cat.title || cat;
              const isSel = selectedCategory === catName;
              return (
                <button
                  key={cat._id || cIdx}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-3 py-1 rounded-full font-bold transition shrink-0 cursor-pointer ${
                    isSel
                      ? "bg-[#2563eb] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Catalog List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading catalog products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Package size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No products found</p>
              <p className="text-xs text-slate-400">
                Try a different search term or category filter.
              </p>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const pId = String(prod._id || prod.id || "");
              const isAlreadySelected = currentProductIds.includes(pId);
              const pImage =
                prod.images?.[0]?.url ||
                prod.images?.[0] ||
                prod.image?.url ||
                prod.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200";
              const pCat =
                typeof prod.category === "object"
                  ? prod.category?.name || "General"
                  : prod.category || "General";
              const pPrice = Number(prod.price) || 0;

              return (
                <div
                  key={pId}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isAlreadySelected
                      ? "bg-blue-50/50 border-blue-200 opacity-80"
                      : "bg-white border-slate-200/80 hover:border-[#2563eb]/60 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={pImage}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {pCat}
                        </span>
                        {prod.rating && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <Star size={11} fill="currentColor" />
                            <span>{Number(prod.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-black text-[#2563eb]">
                        ₹{pPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isAlreadySelected ? (
                      <span className="text-[11px] font-bold text-[#2563eb] bg-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <Check size={13} strokeWidth={2.5} />
                        <span>Already In</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        {replaceSlotIndex !== null ? (
                          <>
                            <RotateCcw size={12} />
                            <span>Replace</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>Select</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
