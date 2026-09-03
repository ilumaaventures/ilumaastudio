import React, { useState } from "react";
import { Dumbbell, Flame, Trophy, Calendar, ArrowRight } from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function IronPulseFitnessTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const themeColors = customization.colors || {
    primary: "#DC2626",
    secondary: "#EF4444",
    accent: "#F97316",
    background: "#18181B",
    cardBg: "#27272A",
    text: "#FAFAFA",
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
          "🔥 CLAIM YOUR 7-DAY ALL-ACCESS PASS • COMPLIMENTARY 3D BODY COMPOSITION SCAN"
        }
      />

      <main className="flex-1">
        <section className="py-20 md:py-28 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                High-Performance Training & Hypertrophy
              </span>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                {customization.heroHeadline || "Forge Unstoppable Strength & Grit."}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                {customization.heroSubtitle ||
                  "Olympic lifting platforms, high-octane functional Hyrox conditioning, infrared muscle recovery, and elite personalized programming."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleBook()}
                  className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Claim Your Free Trial Pass</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                <img
                  src={
                    customization.heroBanner ||
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80"
                  }
                  alt="Gym Workout"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section id="services" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black uppercase tracking-wider text-white text-center mb-10">
              Training Programs & Coaching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-red-600/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-950">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
                        {srv.duration || "Program"}
                      </span>
                      <span className="text-lg font-black text-white">
                        ₹{Number(srv.price).toFixed(2)}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBook(srv)}
                    className="w-full mt-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    Start Training
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
