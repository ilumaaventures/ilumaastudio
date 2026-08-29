import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../../api/categoryService";

export default function OccasionsAndCollections() {
  const [occasionCategories, setOccasionCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOccasions = async () => {
      try {
        setLoading(true);
        const res = await fetchCategories({ isOccasion: true });
        const list = res?.categories || res?.data || (Array.isArray(res) ? res : []);
        const filtered = list.filter((c) => c.isOccasion === true || c.isOccasion === "true");

        if (filtered.length > 0) {
          setOccasionCategories(
            filtered.map((cat, idx) => ({
              id: cat._id || `occ_${idx}`,
              title: cat.name,
              name: cat.name,
              image:
                cat.image ||
                cat.promoImage ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
              link: `/shop?category=${encodeURIComponent(cat.name)}`,
            }))
          );
        } else {
          setOccasionCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch occasion categories:", err);
        setOccasionCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getOccasions();
  }, []);

  const collections = [
    {
      title: "Eco-friendly",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      link: "/shop?category=Eco-friendly",
    },
    {
      title: "Local Artisans",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      link: "/shop?category=Artisans",
    },
  ];

  if (!loading && occasionCategories.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Our Occasion Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Our Occasion
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Shop curated categories for every special moment
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 sm:h-56 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {occasionCategories.map((occ, idx) => (
              <Link
                key={occ.id || idx}
                to={occ.link}
                className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex items-end p-5"
              >
                <img
                  src={occ.image}
                  alt={occ.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-xl sm:text-2xl font-black">{occ.title}</h3>
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 mt-1 group-hover:translate-x-1 transition-transform">
                    Explore Category &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Our Collection Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Our Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              to={col.link}
              className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex items-end p-5"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="text-xl sm:text-2xl font-black">{col.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

