import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { fetchCategories } from "../../../api/categoryService";
import { getServices } from "../../../api/serviceService";
import { ServiceGridSkeleton } from "../../../Components/Skeletons";

const FALLBACK_HOME_SERVICES = [
  {
    _id: "s1",
    id: 1,
    name: "Full Home Deep Cleaning",
    category: "Home Care",
    price: 799,
    rating: 4.9,
    reviews: 428,
    location: "Lucknow",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
    badge: "Popular",
  },
  {
    _id: "s2",
    id: 2,
    name: "Salon at Home for Women",
    category: "Beauty & Care",
    price: 599,
    rating: 4.8,
    reviews: 315,
    location: "Lucknow",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80",
    badge: "Trending",
  },
  {
    _id: "s3",
    id: 3,
    name: "AC Repair & Jet Servicing",
    category: "Home Repair",
    price: 399,
    rating: 4.7,
    reviews: 276,
    location: "Lucknow",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80",
    badge: "Top Rated",
  },
  {
    _id: "s4",
    id: 4,
    name: "Plumbing Repair Service",
    category: "Home Repair",
    price: 299,
    rating: 4.6,
    reviews: 185,
    location: "Lucknow",
    image:
      "https://images.unsplash.com/photo-15057498577917-a65157d3320a?auto=format&fit=crop&w=700&q=80",
    badge: "Verified",
  },
];

const formatLocation = (loc) =>
  typeof loc === "string"
    ? loc
    : loc?.city || loc?.address || loc?.state || "Lucknow";

export default function PopularServices() {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [featuredServices, setFeaturedServices] = useState(
    FALLBACK_HOME_SERVICES,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, servicesRes] = await Promise.all([
          fetchCategories({ businessType: "Service", isFeatured: true }),
          getServices({ limit: 8 }),
        ]);

        setServiceCategories(
          categoriesRes?.data || categoriesRes?.categories || [],
        );

        const list = Array.isArray(servicesRes)
          ? servicesRes
          : servicesRes?.services || servicesRes?.data || [];
        if (list.length > 0) {
          setFeaturedServices(
            list.map((s, idx) => ({
              _id: s._id || `s_${idx}`,
              id: s._id || `s_${idx}`,
              name: s.serviceName || "Home Service",
              category:
                typeof s.category === "object"
                  ? s.category?.name || "Home Care"
                  : s.category || "Home Care",
              price: Number(s.pricing?.amount || s.price) || 299,
              rating: s.rating || 4.8,
              reviews: s.reviewsCount || 120,
              location: formatLocation(s.location),
              image:
                s.thumbnail ||
                s.images?.[0] ||
                FALLBACK_HOME_SERVICES[idx % FALLBACK_HOME_SERVICES.length]
                  .image,
              badge: idx % 2 === 0 ? "Popular" : "Verified",
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load popular services:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#2563eb]" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Doorstep Services
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Book verified home cleaning, repair experts & salon services
            directly
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-[#2563eb] hover:underline transition-colors shrink-0"
          >
            See all
          </Link>
        </div>
      </div>
      {/* Horizontal Scroll Service Slider with Direct Book */}
      {loading ? (
        <ServiceGridSkeleton count={4} />
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 hide-scrollbar"
          >
            {featuredServices.map((service, idx) => {
              const serviceId = service._id || service.id;
              return (
                <div
                  key={serviceId}
                  onClick={() => navigate(`/services/${serviceId}`)}
                  className="group shrink-0 w-[240px] sm:w-[270px] lg:w-[285px] snap-start bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-2xs hover:shadow-md hover:border-[#2563eb]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-[160px] sm:h-[175px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={
                          service.image ||
                          FALLBACK_HOME_SERVICES[
                            idx % FALLBACK_HOME_SERVICES.length
                          ].image
                        }
                        alt={service.name}
                        draggable="false"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {service.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-[10px] font-extrabold text-[#2563eb] shadow-sm">
                          {service.badge}
                        </span>
                      )}
                      <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ArrowUpRight size={15} />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white">
                        <ShieldCheck size={13} className="text-blue-400" />
                        <span className="text-[10px] font-bold">
                          Verified Expert
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#2563eb]">
                        {service.category}
                      </p>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1.5 pt-0.5 text-[10px]">
                        <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded font-bold text-amber-700 dark:text-amber-400">
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span>{service.rating || 4.8}</span>
                        </div>
                        <span className="text-slate-400">
                          ({service.reviews || 80})
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-medium truncate">
                          {service.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      ₹{(service.price || 0).toLocaleString("en-IN")}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/services/${serviceId}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((item, idx) => (
              <Link
                key={item._id || item.id || idx}
                to={`/services?category=${encodeURIComponent(item.name || "")}`}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-center shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between min-h-[160px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2 overflow-hidden relative">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#2563eb] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {item.subtitle || "Verified Professionals"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
