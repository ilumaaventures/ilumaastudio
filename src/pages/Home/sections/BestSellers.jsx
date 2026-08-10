import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const BEST_SELLERS = [
  {
    _id: "best_1",
    name: "Luxury Ceramic Reed Diffuser Set (Vanilla & Oud)",
    price: 1850,
    originalPrice: 2400,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9,
    reviewsCount: 310
  },
  {
    _id: "best_2",
    name: "Intricately Hammered Copper Water Bottle & Cups Set",
    price: 2100,
    originalPrice: 2999,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8,
    reviewsCount: 245
  },
  {
    _id: "best_3",
    name: "Artisanal Assorted Dark Chocolate & Nut Hamper",
    price: 1450,
    originalPrice: 1999,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0,
    reviewsCount: 180
  },
  {
    _id: "best_4",
    name: "Handcrafted Marble Coasters (Set of 6)",
    price: 899,
    originalPrice: 1200,
    images: [{ url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.7,
    reviewsCount: 190
  }
];

function BestSellers() {
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
              Top Performance
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Best Sellers
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BEST_SELLERS.map((prod, index) => {
            const isWishlisted = wishlistItems.some(i => i._id === prod._id);
            return (
              <div
                key={prod._id}
                className="group relative bg-[#FAFAF9] rounded-2xl p-5 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Ranking Tag */}
                <div className="absolute top-6 left-6 z-10 w-9 h-9 rounded-full bg-[#C9956C]/10 flex items-center justify-center text-[#C9956C] text-sm font-black tracking-tight">
                  #{index + 1}
                </div>

                {/* Heart Button */}
                <button
                  onClick={() => handleToggleWishlist(prod)}
                  className={`absolute top-6 right-6 z-10 p-2 rounded-full shadow-sm bg-white hover:scale-105 transition-all ${
                    isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-5 relative">
                  <img
                    src={prod.images[0].url}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[#C9956C] font-black uppercase tracking-widest">
                      {prod.category}
                    </span>
                    <h3 className="text-xs font-semibold text-[#111] line-clamp-2 leading-relaxed">
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            fill={i < Math.floor(prod.rating) ? "currentColor" : "none"}
                            className="stroke-current"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Pricing / Action */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100/60">
                    <div>
                      <span className="text-sm font-black text-[#111]">₹{prod.price}</span>
                      <span className="block text-[10px] text-gray-400 font-bold line-through">
                        ₹{prod.originalPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="p-2.5 bg-black hover:bg-[#C9956C] text-white rounded-lg shadow-sm transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
