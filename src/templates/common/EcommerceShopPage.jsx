import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Minus,
  Eye,
  ShoppingBag,
  Star,
  Check,
} from "lucide-react";
import { getProductImage } from "../../utils/productImage";

export default function EcommerceShopPage({
  products = [],
  categories = [],
  onAddToCart,
  onViewProduct,
  themeColors = {},
  initialSearch = "",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating"
  const [addedItemMap, setAddedItemMap] = useState({});

  const primaryColor = themeColors.primary || "#4F46E5";

  const handleAddWithFeedback = (prod, e) => {
    e?.stopPropagation();
    onAddToCart(prod);
    setAddedItemMap((prev) => ({ ...prev, [prod._id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod._id]: false }));
    }, 1200);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => {
        const pCat = (p.category?.name || p.category || "").toLowerCase();
        return pCat === selectedCategory.toLowerCase();
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      list.sort((a, b) => Number(b.rating || 5) - Number(a.rating || 5));
    }

    return list;
  }, [products, selectedCategory, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 font-sans">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Store Catalog & Collections
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          All Products ({filteredProducts.length})
        </h1>
      </div>

      {/* Filter, Sort & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by product name, ingredient, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white transition"
          />
        </div>

        {/* Categories & Sort */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => {
              const name = c.name || c;
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills Carousel */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => {
            const catName = cat.name || cat;
            const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={catName}
                onClick={() => setSelectedCategory(catName)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? "text-white shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                style={isSelected ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
              >
                {catName}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find items matching your filter. Try adjusting your search query or reset filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSortBy("featured");
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => {
            const isAdded = addedItemMap[prod._id];
            return (
              <div
                key={prod._id}
                onClick={() => onViewProduct && onViewProduct(prod)}
                className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Product Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img
                      src={getProductImage(prod, "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500")}
                      alt={prod.name || prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                        {prod.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct && onViewProduct(prod);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white cursor-pointer"
                      title="Quick View Details"
                    >
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {prod.category?.name || prod.category || "General"}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 mt-0.5">
                      {prod.name || prod.title}
                    </h3>
                  </div>
                </div>

                {/* Price & Add to Bag */}
                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      ₹{Number(prod.price).toFixed(2)}
                    </span>
                    {prod.compareAtPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{Number(prod.compareAtPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddWithFeedback(prod, e)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} />
                        <span className="hidden sm:inline">Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span className="hidden sm:inline">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
