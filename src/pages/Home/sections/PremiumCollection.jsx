import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const LUXURY_PRODUCTS = [
  {
    _id: "lux_1",
    name: "The Emperor Royal Rosewood Gift Trunk",
    price: 12500,
    originalPrice: 16000,
    images: [{ url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop" }],
    category: "Signature Trunks",
    description: "Features a handcrafted rosewood trunk carrying solid brass drinking goblets, a hand-loomed silk throw, organic wildflower honey, and selection of aromatic soy votives.",
    rating: 5.0
  },
  {
    _id: "lux_2",
    name: "Hand-Carved Marble Pillar Candlestick Set",
    price: 4500,
    originalPrice: 5800,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop" }],
    category: "Heritage Decor",
    description: "Meticulously turned and polished from select pure white Makrana marble. A heavy, statement pair that complements formal dining rooms.",
    rating: 4.9
  }
];

function PremiumCollection() {
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
    <section className="py-24 bg-[#111] text-white overflow-hidden relative">
      {/* Decorative blurred background orb */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#C9956C]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9956C]/15 border border-[#C9956C]/35">
            <Sparkles size={11} className="text-[#C9956C] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9956C]">
              Signature Luxe
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-serif tracking-tight">
            The Premium Collection
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Experience the pinnacle of craftsmanship. Heirloom-quality treasures made with the finest materials and centuries-old artistry.
          </p>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {LUXURY_PRODUCTS.map((prod) => {
            const isWishlisted = wishlistItems.some(i => i._id === prod._id);
            return (
              <div
                key={prod._id}
                className="group bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-8 hover:border-[#C9956C]/40 transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-neutral-800 shrink-0 relative">
                  <img
                    src={prod.images[0].url}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-[#C9956C] font-black uppercase tracking-widest">
                        {prod.category}
                      </span>
                      <button
                        onClick={() => handleToggleWishlist(prod)}
                        className={`p-2 rounded-full hover:bg-neutral-800/80 transition-colors ${
                          isWishlisted ? "text-[#C9956C]" : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {prod.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-white">₹{prod.price}</span>
                      <span className="block text-[10px] text-neutral-500 font-bold line-through">
                        ₹{prod.originalPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="inline-flex items-center gap-1.5 bg-[#C9956C] hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest px-4.5 py-3 rounded-xl transition-all shadow-md"
                    >
                      <ShoppingCart size={11} />
                      <span>Order Luxe</span>
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

export default PremiumCollection;
