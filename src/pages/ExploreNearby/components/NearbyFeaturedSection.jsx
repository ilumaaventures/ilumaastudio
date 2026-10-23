import React, { useRef } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import NearbyProductCard from "./NearbyProductCard";
import NearbyBusinessCard from "./NearbyBusinessCard";
import NearbyServiceCard from "./NearbyServiceCard";

export default function NearbyFeaturedSection({
  featuredItems = [],
  onAddToPlan,
  plannedItemIds = [],
}) {
  const scrollRef = useRef(null);

  if (!featuredItems || featuredItems.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50/50 via-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Section Heading & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              <Sparkles size={13} />
              <span>Curated Local Spotlight</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Discover Your Neighbourhood
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Handpicked local artisans, trusted stores, specialty culinary
              spots, and experiences nearby.
            </p>
          </div>
        </div>

        {/* Featured Movable Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredItems.map((item) => {
            const isSaved = plannedItemIds.includes(item.id);

            if (item.type === "business") {
              return (
                <div
                  key={item.id}
                  className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                >
                  <NearbyBusinessCard
                    business={item}
                    onAddToPlan={onAddToPlan}
                    isInPlan={isSaved}
                  />
                </div>
              );
            }
            if (item.type === "service") {
              return (
                <div
                  key={item.id}
                  className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                >
                  <NearbyServiceCard
                    service={item}
                    onAddToPlan={onAddToPlan}
                    isInPlan={isSaved}
                  />
                </div>
              );
            }
            return (
              <NearbyProductCard
                key={item.id}
                product={item}
                onAddToPlan={onAddToPlan}
                isInPlan={isSaved}
                isCarousel={true}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
