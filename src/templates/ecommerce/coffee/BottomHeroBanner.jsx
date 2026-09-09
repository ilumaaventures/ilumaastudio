import React from "react";

export default function BottomHeroBanner({
  title = "COFFEE FOR EVERYONE",
  description = "Featuring the freshest in our expanded range of seasonal coffees sourced throughout the year. After five minutes, skim the crust of the surface and allow to stand for a further two minutes. Plunge delicately, serve hot, and enjoy!",
  buttonText = "Shop Now",
  bgImage = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=80",
  onButtonClick = () => {},
}) {
  return (
    <section className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden select-none bg-[#120A06]">
      {/* Background Coffee Bean Texture */}
      <img
        src={bgImage}
        alt="Coffee Beans Background"
        className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F120B]/90 via-[#1A0E07]/60 to-[#1F120B]/90" />

      {/* Content Container matching reference */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10">
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#FAF7F2] font-semibold tracking-wider uppercase mb-6 drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#E0D7CE] font-light leading-relaxed mb-8 max-w-2xl drop-shadow">
          {description}
        </p>

        <button
          onClick={onButtonClick}
          className="px-8 py-3 rounded-full bg-[#4A2E1B] hover:bg-[#FAF7F2] text-[#FAF7F2] hover:text-[#2E1B13] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xl border border-amber-900/60 hover:border-white"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
