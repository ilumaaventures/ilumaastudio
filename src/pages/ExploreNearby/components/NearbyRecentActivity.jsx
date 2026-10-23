import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyRecentActivity({
  activities = [],
  onOpenEnquiry,
}) {
  const [ratedItems, setRatedItems] = useState({});
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleRate = (vendorName, rating) => {
    setRatedItems((prev) => ({
      ...prev,
      [vendorName]: rating,
    }));
    toast.success(
      `You rated ${vendorName} ${rating} stars! Thank you for supporting local businesses.`,
    );
  };

  const handleWhatsApp = (activity) => {
    const text = encodeURIComponent(
      `Hello ${activity.businessName}, I saw your listing and reviews on ILumaa Nearby (${activity.location}). I would like to enquire about your services.`,
    );
    window.open(
      `https://wa.me/${activity.whatsappNumber}?text=${text}`,
      "_blank",
    );
  };

  if (!activities || activities.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recent Activity & Verified Reviews
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Scroll left & right
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time enquiries, testimonials, and neighbourhood
            recommendations.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {activities.map((act) => (
          <div
            key={act.id}
            className="shrink-0 w-80 sm:w-88 snap-start bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Info + WhatsApp Button */}
            <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-2 border-b border-slate-100">
              <div className="min-w-0">
                <Link
                  to={`/explore-nearby/${act.businessId || act.id}`}
                  className="font-black text-sm sm:text-base text-slate-900 truncate block hover:text-blue-600 transition-colors"
                >
                  {act.businessName}
                </Link>
                <span className="text-[11px] text-slate-400 block truncate">
                  {act.location}
                </span>
              </div>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={() => handleWhatsApp(act)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] transition cursor-pointer shrink-0"
              >
                <MessageCircle size={13} className="text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Cover Image */}
            <div className="relative h-36 bg-slate-100 overflow-hidden">
              <img
                src={act.coverImage}
                alt={act.businessName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Reviewer Meta & Star Rating */}
            <div className="p-4 sm:p-5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 leading-tight">
                      {act.user}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      Wrote a verified review
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center text-amber-500">
                  {[...Array(act.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  "{act.review}"
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={`/explore-nearby/${act.businessId || act.id}`}
                  className="text-[11px] font-black text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>View Details & Location</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Interactive "How would you rate your experience?" Card in the slider */}
        <div className="shrink-0 w-80 sm:w-96 snap-start bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase border border-blue-400/30">
              Community Voice
            </span>
            <h4 className="text-base sm:text-lg font-black text-white leading-tight">
              How would you rate your experience?
            </h4>
            <p className="text-xs text-slate-300">
              Your ratings help neighbours find trustworthy shops and service
              pros.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-800 pt-1">
            {/* Store 1 */}
            <div className="space-y-2 pt-2 first:pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-xs text-white">
                    Super Mart (Express)
                  </h5>
                  <span className="text-[10px] text-slate-400">
                    Gomti Nagar, Lucknow
                  </span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <Star size={10} fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Tap to rate:
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate("Super Mart", star)}
                      className="transition-transform hover:scale-125 cursor-pointer p-0.5"
                    >
                      <Star
                        size={15}
                        fill={
                          star <= (ratedItems["Super Mart"] || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= (ratedItems["Super Mart"] || 0)
                            ? "text-amber-400"
                            : "text-slate-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Store 2 */}
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-xs text-white">
                    Mitti & Clay Studio
                  </h5>
                  <span className="text-[10px] text-slate-400">
                    Hazratganj, Lucknow
                  </span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <Star size={10} fill="currentColor" />
                  <span>4.9</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Tap to rate:
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate("Mitti & Clay Studio", star)}
                      className="transition-transform hover:scale-125 cursor-pointer p-0.5"
                    >
                      <Star
                        size={15}
                        fill={
                          star <= (ratedItems["Mitti & Clay Studio"] || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= (ratedItems["Mitti & Clay Studio"] || 0)
                            ? "text-amber-400"
                            : "text-slate-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() =>
                onOpenEnquiry("General Feedback", "Community Review")
              }
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition cursor-pointer"
            >
              Write a Local Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
