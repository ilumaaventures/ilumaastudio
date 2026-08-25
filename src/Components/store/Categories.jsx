import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../pages/Store/StoreContext";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export default function Categories({ theme = null }) {
  const { business, categories, storeHomePath, products } = useStore();
  const basePath =
    storeHomePath ||
    `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  if (!categories || categories.length === 0) {
    return null;
  }

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div className="space-y-1 text-left">
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
            style={{ color: primaryColor }}
          >
            <Sparkles size={12} /> Curated Departments
          </span>
          <h2
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
            style={{ color: theme?.colors?.textColor || "#0f172a" }}
          >
            Explore Categories
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Browse our handpicked inventory selections
          </p>
        </div>

        <Link
          to={`${basePath}/products`}
          className="text-xs font-bold transition flex items-center gap-1 hover:underline"
          style={{ color: primaryColor }}
        >
          <span>View Full Catalog</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const catCount = (products || []).filter(
            (p) =>
              p.category === cat._id ||
              p.category?._id === cat._id ||
              p.category?.name === cat.name,
          ).length;

          return (
            <Link
              key={cat._id}
              to={`${basePath}/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl p-5 border border-slate-100/90 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 cursor-pointer overflow-hidden"
              style={{
                backgroundColor: theme?.colors?.cardBg || "#FFFFFF",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                }}
              >
                {cat.image || cat.icon ? (
                  <img
                    src={cat.image || cat.icon}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Tag size={24} />
                )}
              </div>

              <div className="space-y-0.5">
                <span
                  className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition block capitalize"
                  style={{ color: theme?.colors?.textColor || "#1e293b" }}
                >
                  {cat.name}
                </span>
                {catCount > 0 && (
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {catCount} {catCount === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
