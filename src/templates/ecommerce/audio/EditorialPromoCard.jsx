import React from "react";

export default function EditorialPromoCard({
  title,
  description,
  image,
  imageAlt,
  buttonText,
  primaryButtonText,
  secondaryButtonText,
  hasDots = false,
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
}) {
  return (
    <section className="w-full bg-[#FFFFFF] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFAFA] border border-[#EAEAEA] grid grid-cols-1 md:grid-cols-2 items-center overflow-hidden">
          {/* Left Column: Image with optional carousel dots matching reference */}
          <div className="relative w-full h-80 sm:h-96 md:h-[400px] bg-[#EFEFEF] overflow-hidden flex items-center justify-center p-8">
            <img
              src={image}
              alt={imageAlt || title}
              className="max-h-full max-w-full object-contain hover:scale-102 transition-transform duration-500"
            />

            {/* Pagination dots if requested (matching MG20 Gaming Card in Image 2) */}
            {hasDots && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-black/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
              </div>
            )}
          </div>

          {/* Right Column: Text & Actions matching reference */}
          <div className="p-8 sm:p-12 md:p-14 flex flex-col justify-center items-start text-left">
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#121212] mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-8 max-w-md">
              {description}
            </p>

            {/* Actions: either dual buttons or single button */}
            {primaryButtonText && secondaryButtonText ? (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={onPrimaryClick}
                  className="px-6 py-3 bg-[#121212] hover:bg-neutral-800 text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
                >
                  {primaryButtonText}
                </button>
                <button
                  onClick={onSecondaryClick}
                  className="px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
                >
                  {secondaryButtonText}
                </button>
              </div>
            ) : (
              <button
                onClick={onPrimaryClick}
                className="px-7 py-3 bg-[#121212] hover:bg-neutral-800 text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
              >
                {buttonText || "KNOW MORE"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
