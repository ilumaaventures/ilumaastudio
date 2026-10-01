import React, { useRef } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";

const foodSpots = [
  {
    id: 1,
    name: "The Urban Tandoor",
    category: "North Indian",
    location: "Gomti Nagar, Lucknow",
    rating: "4.8",
    reviews: "248",
    price: "₹₹",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Chai & Stories",
    category: "Café & Beverages",
    location: "Hazratganj, Lucknow",
    rating: "4.7",
    reviews: "186",
    price: "₹",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85",
    tag: "Trending",
  },
  {
    id: 3,
    name: "Royal Spice",
    category: "Indian Cuisine",
    location: "Indira Nagar, Lucknow",
    rating: "4.9",
    reviews: "421",
    price: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
    tag: "Top Rated",
  },
  {
    id: 4,
    name: "Street Bowl",
    category: "Street Food",
    location: "Aliganj, Lucknow",
    rating: "4.6",
    reviews: "154",
    price: "₹",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85",
    tag: "Local Favorite",
  },
  {
    id: 5,
    name: "The Dessert House",
    category: "Desserts & Bakery",
    location: "Mahanagar, Lucknow",
    rating: "4.8",
    reviews: "319",
    price: "₹₹",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=85",
    tag: "Must Try",
  },
  {
    id: 6,
    name: "Green Leaf Kitchen",
    category: "Healthy & Vegetarian",
    location: "Vibhuti Khand, Lucknow",
    rating: "4.7",
    reviews: "203",
    price: "₹₹",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
    tag: "Healthy Pick",
  },
];

const PopularFoodSpots = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            {/* Small heading */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-orange-500" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                Discover & Dine
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Popular Food Spots
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover restaurants, cafés, food stalls and local favorites
              around you.
            </p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>

            <button className="ml-3 flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-orange-600">
              Explore All
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* ================= FOOD CARDS ================= */}

        <div
          ref={scrollRef}
          className="
            flex
            gap-5
            overflow-x-auto
            scroll-smooth
            pb-5
            scrollbar-none
            snap-x
            snap-mandatory
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {foodSpots.map((food) => (
            <div
              key={food.id}
              className="
                group
                min-w-[285px]
                max-w-[285px]
                flex-shrink-0
                snap-start
                cursor-pointer
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-[0_6px_25px_rgba(15,23,42,0.07)]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.13)]
                sm:min-w-[315px]
                sm:max-w-[315px]
              "
            >
              {/* ================= IMAGE ================= */}

              <div className="relative h-[215px] overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                />

                {/* Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                {/* Tag */}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                    {food.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                  <Star
                    size={13}
                    fill="currentColor"
                    className="text-yellow-400"
                  />

                  <span className="text-xs font-bold text-white">
                    {food.rating}
                  </span>

                  <span className="text-[10px] text-white/75">
                    ({food.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                    {food.price}
                  </span>
                </div>
              </div>

              {/* ================= CONTENT ================= */}

              <div className="p-4">
                {/* Name */}
                <h3 className="truncate text-[17px] font-bold text-slate-900 transition-colors group-hover:text-orange-600">
                  {food.name}
                </h3>

                {/* Category */}
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {food.category}
                </p>

                {/* Location */}
                <div className="mt-4 flex items-center gap-1.5">
                  <MapPin size={14} className="flex-shrink-0 text-orange-500" />

                  <span className="truncate text-xs text-slate-500">
                    {food.location}
                  </span>
                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Explore food spot
                  </span>

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-100
                      text-slate-700
                      transition-all
                      duration-300
                      group-hover:bg-orange-500
                      group-hover:text-white
                    "
                  >
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MOBILE HINT ================= */}

        <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
          <span className="h-px w-8 bg-slate-200" />

          <span className="text-[11px] font-medium text-slate-400">
            Swipe to explore
          </span>

          <span className="h-px w-8 bg-slate-200" />
        </div>
      </div>
    </section>
  );
};

export default PopularFoodSpots;
