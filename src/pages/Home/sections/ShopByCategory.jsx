import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CategoryPillSkeleton } from "../../../Components/Skeletons";

function ShopByCategory({ categories = [], loading = false }) {
  const displayList = categories.length > 0 ? categories : [];

  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Shop by Categories
          </h2>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <CategoryPillSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4">
          {displayList.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-2xl ${cat.bgColor} flex items-center justify-center text-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-105 group-hover:shadow-md transition-all duration-200`}
              >
                {/* {cat.image} */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Category Name */}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#2563eb] dark:group-hover:text-blue-400 transition-colors truncate w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

export default ShopByCategory;
