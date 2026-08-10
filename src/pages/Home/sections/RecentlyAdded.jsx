import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../api/baseApi";

const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/^\//, "")}`;
};

const DEFAULT_TAB_IMAGES = [
  "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400",
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400",
  "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=400",
  "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=400",
];

const TABS = [
  { id: "recently_added", label: "Recently Added" },
  { id: "trending", label: "Trending Categories" },
  { id: "premium", label: "Premium Collection" },
  { id: "seasonal", label: "Seasonal Collection" },
];

function RecentlyAdded({ products = [], loading = false }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const [activeTab, setActiveTab] = useState("recently_added");

  const getTabProducts = () => {
    if (activeTab === "recently_added") {
      return products.slice(0, 4);
    } else if (activeTab === "trending") {
      // Sort by rating or return a slice
      return [...products]
        .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
        .slice(0, 4);
    } else if (activeTab === "premium") {
      // Sort by price descending
      return [...products]
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 4);
    } else if (activeTab === "seasonal") {
      return products.slice(Math.max(0, products.length - 4), products.length);
    }
    return products.slice(0, 4);
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    const isFav = wishlistItems.some((i) => i._id === product._id);
    if (isFav) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const tabProducts = getTabProducts();

  return (
    <section className="py-16 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centered Tab Headers */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 border-b border-gray-200 pb-2.5 mb-10">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm md:text-base font-serif font-black tracking-tight pb-3 transition-all relative cursor-pointer ${
                  isSelected
                    ? "text-[#A77A56]"
                    : "text-gray-400 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A77A56]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 6 Column Tabbed Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col relative bg-white border border-gray-100 rounded-[24px] p-3 shadow-sm animate-pulse"
              >
                <div className="aspect-square rounded-[18px] bg-gray-200" />
                <div className="space-y-2 mt-3 px-1">
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-50">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : tabProducts.length > 0 ? (
            tabProducts.map((prod, idx) => {
              const isWishlisted = wishlistItems.some(
                (i) => i._id === prod._id,
              );
              const pImage =
                resolveImg(prod.images?.[0]?.url) ||
                DEFAULT_TAB_IMAGES[idx % DEFAULT_TAB_IMAGES.length];
              return (
                <Link
                  key={prod._id}
                  to={`/products/${prod._id}`}
                  className="group flex flex-col relative bg-white border border-gray-100 rounded-[24px] p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gray-50">
                    <img
                      src={pImage}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => handleToggleWishlist(prod, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                      title={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={14}
                        className={
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 flex flex-col justify-between mt-3 px-1">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#A77A56] transition-colors line-clamp-2 capitalize">
                        {prod.name}
                      </h4>

                      {/* Rating stars */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill="currentColor"
                              className="mr-0.2"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold font-sans">
                          ({prod.reviewsCount || 0})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-xs md:text-sm font-black text-gray-900 font-sans">
                        ₹{prod.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(prod, e)}
                        className="text-[10px] font-bold text-[#A77A56] hover:text-[#8f6443] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-6 text-center py-10 text-gray-400 text-sm font-medium">
              No products available for this collection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentlyAdded;
