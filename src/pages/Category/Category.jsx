import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight, Grid } from "lucide-react";
import { fetchCategories } from "../../api/categoryService";
import { CategoryGridSkeleton } from "../../Components/Skeletons";

const FALLBACK_CATEGORIES = [
  { _id: "c1", name: "Fashion", description: "Clothing, footwear and luxury apparel", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop" },
  { _id: "c2", name: "Electronics", description: "Smartphones, laptops, audio and gadgets", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" },
  { _id: "c3", name: "Home & Living", description: "Furniture, cookware, decor and lamps", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400&auto=format&fit=crop" },
  { _id: "c4", name: "Beauty & Personal Care", description: "Skincare, perfumes, makeup and wellness", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { _id: "c5", name: "Sports & Outdoors", description: "Fitness equipment, footwear and activewear", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop" },
  { _id: "c6", name: "Books & Stationery", description: "Best-selling novels, journals and art supplies", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" },
  { _id: "c7", name: "Toys & Games", description: "Action figures, board games and puzzles", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=400&auto=format&fit=crop" },
  { _id: "c8", name: "Automotive", description: "Car accessories, chargers and cleaning kits", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop" },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await fetchCategories({ businessType: "E-Commerce" });
        const list = res?.data || res?.categories || (Array.isArray(res) ? res : []);
        setCategories(list.length > 0 ? list : FALLBACK_CATEGORIES);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const displayList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#2563eb]">Home</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 dark:text-white font-bold">Categories</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
            Browse All Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Explore products curated across our top categories
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <CategoryGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayList.map((cat, idx) => (
              <Link
                key={cat._id || idx}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2563eb]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Category Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={cat.image || FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length].image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#2563eb] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                    {cat.description || "Discover premium products in this collection."}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#2563eb] pt-2">
                    <span>Explore Collection</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
