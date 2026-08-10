import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const RESTOCKED = [
  {
    _id: "restock_1",
    name: "Handcrafted Brass Diya Holder Stand",
    price: 1650,
    originalPrice: 2200,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    stock: 25
  },
  {
    _id: "restock_2",
    name: "Sandalwood Aromatic Diffuser Reeds set",
    price: 890,
    originalPrice: 1200,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    stock: 40
  },
  {
    _id: "restock_3",
    name: "Corporate Premium Leather Portfolio Folio",
    price: 2450,
    originalPrice: 3200,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Corporate",
    stock: 15
  }
];

function JustRestocked() {
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
            <span className="flex items-center gap-1 text-[#C9956C] font-semibold text-xs uppercase tracking-widest">
              <RefreshCw size={13} className="animate-spin-slow text-[#C9956C]" />
              Back By Popular Demand
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Just Restocked
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESTOCKED.map((prod) => {
            const isWishlisted = wishlistItems.some(i => i._id === prod._id);
            return (
              <div
                key={prod._id}
                className="bg-white rounded-3xl p-5 border border-gray-100 flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow relative"
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
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-5 relative">
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#111] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                      Available: {prod.stock} Units
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#C9956C] font-black uppercase tracking-widest">
                      {prod.category}
                    </span>
                    <h3 className="text-xs font-semibold text-[#111] leading-snug line-clamp-1">
                      {prod.name}
                    </h3>
                  </div>
                </div>

                {/* Price Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100/60">
                  <div>
                    <span className="text-base font-black text-[#111]">₹{prod.price}</span>
                    <span className="block text-[10px] text-gray-400 font-bold line-through">
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="inline-flex items-center gap-1.5 bg-[#111] hover:bg-[#C9956C] text-white text-[10px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <ShoppingCart size={11} />
                    <span>Get Yours</span>
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

export default JustRestocked;
