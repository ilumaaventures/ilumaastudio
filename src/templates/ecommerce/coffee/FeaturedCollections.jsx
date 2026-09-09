import React from "react";

export default function FeaturedCollections({
  business = {},
  categories = [],
  onSelectCategory = () => {},
}) {
  // We showcase the top 3 featured collections matching the reference
  const featured = categories.slice(0, 3);

  return (
    <section id="crux-mission-section" className="w-full bg-[#FAF7F2] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Mission Statement Header */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2E1B13] font-normal mb-5 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {business?.tagline || "Good Coffee with a Greater Purpose"}
        </h2>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#5C4D43] font-light leading-relaxed mb-12 sm:mb-16">
          {business?.mission ||
            "All of our coffee beans are sustainably sourced, and we're Fair Trade certified, ensuring all farmers are treated and paid fairly. Our small team has over 75 years of combined experience in the coffee industry, making us pioneers in creating the perfect blend."}
        </p>

        {/* 3 Featured Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {featured.map((item) => (
            <div
              key={item.id || item.slug}
              onClick={() => onSelectCategory(item.slug || item.id)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Image Container with Subtle Dark Border & Rounded Corners matching reference */}
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#2E1B13]/25 bg-[#EBE4DC] shadow-sm group-hover:shadow-md transition-all duration-300 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#2E1B13]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title Below Image */}
              <h3
                className="mt-4 text-base sm:text-lg font-serif text-[#2E1B13] group-hover:text-amber-800 transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {item.name}
              </h3>
            </div>
          ))}
        </div>

        {/* View All Collections Button (Pill border button matching reference) */}
        <div>
          <button
            onClick={() => onSelectCategory("all")}
            className="inline-block px-7 py-2.5 rounded-full border border-[#2E1B13] text-[#2E1B13] hover:bg-[#2E1B13] hover:text-[#FAF7F2] text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-sm"
          >
            View all collections
          </button>
        </div>
      </div>
    </section>
  );
}
