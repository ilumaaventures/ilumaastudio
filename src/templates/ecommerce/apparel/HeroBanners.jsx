import React from "react";

export default function HeroBanners({ banners: propBanners = [], onSelectCategory }) {
  const defaultBanners = [
    {
      id: "b1",
      title: "Resort Minimal",
      subtitle: "The Summer Collection",
      category: "Dresses",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    },
    {
      id: "b2",
      title: "Desert Atelier",
      subtitle: "Linen & Utility Staples",
      category: "Shirt",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    },
    {
      id: "b3",
      title: "Raw Earth Tones",
      subtitle: "Knits & Outerwear",
      category: "Jackets",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80",
    },
  ];

  const banners = propBanners && propBanners.length > 0 ? propBanners : defaultBanners;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => onSelectCategory && onSelectCategory(banner.category)}
            className="group relative aspect-[16/10] sm:aspect-[4/3] rounded-xs overflow-hidden bg-[#ECE5DC] cursor-pointer shadow-xs"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 text-left text-white">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-200 font-medium block">
                {banner.subtitle}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold tracking-wide">
                {banner.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
