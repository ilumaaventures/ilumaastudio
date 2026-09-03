import React, { useState } from "react";
import { Sparkles, Clock, Calendar, Star, ArrowRight, ShieldCheck } from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function ZenSpaTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const themeColors = customization.colors || {
    primary: "#0D9488",
    secondary: "#14B8A6",
    accent: "#2DD4BF",
    background: "#F0FDFA",
    cardBg: "#FFFFFF",
    text: "#134E4A",
  };

  const handleBook = (srv = null) => {
    setSelectedService(srv);
    setBookingOpen(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      <TemplateHeader
        business={business}
        onOpenBooking={() => handleBook()}
        isService={true}
        themeColors={themeColors}
        announcementText={
          customization.customContent?.announcement ||
          "🌿 Complimentary Herbal Foot Soak & Aromatherapy Bar with all 90-Min Sessions"
        }
      />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
                Holistic Sanctuary & Atelier
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-teal-950 leading-tight">
                {customization.heroHeadline || "Restore Your Mind, Body & Vitality."}
              </h1>
              <p className="text-xs sm:text-sm text-teal-900/80 leading-relaxed max-w-lg">
                {customization.heroSubtitle ||
                  "Himalayan heated stone therapies, bespoke clinical oxygen facials, and Japanese waterfall scalp rituals tailored to dissolve stress."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleBook()}
                  className="px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Reserve Treatment Session</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={
                    customization.heroBanner ||
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&auto=format&fit=crop&q=80"
                  }
                  alt="Spa Treatment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-16 bg-white border-y border-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-3xl font-serif font-black text-teal-950 mb-2">
                Signature Wellness Rituals
              </h2>
              <p className="text-xs text-teal-800/70">
                Performed by licensed master aestheticians and massage therapists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className="p-6 rounded-3xl bg-teal-50/40 border border-teal-100 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="aspect-16/10 rounded-2xl overflow-hidden">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        {srv.duration || "Session"}
                      </span>
                      <span className="text-lg font-serif font-black text-teal-900">
                        ₹{Number(srv.price).toFixed(2)}
                      </span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-teal-950">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-teal-900/70 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBook(srv)}
                    className="w-full mt-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Book This Ritual
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
