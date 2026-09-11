import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Star,
  Users,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Award,
} from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function HotelResortTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeSuiteType, setActiveSuiteType] = useState("all");

  // Reservation Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const [suiteCategory, setSuiteCategory] = useState("All Suites & Villas");

  const themeColors = customization.colors || {
    primary: "#9A7B4F",
    secondary: "#B89662",
    accent: "#D4AF37",
    background: "#FAF8F5",
    cardBg: "#FFFFFF",
    text: "#1E1E1E",
  };

  const handleBook = (srv = null) => {
    setSelectedService(srv);
    setBookingOpen(true);
  };

  const filteredSuites =
    activeSuiteType === "all"
      ? services
      : services.filter(
          (s) =>
            s.category?.toLowerCase() === activeSuiteType.toLowerCase() ||
            s.serviceName?.toLowerCase().includes(activeSuiteType.toLowerCase()),
        );

  const resortExperiences = [
    {
      title: "Private Oceanfront Infinity Pools",
      description:
        "Heated freshwater pools overlooking turquoise waters with private daybed cabanas and dedicated refreshment service.",
      icon: Waves,
      tag: "Signature Amenity",
    },
    {
      title: "Michelin-Inspired Coastal Gastronomy",
      description:
        "Fresh daily catch, wood-fired hearth delicacies, and bespoke beachfront candlelit private dining curated by master chefs.",
      icon: Utensils,
      tag: "Fine Dining",
    },
    {
      title: "Ayurvedic & Thermal Wellness Sanctuary",
      description:
        "Organic herbal wraps, sound bath therapy, ocean mist hydrotherapy, and private overwater meditation pavilions.",
      icon: Sparkles,
      tag: "Wellness Spa",
    },
    {
      title: "Sunset Catamaran & Yacht Charters",
      description:
        "Private skippered cruises along coral atolls with sommelier-paired champagne and dolphin watching excursions.",
      icon: Compass,
      tag: "Excursion",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Announcement Bar & Header */}
      <TemplateHeader
        business={business}
        onOpenBooking={() => handleBook()}
        isService={true}
        themeColors={themeColors}
        announcementText={
          customization.customContent?.announcement ||
          "✨ COMPLIMENTARY SUNSET CHAMPAGNE CRUISE & ₹5,000 SPA CREDIT WITH DIRECT VILLA RESERVATIONS"
        }
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Photography with Elegant Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={
                customization.heroBanner ||
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop&q=85"
              }
              alt="Luxury Resort Horizon"
              className="w-full h-full object-cover object-center scale-105 transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
            {/* Super Header Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F3E5AB]">
                Forbes Five-Star Rated Luxury Sanctuary
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto drop-shadow-md">
              {customization.heroHeadline ||
                "Where Timeless Luxury Meets Serene Coastal Tranquility."}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-200/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {customization.heroSubtitle ||
                "Private oceanfront infinity villas, world-class gastronomy, pristine private shores, and personalized 24-hour butler concierge."}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleBook()}
                className="px-8 py-4 bg-[#9A7B4F] hover:bg-[#83673F] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition duration-200 cursor-pointer flex items-center gap-2"
              >
                <Calendar size={15} />
                <span>Reserve Your Suite</span>
              </button>
              <a
                href="#suites"
                className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-widest rounded-2xl backdrop-blur-md border border-white/30 transition cursor-pointer"
              >
                Explore Accommodations
              </a>
            </div>
          </div>
        </section>

        {/* RESERVATION CONCIERGE SEARCH STRIP */}
        <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Check-In */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Arrival Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:bg-white focus:border-[#9A7B4F] outline-none transition"
                />
              </div>
            </div>

            {/* Check-Out */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Departure Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:bg-white focus:border-[#9A7B4F] outline-none transition"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Guests / Rooms
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:bg-white focus:border-[#9A7B4F] outline-none transition cursor-pointer"
              >
                <option>1 Adult</option>
                <option>2 Adults (1 Room)</option>
                <option>2 Adults + 1 Child</option>
                <option>Family Suite (4 Guests)</option>
                <option>Villa Group (6+ Guests)</option>
              </select>
            </div>

            {/* Suite Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Accommodation Style
              </label>
              <select
                value={suiteCategory}
                onChange={(e) => setSuiteCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:bg-white focus:border-[#9A7B4F] outline-none transition cursor-pointer"
              >
                <option>All Suites & Villas</option>
                <option>Overwater Ocean Villa</option>
                <option>Private Pool Sanctuary</option>
                <option>Presidential Penthouse</option>
              </select>
            </div>

            {/* Action */}
            <div>
              <button
                onClick={() => handleBook()}
                className="w-full py-3 bg-[#9A7B4F] hover:bg-[#83673F] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Check Rates</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* FEATURED SUITES & VILLAS */}
        <section id="suites" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F] block mb-2">
              Bespoke Sanctuary Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Suites, Overwater Villas & Penthouses
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-2">
              Each residence features custom Italian linens, private plunge pools, panoramic glass balconies, and tailored 24-hour butler services.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: "all", label: "All Residences" },
                { id: "villa", label: "Ocean Villas" },
                { id: "suite", label: "Luxury Suites" },
                { id: "penthouse", label: "Royal Penthouses" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveSuiteType(pill.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeSuiteType === pill.id
                      ? "bg-[#9A7B4F] text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSuites.map((suite) => (
              <div
                key={suite._id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Aspect */}
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={suite.image}
                      alt={suite.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-900 shadow-sm border border-white/40">
                        {suite.duration || "Per Night"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1.5 rounded-xl text-sm font-serif font-black bg-stone-900/90 text-white backdrop-blur-md shadow-md">
                        ₹{Number(suite.price).toLocaleString("en-IN")}
                        <span className="text-[10px] font-normal text-stone-300 ml-1">
                          / night
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#9A7B4F] transition">
                        {suite.serviceName}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed font-light line-clamp-3">
                      {suite.description}
                    </p>

                    {/* Amenities Highlights */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Waves size={13} className="text-[#9A7B4F]" /> Private Plunge Pool
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wifi size={13} className="text-[#9A7B4F]" /> High-Speed Wi-Fi
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={13} className="text-[#9A7B4F]" /> Up to 4 Guests
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Coffee size={13} className="text-[#9A7B4F]" /> Artisanal Breakfast
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleBook(suite)}
                    className="w-full py-3.5 bg-stone-900 hover:bg-[#9A7B4F] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Reserve Residence</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESORT EXPERIENCES & AMENITIES */}
        <section className="py-20 bg-stone-100/60 border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F] block mb-2">
                Unrivaled Hospitality
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900">
                World-Class Resort Experiences
              </h2>
              <p className="text-xs text-stone-500 font-light mt-2">
                Every moment designed to immerse you in tranquility, indulgence, and unforgettable memories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resortExperiences.map((exp, idx) => {
                const Icon = exp.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#9A7B4F] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B4F] block">
                      {exp.tag}
                    </span>
                    <h4 className="text-base font-serif font-bold text-stone-900">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GUEST ACCOLADES & REVIEWS */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  "The most transcendent coastal sanctuary we have ever experienced."
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Celebrated by Condé Nast Traveler and Forbes Guide as one of the world’s top boutique resort destinations.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-[#9A7B4F] flex items-center justify-center font-serif font-bold text-white text-sm">
                    EH
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Eleanor & Harrison Wright</h5>
                    <p className="text-[10px] text-stone-400">London, United Kingdom • Ocean Villa Guests</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-serif font-bold text-[#D4AF37] block">
                    99.4%
                  </span>
                  <p className="text-xs text-stone-300 font-medium mt-1">
                    Guest Satisfaction Index
                  </p>
                  <span className="text-[10px] text-stone-400">Verified luxury traveler reviews</span>
                </div>
                <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-serif font-bold text-[#D4AF37] block">
                    24 / 7
                  </span>
                  <p className="text-xs text-stone-300 font-medium mt-1">
                    Dedicated Private Butler
                  </p>
                  <span className="text-[10px] text-stone-400">Personalized island concierge</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Reservation Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        service={selectedService}
        business={business}
        themeColors={themeColors}
      />

      <TemplateFooter business={business} themeColors={themeColors} isService={true} />
    </div>
  );
}
