import React, { useState } from "react";
import { Wrench, ShieldCheck, Clock, CheckCircle2, Phone } from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function HomeServiceProTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const themeColors = customization.colors || {
    primary: "#0284C7",
    secondary: "#38BDF8",
    accent: "#E11D48",
    background: "#F0F9FF",
    cardBg: "#FFFFFF",
    text: "#082F49",
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
          "🛠️ 24/7 Emergency Dispatch • 100% Licensed & Insured • Zero Travel Surcharges"
        }
      />

      <main className="flex-1">
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Same-Day Certified Dispatch
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-sky-950 leading-tight">
                {customization.heroHeadline || "Expert Repairs Done Right the First Time."}
              </h1>
              <p className="text-xs sm:text-sm text-sky-900/80 leading-relaxed max-w-lg">
                {customization.heroSubtitle ||
                  "Master certified plumbers, electricians, and HVAC professionals providing upfront flat-rate pricing and satisfaction guarantees."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => handleBook()}
                  className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl shadow-lg transition cursor-pointer"
                >
                  Book Service Call Now
                </button>
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="px-6 py-4 bg-white border border-sky-200 text-sky-900 font-bold text-xs rounded-2xl shadow-xs hover:bg-sky-50 transition flex items-center gap-2"
                  >
                    <Phone size={14} className="text-sky-600" />
                    <span>Emergency Call</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={
                    customization.heroBanner ||
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&auto=format&fit=crop&q=80"
                  }
                  alt="Home Repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16 bg-white border-y border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-sky-950 mb-10 text-center">
              Licensed & Insured Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className="p-6 rounded-3xl bg-sky-50/40 border border-sky-100 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-16/10 rounded-2xl overflow-hidden">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {srv.badge || "Flat Rate Pricing"}
                    </span>
                    <h4 className="text-base font-bold text-sky-950">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-sky-900/70 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-sky-100 flex items-center justify-between mt-4">
                    <span className="text-base font-black text-sky-950">
                      From ₹{Number(srv.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleBook(srv)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Schedule Call
                    </button>
                  </div>
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
