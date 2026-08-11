import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";

function FlashDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 4 });
        const list = Array.isArray(res) ? res : res?.products || res?.data || [];
        if (list.length > 0) {
          const formatted = list.map((p, idx) => ({
            id: p._id || `fd_${idx}`,
            title: p.name || "Flash Deal Item",
            discountBadge: `${Math.round(((p.originalPrice - p.price) / (p.originalPrice || 1)) * 100) || 30}% off`,
            subDiscount: `Max discount applied`,
            timeTag: "Limited Time",
            image: p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
            price: p.price || 499,
          }));
          setDeals(formatted);
        } else {
          setDeals([]);
        }
      } catch (err) {
        console.error("Flash deals API fetch notice:", err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const toggleWishlist = (id) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with See All */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Flash Deals
        </h2>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-bold text-[#1e6091] hover:text-[#1a5276] transition-colors"
        >
          See all
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : deals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center">
          <p className="text-xs text-slate-500 font-medium">No flash deals currently available from backend server.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Top Product Image Box */}
              <div className="relative w-full aspect-4/3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3 overflow-hidden">
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(item.id)}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={15}
                    className={wishlisted[item.id] ? "fill-rose-500 text-rose-500" : ""}
                  />
                </button>

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Details */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    {item.discountBadge}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-medium flex justify-between items-center">
                  <span>₹{item.price}</span>
                  <span>{item.subDiscount}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {item.timeTag}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FlashDeals;

