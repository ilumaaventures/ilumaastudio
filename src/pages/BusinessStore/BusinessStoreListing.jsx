import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getShops } from "../../api/publicService";
import { StoreGridSkeleton } from "../../Components/Skeletons";

const FALLBACK_STORES = [
  {
    _id: "st1",
    name: "Urban Style Studio",
    storeName: "Urban Style",
    slug: "urban-style",
    category: "Fashion & Lifestyle",
    rating: 4.8,
    reviews: 324,
    location: "Gomti Nagar, Lucknow",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    verified: true,
  },
];

export default function BusinessStoreListing() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        const res = await getShops({
          businessType: ["Gifting", "E-Commerce"],
        });
        const list = Array.isArray(res) ? res : res?.stores || res?.data || [];
        if (list.length > 0) {
          const formatted = list.map((s, idx) => ({
            _id: s._id || `st_${idx}`,
            name:
              s.businessName || s.name || s.storeName || "Local Vendor Store",
            storeName: s.storeName || s.name || s.businessName || "Vendor",
            slug:
              s.slug ||
              (s.businessName || s.name || "")
                .toLowerCase()
                .replace(/\s+/g, "-") ||
              "store",
            category: s.businessCategory || s.category || "General Store",
            rating: s.rating || 4.7,
            reviews: s.reviewsCount || 0,
            location:
              typeof s.location === "object"
                ? s.location.city || s.location.address || "Lucknow"
                : s.city || s.location || "Lucknow",
            image:
              s.logo ||
              s.banner ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
            verified: true,
          }));
          setStores(formatted);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error("Failed to load stores from API:", err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    loadStores();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-[#2563eb]">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-900 dark:text-white font-bold">
                Business Shops
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Store size={26} className="text-[#2563eb]" />
              Browse All Business Shops
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Discover verified local vendors, retailers, and brand stores on
              ILUMAAStudio
            </p>
          </div>

          <Link
            to="/businessRegistration"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Building2 size={15} />
            <span>Register Your Shop</span>
          </Link>
        </div>

        {/* Clean All Business Stores Grid */}
        {loading ? (
          <StoreGridSkeleton count={6} />
        ) : stores.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] flex items-center justify-center mx-auto text-2xl">
              🏪
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No Stores Returned from Backend API
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              We couldn't find any business stores registered in the backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const storeRoute = `/${store.slug || store._id}`;

              return (
                <div
                  key={store._id}
                  onClick={() => navigate(storeRoute)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#2563eb]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Store Banner/Image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Verified Tag */}
                    {store.verified && (
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-extrabold text-[#2563eb] flex items-center gap-1 shadow-sm">
                        <BadgeCheck size={13} className="text-[#2563eb]" />
                        <span>Verified Business</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <ArrowUpRight size={16} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-black text-lg text-white leading-tight truncate">
                        {store.name}
                      </h3>
                    </div>
                  </div>

                  {/* Store Body Details */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold text-[10px] uppercase tracking-wider">
                          {store.category}
                        </span>

                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                          <Star
                            size={11}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span>{store.rating}</span>
                          <span className="text-slate-400 font-normal">
                            ({store.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{store.location}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(storeRoute);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs mt-2"
                    >
                      <span>Visit Store</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
