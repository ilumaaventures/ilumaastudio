import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Star,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { removeFromWishlist } from "../../redux/reducers/wishlistReducer";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist?.items || []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (product) => {
    dispatch(removeFromWishlist(product._id));
    toast.success("Removed from wishlist");
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-[#2563eb]">Home</Link>
              <ChevronRight size={12} />
              <span className="text-slate-900 dark:text-white font-bold">Wishlist</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white pt-1">
              My Wishlist <span className="text-sm font-semibold text-slate-400">({wishlist.length} items)</span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-red-50 dark:bg-slate-800 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {wishlist.map((prod) => (
              <div
                key={prod._id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between z-10">
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    SAVED
                  </span>
                  <button
                    onClick={() => handleRemove(prod)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Product Image */}
                <Link to={`/products/${prod._id}`} className="my-2 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
                  <img
                    src={prod.image || prod.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300"}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1.5">
                  <Link to={`/products/${prod._id}`}>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#2563eb] transition-colors">
                      {prod.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{prod.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="w-full mt-2 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShoppingCart size={13} />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
