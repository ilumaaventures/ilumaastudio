import React from "react";
import { Quote } from "lucide-react";

export default function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF7F2] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading matching reference image */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2E1B13] font-normal tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What our customers are saying
          </h2>
        </div>

        {/* 3 Quotation Cards Grid matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="border border-[#2E1B13]/30 rounded-2xl p-7 sm:p-9 bg-white flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[220px]"
            >
              {/* Decorative Quotation Mark Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#2E1B13]/70 fill-[#2E1B13]/10 transform rotate-180" />
              </div>

              {/* Quote Copy */}
              <p className="text-sm sm:text-base text-[#4A3B32] font-light leading-relaxed italic mb-6">
                "{item.quote}"
              </p>

              {/* Author Signature */}
              <div className="text-xs sm:text-sm text-[#7D6E63] font-medium tracking-wide">
                - {item.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
