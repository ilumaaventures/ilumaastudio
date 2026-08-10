import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowUpRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Zap,
  GraduationCap,
  Trophy,
  Tag,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getServices } from "../../api/serviceService";
import { ServiceGridSkeleton } from "../../Components/Skeletons";

const FALLBACK_SERVICES = [
  {
    _id: "s1",
    id: 1,
    name: "Full Home Deep Cleaning",
    category: "Home Care",
    price: 799,
    rating: 4.9,
    reviews: 428,
    bookings: 1200,
    duration: "2-3 hrs",
    location: "Gomti Nagar, Lucknow",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
    badge: "Popular",
    tag: "nearby",
  },
  {
    _id: "s2",
    id: 2,
    name: "Personal Fitness Coach & Trainer",
    category: "Playing & Fitness",
    price: 1499,
    rating: 4.9,
    reviews: 215,
    bookings: 450,
    duration: "1 hr/session",
    location: "Hazratganj, Lucknow",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80",
    badge: "Premium",
    tag: "playing",
  },
  {
    _id: "s3",
    id: 3,
    name: "Mathematics & Physics Private Tutor",
    category: "Teaching & Tutoring",
    price: 999,
    rating: 4.8,
    reviews: 184,
    bookings: 380,
    duration: "1 hr/session",
    location: "Aliganj, Lucknow",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=80",
    badge: "Top Educator",
    tag: "teaching",
  },
  {
    _id: "s4",
    id: 4,
    name: "Cricket & Badminton Coaching",
    category: "Playing & Fitness",
    price: 1299,
    rating: 4.7,
    reviews: 160,
    bookings: 310,
    duration: "1.5 hrs",
    location: "Mahanagar, Lucknow",
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=700&q=80",
    badge: "Recently Added",
    tag: "playing",
  },
  {
    _id: "s5",
    id: 5,
    name: "Guitar & Piano Music Lessons",
    category: "Teaching & Tutoring",
    price: 899,
    rating: 4.9,
    reviews: 245,
    bookings: 520,
    duration: "1 hr/session",
    location: "Indira Nagar, Lucknow",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80",
    badge: "Popular",
    tag: "teaching",
  },
  {
    _id: "s6",
    id: 6,
    name: "AC Repair & Jet Servicing",
    category: "Repairs",
    price: 399,
    rating: 4.7,
    reviews: 276,
    bookings: 760,
    duration: "1-2 hrs",
    location: "Charbagh, Lucknow",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80",
    badge: "Verified",
    tag: "nearby",
  },
];

const formatLocation = (loc) => {
  if (!loc) return "Lucknow";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    return loc.city || loc.address || loc.state || "Lucknow";
  }
  return "Lucknow";
};

const formatDuration = (dur) => {
  if (!dur) return "45 mins";
  if (typeof dur === "string" || typeof dur === "number") return `${dur}`;
  if (typeof dur === "object") {
    return `${dur.value || dur.amount || 45} ${dur.unit || "mins"}`.trim();
  }
  return "45 mins";
};

