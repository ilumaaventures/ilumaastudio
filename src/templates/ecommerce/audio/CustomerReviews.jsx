import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerReviews({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) return null;

  const current = reviews[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section id="audio-reviews-section" className="w-full bg-[#FFFFFF] py-16 sm:py-20 border-b border-[#EAEAEA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Heading matching reference */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#121212] mb-10"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          CUSTOMER REVIEWS
        </h2>

        {/* Circular Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-neutral-200 shadow-sm">
          <img
            src={current.avatar}
            alt={current.author}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Reviewer Name */}
        <h4 className="text-base sm:text-lg font-bold text-[#121212] tracking-wide mb-1.5">
          {current.author}
        </h4>

        {/* 5 Gold Stars */}
        <div className="flex justify-center gap-1 text-amber-500 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
            />
          ))}
        </div>

        {/* Review Italic Text matching reference */}
        <div className="max-w-2xl mx-auto mb-8 px-6">
          <p className="text-xs sm:text-sm md:text-base text-neutral-700 italic font-normal leading-relaxed">
            "{current.review}"
          </p>
        </div>

        {/* Pagination Dots (• • •) */}
        <div className="flex justify-center items-center gap-2 mb-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Review ${idx + 1}`}
              className="p-1 focus:outline-none"
            >
              <span
                className={`block rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-2.5 h-2.5 bg-black"
                    : "w-2 h-2 bg-neutral-300 hover:bg-neutral-500"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Side Arrow Navigation Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous Review"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Review"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
