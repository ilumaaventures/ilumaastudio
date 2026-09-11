import React, { useState } from "react";
import {
  Compass,
  Plane,
  Globe,
  Calendar,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Mountain,
  Sun,
  Camera,
  CheckCircle2,
  Users,
  Sparkles,
  Ticket,
} from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function TravelAgencyTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTourFilter, setActiveTourFilter] = useState("all");

  // Search Filter Form State
  const [destination, setDestination] = useState("Europe & Switzerland");
  const [travelMonth, setTravelMonth] = useState("October 2026");
  const [duration, setDuration] = useState("7 - 10 Days");
  const [travelStyle, setTravelStyle] = useState("Luxury Small Group");

  const themeColors = customization.colors || {
    primary: "#0284C7",
    secondary: "#0EA5E9",
    accent: "#F97316",
    background: "#F0F9FF",
    cardBg: "#FFFFFF",
    text: "#0C4A6E",
  };

  const handleBook = (srv = null) => {
    setSelectedService(srv);
    setBookingOpen(true);
  };

  const filteredPackages =
    activeTourFilter === "all"
      ? services
      : services.filter(
          (s) =>
            s.category?.toLowerCase().includes(activeTourFilter.toLowerCase()) ||
            s.serviceName?.toLowerCase().includes(activeTourFilter.toLowerCase()),
        );

  const agencyPillars = [
    {
      title: "100% IATA & ATOL Financial Protection",
      description:
        "Every itinerary is backed by institutional travel bonding, secure client funds, and complete consumer protection.",
      icon: ShieldCheck,
      badge: "Total Peace of Mind",
    },
    {
      title: "Bespoke & Handcrafted Itineraries",
      description:
        "No rigid cookie-cutter bus tours. Every flight, luxury boutique hotel, and excursion is tailored to your pace.",
      icon: Compass,
      badge: "Custom Travel",
    },
    {
      title: "VIP Fast-Track Visa & Flight Concierge",
      description:
        "Our dedicated consular team handles document validation, appointment slots, and premium international airline routing.",
      icon: Plane,
      badge: "End-to-End Service",
    },
    {
      title: "24/7 Dedicated Ground Coordinator",
      description:
        "Direct WhatsApp line to your private trip manager from touchdown until your return flight home.",
      icon: Clock,
      badge: "On-Tour Support",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Header & Notice */}
      <TemplateHeader
        business={business}
        onOpenBooking={() => handleBook()}
        isService={true}
        themeColors={themeColors}
        announcementText={
          customization.customContent?.announcement ||
          "🌍 2026-2027 WORLD EXPEDITIONS NOW OPEN • SAVE UP TO ₹25,000 PER COUPLE ON EARLY BOOKINGS"
        }
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Explorer Visual */}
          <div className="absolute inset-0 z-0">
            <img
              src={
                customization.heroBanner ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&auto=format&fit=crop&q=85"
              }
              alt="World Wanderlust Explorer"
              className="w-full h-full object-cover object-center scale-105 transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-900/30" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
            {/* Super Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-400/30 mb-6">
              <Compass size={14} className="text-sky-300 animate-spin-slow" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-200">
                Award-Winning Luxury Travel Agency & Tour Operator
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto drop-shadow-lg">
              {customization.heroHeadline ||
                "Curated Expeditions for the Modern Explorer."}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-200/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              {customization.heroSubtitle ||
                "Bespoke international itineraries, scenic luxury rail journeys, private guided small-group tours, and seamless visa concierge across 85+ countries."}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleBook()}
                className="px-8 py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition duration-200 cursor-pointer flex items-center gap-2"
              >
                <Plane size={15} />
                <span>Enquire Tour Package</span>
              </button>
              <a
                href="#packages"
                className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-widest rounded-2xl backdrop-blur-md border border-white/30 transition cursor-pointer"
              >
                Explore Itineraries
              </a>
            </div>
          </div>
        </section>

        {/* EXPEDITION SEARCH FILTER BAR */}
        <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Destination */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin size={11} className="text-[#0284C7]" /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-sky-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-[#0284C7] outline-none transition cursor-pointer"
              >
                <option>Europe & Switzerland</option>
                <option>Bali & Komodo Islands</option>
                <option>Japan & Mount Fuji</option>
                <option>Iceland & Northern Lights</option>
                <option>Dubai & Abu Dhabi</option>
                <option>Kenya Wildlife Safari</option>
              </select>
            </div>

            {/* Travel Month */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar size={11} className="text-[#0284C7]" /> Travel Window
              </label>
              <select
                value={travelMonth}
                onChange={(e) => setTravelMonth(e.target.value)}
                className="w-full bg-sky-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-[#0284C7] outline-none transition cursor-pointer"
              >
                <option>September 2026</option>
                <option>October 2026</option>
                <option>November 2026</option>
                <option>December 2026 (Festive)</option>
                <option>Spring / Summer 2027</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Clock size={11} className="text-[#0284C7]" /> Trip Length
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-sky-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-[#0284C7] outline-none transition cursor-pointer"
              >
                <option>5 - 7 Days (Short Getaway)</option>
                <option>7 - 10 Days (Popular)</option>
                <option>10 - 14 Days (Grand Tour)</option>
                <option>15+ Days (Grand Expedition)</option>
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles size={11} className="text-[#0284C7]" /> Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full bg-sky-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-[#0284C7] outline-none transition cursor-pointer"
              >
                <option>Luxury Small Group</option>
                <option>Romantic Honeymoon</option>
                <option>Family Escapade</option>
                <option>Adventure & Hiking</option>
              </select>
            </div>

            {/* Action */}
            <div>
              <button
                onClick={() => handleBook()}
                className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Find Expeditions</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* HANDCRAFTED PACKAGES SECTION */}
        <section id="packages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0284C7] block mb-2">
              Signature Worldwide Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated Itineraries & Holiday Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
              Every tour includes handpicked boutique luxury stays, private scenic transfers, certified local guides, and daily breakfast.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: "all", label: "All Worldwide Packages" },
                { id: "europe", label: "Europe & Alps" },
                { id: "asia", label: "Asia & Islands" },
                { id: "nordic", label: "Nordic & Auroras" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveTourFilter(pill.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeTourFilter === pill.id
                      ? "bg-[#0284C7] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((tour) => (
              <div
                key={tour._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={tour.image}
                      alt={tour.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border border-white/40">
                        {tour.duration || "7 Days / 6 Nights"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1.5 rounded-xl text-sm font-black bg-slate-900/90 text-white backdrop-blur-md shadow-md">
                        ₹{Number(tour.price).toLocaleString("en-IN")}
                        <span className="text-[10px] font-normal text-slate-300 ml-1">
                          / person
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                        {tour.category || "International Expedition"}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition mt-2">
                        {tour.serviceName}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                      {tour.description}
                    </p>

                    {/* Inclusions Strip */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Plane size={13} className="text-[#0284C7]" /> Flights Included
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star size={13} className="text-[#0284C7]" /> 4★ & 5★ Boutique Stays
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={13} className="text-[#0284C7]" /> Private Guide
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Ticket size={13} className="text-[#0284C7]" /> Visa Assistance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleBook(tour)}
                    className="w-full py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Tour Package</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE TRAVEL AGENCY ADVANTAGE */}
        <section className="py-20 bg-sky-50/50 border-y border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0284C7] block mb-2">
                Why Travel With Us
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                The Luxury Wanderlust Difference
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-2">
                We design seamless, transformative journeys backed by 24/7 concierge and verified credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agencyPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                      {pillar.badge}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRAVELER TESTIMONIALS & TRUST */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  "Our 10-day Switzerland rail journey was effortless from the moment we landed."
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Every hotel transfer was punctual, our private guide was deeply knowledgeable, and having a dedicated coordinator gave us complete confidence.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-[#0284C7] flex items-center justify-center font-bold text-white text-sm">
                    SK
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Sameer & Kavita Roy</h5>
                    <p className="text-[10px] text-slate-400">Mumbai, India • Swiss Alps Expedition</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-sky-400 block">
                    12,500+
                  </span>
                  <p className="text-xs text-slate-200 font-semibold mt-1">
                    Happy Global Travelers
                  </p>
                  <span className="text-[10px] text-slate-400">Across 85+ world destinations</span>
                </div>
                <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-amber-400 block">
                    4.96 / 5
                  </span>
                  <p className="text-xs text-slate-200 font-semibold mt-1">
                    Verified Customer Rating
                  </p>
                  <span className="text-[10px] text-slate-400">On Trustpilot & Google Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Booking / Tour Inquiry Modal */}
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
