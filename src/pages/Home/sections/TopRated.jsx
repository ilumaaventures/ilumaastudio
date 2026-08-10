import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";

const RATED = [
  {
    _id: "rated_1",
    name: "Ceramic Tealight Candle Holder (Set of 2)",
    price: 490,
    originalPrice: 650,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 5.0,
    reviewsCount: 380
  },
  {
    _id: "rated_2",
    name: "Pure Mulberry Silk Hand-rolled Scarf",
    price: 2450,
    originalPrice: 3200,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 4.95,
    reviewsCount: 190
  },
  {
    _id: "rated_3",
    name: "Hand-poured Honey & Wild Lavender Hampers Box",
    price: 3800,
    originalPrice: 4999,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0,
    reviewsCount: 110
  }
];

function TopRated() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product) => {
    dispatch(toggleWishlist(product));
    const isFav = wishlistItems.some(i => i._id === product._id);
    if (isFav) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <span className="text-[#C9956C] font-semibold text-xs uppercase tracking-widest block">
              Five-Star Rated
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Top Rated ⭐
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RATED.map((prod) => {
            const isWishlisted = wishlistItems.some(i => i._id === prod._id);
            return (
              <div
                key={prod._id}
                className="bg-[#FAFAF9] rounded-3xl p-5 border border-gray-100/60 flex flex-col justify-between group hover:bg-white hover:shadow-md transition-all duration-300 relative"
              >
                {/* Heart Button */}
                <button
                  onClick={() => handleToggleWishlist(prod)}
                  className={`absolute top-6 right-6 z-10 p-2 rounded-full shadow-sm bg-white hover:scale-105 transition-all ${
                    isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                <div>
                  {/* Image */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-5">
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Rating / Review Count */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-[#111]">{prod.rating}</span>
                      <span className="text-[10px] text-gray-400 font-bold">({prod.reviewsCount} reviews)</span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#111] leading-snug line-clamp-1">
                      {prod.name}
                    </h3>
                  </div>
                </div>

                {/* Price Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50">
                  <div>
                    <span className="text-base font-black text-[#111]">₹{prod.price}</span>
                    <span className="block text-[10px] text-gray-400 font-bold line-through">
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="inline-flex items-center gap-1.5 bg-black hover:bg-[#C9956C] text-white text-[10px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <ShoppingCart size={11} />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TopRated;
