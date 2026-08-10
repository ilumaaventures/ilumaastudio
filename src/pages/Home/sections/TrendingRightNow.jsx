import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ArrowRight } from "lucide-react";
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

const DEFAULT_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400",
  "https://images.unsplash.com/photo-1548907040-4d42b52125e0?q=80&w=400",
  "https://images.unsplash.com/photo-1547793549-7038dd59b5cf?q=80&w=400",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400",
];

function TrendingRightNow({ products = [], loading = false }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

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

  return (
    <section className="py-16 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl md:text-2xl font-serif font-black text-gray-900 tracking-tight whitespace-nowrap">
              Trending Right Now
            </h2>
            <div className="h-px bg-gray-200 flex-1 hidden md:block"></div>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#A77A56] hover:text-[#8f6443] flex items-center gap-1.5 transition-colors shrink-0 pl-4"
          >
            <span>View All Products</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 6 Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
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
          ) : products.length > 0 ? (
            products.slice(0, 4).map((prod, idx) => {
              const isWishlisted = wishlistItems.some(
                (i) => i._id === prod._id,
              );
              const pImage =
                resolveImg(prod.images?.[0]?.url) ||
                DEFAULT_PRODUCT_IMAGES[idx % DEFAULT_PRODUCT_IMAGES.length];
              return (
                <Link
                  key={prod._id}
                  to={`/products/${prod._id}`}
                  className="group flex flex-col relative bg-white border border-gray-100 rounded-[24px] p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                >
                  {/* Image Box */}
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gray-50">
                    <img
                      src={pImage}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Heart Button */}
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

                    {/* Badge */}
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#A77A56] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between mt-3 px-1">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#A77A56] transition-colors leading-tight line-clamp-2 capitalize">
                        {prod.name}
                      </h3>

                      {/* Stars */}
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
              No products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TrendingRightNow;
