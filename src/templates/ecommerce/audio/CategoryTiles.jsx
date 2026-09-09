import React from "react";

export default function CategoryTiles({
  categories = [],
  onSelectCategory = () => {},
}) {
  const heroCat = categories.find((c) => c.slug === "headphones") || categories[0];
  const otherCats = categories.filter((c) => c.slug !== heroCat?.slug);

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching reference */}
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#121212]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            SHOP BY CATEGORIES
          </h2>
        </div>

        {/* Asymmetric Category Grid matching Reference Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Big Featured "Headphones" Tile */}
          {heroCat && (
            <div
              onClick={() => onSelectCategory(heroCat.slug || heroCat.id)}
              className="group relative w-full aspect-square sm:aspect-4/3 lg:aspect-auto lg:h-full min-h-[360px] sm:min-h-[460px] bg-[#141414] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={heroCat.image}
                alt={heroCat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* 60 007 Anniversary Badge in Top-Left */}
              {heroCat.badge && (
                <div className="absolute top-5 left-5 text-white/90 text-[10px] font-bold tracking-[0.25em] border border-white/30 px-2.5 py-1 uppercase backdrop-blur-xs">
                  {heroCat.badge} YEARS
                </div>
              )}

              {/* Title Bottom-Left */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                  {heroCat.name}
                </h3>
                <span className="text-xs text-neutral-300 tracking-widest uppercase font-medium mt-1 inline-block group-hover:underline">
                  Explore Acoustics →
                </span>
              </div>
            </div>
          )}

          {/* Right Column: 2x2 Category Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {otherCats.slice(0, 4).map((cat) => (
              <div
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory(cat.slug || cat.id)}
                className="group relative w-full aspect-square bg-[#E8E8E8] overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Title Bottom-Left */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-neutral-300 tracking-wider uppercase font-medium">
                    {cat.itemCount ? `${cat.itemCount} models` : "Shop"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
