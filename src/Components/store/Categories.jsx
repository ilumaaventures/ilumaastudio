import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../pages/Store/StoreLayout";
import { Tag } from "lucide-react";

export default function Categories() {
  const { business, categories } = useStore();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-gray-500 text-xs mt-1">Explore our wide selection of curated items</p>
          </div>
          <Link
            to={`/${encodeURIComponent(business.businessName)}/products`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            View All Products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/${encodeURIComponent(business.businessName)}/products?category=${encodeURIComponent(category.name)}`}
              className="group border border-gray-100 rounded-2xl p-4 bg-gray-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition duration-200 flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-200">
                {category.image || category.icon ? (
                  <img
                    src={category.image || category.icon}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Tag size={20} />
                )}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition capitalize">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
