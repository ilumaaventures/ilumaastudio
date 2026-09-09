import React from "react";

export default function EditorialSplitCard({
  title,
  description,
  buttonText = "Read more",
  image,
  imageAlt,
  reversed = false,
  onButtonClick = () => {},
}) {
  return (
    <section className="w-full bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Outer Box Container with Rounded Border matching reference images */}
        <div className="border border-[#2E1B13]/30 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 items-center ${
              reversed ? "md:grid-flow-dense" : ""
            }`}
          >
            {/* Image Column */}
            <div
              className={`w-full h-72 sm:h-96 md:h-[420px] overflow-hidden ${
                reversed ? "md:col-start-2" : ""
              }`}
            >
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700"
              />
            </div>

            {/* Content Column */}
            <div
              className={`p-8 sm:p-12 md:p-14 flex flex-col justify-center items-start ${
                reversed ? "md:col-start-1" : ""
              }`}
            >
              <h2
                className="text-2xl sm:text-3xl font-serif text-[#2E1B13] font-normal tracking-tight mb-5 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {title}
              </h2>

              <p className="text-sm sm:text-base text-[#5C4D43] font-light leading-relaxed mb-8">
                {description}
              </p>

              <button
                onClick={onButtonClick}
                className="px-7 py-2.5 rounded-full bg-[#4A2E1B] hover:bg-[#2E1B13] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
