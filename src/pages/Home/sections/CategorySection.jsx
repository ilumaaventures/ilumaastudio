import React from "react";
import { ArrowRight } from "lucide-react";

function CategorySection({
  title,
  subtitle,
  categories = [],
  viewAllText = "View All",
  onViewAll,
  onCategoryClick,
  linkUrl = "/",
}) {
  return (
    <section className="w-full py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            {" "}
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
                {subtitle}
              </p>
            )}
          </div>

          <a
            href={linkUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0 ml-1"
          >
            <span>See All</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Horizontal Categories */}
        <div className="relative">
          <div
            className="
              flex gap-4 overflow-x-auto pb-4
              snap-x snap-mandatory
              scrollbar-hide
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick?.(category)}
                className="
                  group
                  flex-none
                  w-[260px]
                  snap-start
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  p-5
                  text-left
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-lg
                  sm:w-[280px]
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-4
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-2xl
                    transition-colors
                    group-hover:bg-blue-100
                  "
                >
                  {category.icon}
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-gray-900">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                    {category.description}
                  </p>
                )}

                {/* Explore */}
                <div
                  className="
                    mt-4
                    flex items-center gap-1
                    text-sm font-medium
                    text-blue-600
                    opacity-0
                    transition-all
                    group-hover:opacity-100
                  "
                >
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </button>
            ))}

            {/* View All Card - Always Last */}
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="
                  group
                  flex-none
                  w-[180px]
                  snap-start
                  rounded-2xl
                  border-2 border-dashed
                  border-blue-200
                  bg-blue-50/50
                  p-5
                  transition-all duration-200
                  hover:border-blue-400
                  hover:bg-blue-50
                  sm:w-[200px]
                "
              >
                <div className="flex h-full min-h-[155px] flex-col items-center justify-center text-center">
                  <div
                    className="
                      mb-3
                      flex h-12 w-12
                      items-center justify-center
                      rounded-full
                      bg-blue-100
                      text-blue-600
                      transition-all
                      group-hover:bg-blue-600
                      group-hover:text-white
                    "
                  >
                    <ArrowRight size={22} />
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {viewAllText}
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    Explore all categories
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
