import React, { useRef } from "react";
import { Film, ThumbsUp, ChevronRight, ChevronLeft } from "lucide-react";

export default function NearbyLatestMovies({
  movies = [],
  onSelectCategory,
}) {
  const scrollRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Film size={20} className="text-blue-600" />
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Latest Movies & Review
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Swipe left & right
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Scroll Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Scroll Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory("movies")}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer ml-1"
          >
            <span className="hidden sm:inline">View All Theatres</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Movies Movable Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((mov) => (
          <div
            key={mov.id}
            onClick={() => onSelectCategory("movies")}
            className="shrink-0 w-40 sm:w-48 snap-start group flex flex-col justify-between rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-400 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Poster with thumbs up rating badge */}
            <div className="relative aspect-3/4 overflow-hidden bg-slate-900">
              <img
                src={mov.image}
                alt={mov.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Rating score badge */}
              <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[10px] font-black border border-white/20">
                <ThumbsUp size={11} className="text-emerald-400 fill-emerald-400" />
                <span>{mov.ratingScore}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-1">
              <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {mov.title}
              </h5>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{mov.language}</span>
                <span className="text-slate-400 truncate max-w-[70px]">{mov.genre}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
