import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const BUDGET_ITEMS = [
  {
    _id: "budget_1",
    name: "Handcrafted Brass incense Holder",
    price: 499,
    originalPrice: 790,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8
  },
  {
    _id: "budget_2",
    name: "Organic Botanical Soy Wax Tablet",
    price: 350,
    originalPrice: 499,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9
  },
  {
    _id: "budget_3",
    name: "Neem Wood Wide-Tooth Detangler Comb",
    price: 299,
    originalPrice: 450,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 4.7
  },
  {
    _id: "budget_4",
    name: "Mini Gift Box: Aromatic Tea & Scented Tealight",
    price: 890,
    originalPrice: 1200,
    images: [{ url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0
  }
];

function Under999() {
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
    <section className="py-20 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <span className="text-[#C9956C] font-semibold text-xs uppercase tracking-widest block">
              Budget Friendly
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Under ₹999 Boutique
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUDGET_ITEMS.map((prod) => {
            const isWishlisted = wishlistItems.some(i => i._id === prod._id);
            return (
              <div
                key={prod._id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100 relative"
              >
                {/* Heart Button */}
                <button
                  onClick={() => handleToggleWishlist(prod)}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm bg-white hover:scale-105 transition-all ${
                    isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Image */}
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                  <img
                    src={prod.images[0].url}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Quick Add Overlay */}
                  <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="w-full py-2.5 bg-black hover:bg-[#C9956C] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart size={11} />
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[#C9956C] font-black uppercase tracking-widest">
                      {prod.category}
                    </span>
                    <h3 className="text-xs font-semibold text-[#222] line-clamp-2 leading-relaxed">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Rating / Price */}
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-[#111]">₹{prod.price}</span>
                      <span className="text-[10px] text-gray-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={11} fill="currentColor" className="stroke-none" />
                      <span className="text-[10px] font-bold text-gray-500">{prod.rating}</span>
                    </div>
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

export default Under999;
