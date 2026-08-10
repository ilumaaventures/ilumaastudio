import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";

const FAVORITES = [
  {
    _id: "fav_1",
    name: "Aura Soy Wax candle - Jasmine Infusion",
    price: 590,
    originalPrice: 850,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9,
    feedback: "The smell is divine and lasts forever!"
  },
  {
    _id: "fav_2",
    name: "Hand-turned Mango Wood Bowl Set",
    price: 1350,
    originalPrice: 1800,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8,
    feedback: "Gorgeous grain. Perfect styling item."
  },
  {
    _id: "fav_3",
    name: "Customized Saffiano Leather Cardholder",
    price: 999,
    originalPrice: 1500,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 5.0,
    feedback: "Extremely clean foil lettering. A premium gift."
  }
];

function CustomerFavorites() {
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
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Heart size={18} fill="currentColor" />
          </div>
          <span className="text-[#C9956C] font-semibold text-xs uppercase tracking-widest block">
            Most Adored Products
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111] font-serif tracking-tight">
            Customer Favorites ❤️
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FAVORITES.map((prod) => {
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
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-5">
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Rating / Testimonial */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" className="stroke-none" />
                      ))}
                      <span className="text-[10px] text-gray-400 font-bold ml-1">({prod.rating})</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#111] leading-snug line-clamp-1">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100/50">
                      "{prod.feedback}"
                    </p>
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
                    <span>Buy Again</span>
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

export default CustomerFavorites;