function ServiceCard({ service }) {
  const navigate = useNavigate();
  const serviceId = service._id || service.id;

  return (
    <div
      onClick={() => navigate(`/services/${serviceId}`)}
      className="group shrink-0 w-[240px] sm:w-[270px] lg:w-[290px] snap-start cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative h-[170px] sm:h-[185px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={service.image}
            alt={service.name}
            draggable="false"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badge */}
          {service.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-[10px] font-extrabold text-slate-800 dark:text-white shadow-sm">
              {service.badge}
            </span>
          )}

          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${serviceId}`);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm cursor-pointer"
            aria-label={`View ${service.name}`}
          >
            <ArrowUpRight size={17} />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold">Verified Professional</span>
          </div>
        </div>

        {/* Details */}
        <div className="pt-3 px-0.5 space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#2563eb]">
            {typeof service.category === "object"
              ? service.category?.name || "Service"
              : service.category || "Service"}
          </p>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
            {service.name}
          </h3>

          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="fill-emerald-500 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {service.rating || 4.8}
              </span>
            </div>

            <span className="text-[10px] text-slate-400">
              ({service.reviews || 95})
            </span>

            <span className="text-[10px] text-slate-300">•</span>

            <span className="text-[10px] text-slate-400 font-medium">
              {service.bookings || 350}+ booked
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-slate-400 text-[10px]">
            <MapPin size={12} className="shrink-0" />
            <span className="font-medium truncate">
              {formatLocation(service.location)}
            </span>
            <span className="text-slate-300">•</span>
            <Clock3 size={11} className="shrink-0" />
            <span>{formatDuration(service.duration)}</span>
          </div>
        </div>
      </div>

      {/* Price & Direct Book Button */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div>
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            From ₹{(service.price || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${serviceId}`);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function ServiceSection({ title, subtitle, services, icon }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10 sm:mb-12 last:mb-0 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
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
          <Link
            to="/services"
            className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition flex items-center gap-1"
          >
            {" "}
            <span>Sell All</span>
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
      >
        {services.map((service) => (
          <ServiceCard key={service._id || service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

export default function ServiceListing() {
  const [serviceList, setServiceList] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        setLoading(true);
        const res = await getServices();
        const list = Array.isArray(res)
          ? res
          : res?.services || res?.data || [];
        if (list.length > 0) {
          const formatted = list.map((s, idx) => ({
            _id: s._id || `s_${idx}`,
            id: s._id || `s_${idx}`,
            name: s.name || "Home Service",
            category:
              typeof s.category === "object"
                ? s.category?.name || "Home Care"
                : s.category || "Home Care",
            price: Number(s.pricing?.amount || s.price) || 299,
            rating: s.rating || 4.8,
            reviews: s.reviewsCount || 120,
            bookings: s.bookingsCount || 450,
            duration: formatDuration(s.duration),
            location: formatLocation(s.location),
            image:
              s.thumbnail ||
              s.images?.[0] ||
              FALLBACK_SERVICES[idx % FALLBACK_SERVICES.length].image,
            badge:
              idx % 3 === 0
                ? "Popular"
                : idx % 3 === 1
                  ? "Premium"
                  : "Recently Added",
          }));
          setServiceList(formatted);
        }
      } catch (err) {
        console.error("Services listing fetch fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    loadServicesData();
  }, []);

  const nearbyServices = serviceList.slice(0, 5);
  const recentlyAddedServices = [...serviceList].reverse().slice(0, 5);
  const premiumServices = serviceList.filter(
    (s) => s.price >= 500 || s.badge === "Premium",
  );
  const playingServices = serviceList.filter(
    (s) =>
      (s.category || "").toLowerCase().includes("play") ||
      (s.name || "").toLowerCase().includes("fitness") ||
      (s.name || "").toLowerCase().includes("sport") ||
      (s.name || "").toLowerCase().includes("coach"),
  );
  const teachingServices = serviceList.filter(
    (s) =>
      (s.category || "").toLowerCase().includes("teach") ||
      (s.name || "").toLowerCase().includes("tutor") ||
      (s.name || "").toLowerCase().includes("music") ||
      (s.name || "").toLowerCase().includes("lesson"),
  );

  return (
    <section className="w-full py-10 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            Book Doorstep Services
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Verified Services, Coaching & Repairs
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Explore nearby home experts, sports trainers, personal tutors, and
            top-rated doorstep professionals.
          </p>
        </div>

        {loading ? (
          <ServiceGridSkeleton count={4} />
        ) : (
          <>
            {/* Section 1: Services Near You */}
            <ServiceSection
              title="Services Nearby You"
              subtitle="Verified professionals available in your locality"
              services={
                nearbyServices.length > 0 ? nearbyServices : serviceList
              }
              icon={<MapPin size={22} className="text-[#2563eb]" />}
            />

            {/* Promo Banner 1 */}
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 z-10 max-w-xl">
                <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider border border-blue-400/20">
                  Special Offer
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Get ₹200 OFF on First Home Cleaning or AC Service!
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Use coupon code{" "}
                  <span className="font-bold text-amber-300">STUDIOHOME</span>{" "}
                  at checkout. Valid on all verified doorstep appointments.
                </p>
              </div>

              <Link
                to="/services"
                className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer z-10"
              >
                <span>Claim Offer</span>
                <ArrowRight size={15} />
              </Link>

              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Section 2: Recently Added Services */}
            <ServiceSection
              title="Recently Added Services"
              subtitle="New home care, coaching and tutoring experts joining ILumaaStudio"
              services={
                recentlyAddedServices.length > 0
                  ? recentlyAddedServices
                  : serviceList
              }
              icon={<Sparkles size={22} className="text-amber-500" />}
            />

            {/* Section 3: Playing & Sports Coaching */}
            <ServiceSection
              title="Playing & Sports Coaching"
              subtitle="Personal fitness trainers, cricket, tennis & badminton coaches"
              services={
                playingServices.length > 0
                  ? playingServices
                  : FALLBACK_SERVICES.filter((s) => s.tag === "playing")
              }
              icon={<Trophy size={22} className="text-emerald-500" />}
            />

            {/* Promo Banner 2 */}
            <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 z-10 max-w-xl">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider">
                  Personalized Learning & Sports
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Book Experienced Tutors & Sports Trainers at Doorstep
                </h3>
                <p className="text-xs text-amber-100 font-medium">
                  Verified 1-on-1 private tutoring, music lessons, and fitness
                  coaching tailored to your schedule.
                </p>
              </div>

              <Link
                to="/services"
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer z-10"
              >
                <span>Explore Trainers</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Section 4: Teaching & Tutoring */}
            <ServiceSection
              title="Teaching & Tutoring"
              subtitle="Home tutors for Academics, Languages & Music Lessons"
              services={
                teachingServices.length > 0
                  ? teachingServices
                  : FALLBACK_SERVICES.filter((s) => s.tag === "teaching")
              }
              icon={<GraduationCap size={22} className="text-purple-500" />}
            />

            {/* Section 5: Premium Services */}
            <ServiceSection
              title="Premium Home Services"
              subtitle="Highly rated doorstep services with satisfaction guarantee"
              services={
                premiumServices.length > 0 ? premiumServices : serviceList
              }
              icon={<Zap size={22} className="text-blue-600" />}
            />
          </>
        )}
      </div>
    </section>
  );
}
