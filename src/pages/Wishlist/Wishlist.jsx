import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ShoppingCart,
  Share2,
  ChevronRight,
} from "lucide-react";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist?.items || []);

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      dispatch(addToCart({ product, quantity: 1 }));
    });
    toast.success(`${wishlist.length} item(s) moved to cart!`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Wishlist", url: window.location.href });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/" className="hover:text-[#2563eb]">Home</Link>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-bold">Wishlist</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 pt-1">
              My Wishlist <span className="text-sm font-semibold text-slate-400">({wishlist.length} items)</span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 border border-slate-300 text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <ShoppingCart size={14} />
                <span>Move All to Cart</span>
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save your favorite items here to purchase later or keep track of special deals.
            </p>
            <div>
              <Link
                to="/products"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-xs font-bold inline-block transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4">
            {wishlist.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
