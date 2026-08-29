import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getShops } from "../../api/publicService";
import { StoreGridSkeleton } from "../../Components/Skeletons";

function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await getShops();
        const list = Array.isArray(res) ? res : res?.stores || res?.data || [];
        if (list.length > 0) {
          const safeStr = (val, fallback = "") => {
            if (!val) return fallback;
            if (typeof val === "string") return val;
            if (typeof val === "number") return String(val);
            if (typeof val === "object") {
              return val.name || val.title || val.storeName || val.businessName || fallback;
            }
            return String(val);
          };

          const formatted = list.slice(0, 3).map((s, idx) => ({
            id: s._id || `rest_${idx}`,
            name: safeStr(s.businessName || s.name || s.storeName, "Local Partner"),
            subtitle: safeStr(s.businessCategory || s.category, "Food & Dining"),
            image:
              s.logo ||
              s.banner ||
              "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80",
            link: `/${s.slug || s._id}`,
          }));
          setRestaurants(formatted);
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        console.error("Restaurants API fetch notice:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Nearby Restaurants & Shops
        </h2>
        <Link
          to="/store"
          className="text-xs sm:text-sm font-bold text-[#1e6091] hover:text-[#1a5276] transition-colors"
        >
          See all
        </Link>
      </div>

      {loading ? (
        <StoreGridSkeleton count={3} />
      ) : restaurants.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            No nearby partners returned from backend server.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {restaurants.map((rest) => (
            <Link
              key={rest.id}
              to={rest.link}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="h-36 sm:h-40 w-full overflow-hidden relative">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-white dark:bg-slate-900">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#1e6091] transition-colors">
                  {rest.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {rest.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default NearbyRestaurants;
