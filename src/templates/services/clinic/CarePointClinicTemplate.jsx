import React, { useState } from "react";
import { Activity, ShieldCheck, Calendar, Clock, Phone, Stethoscope } from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function CarePointClinicTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const themeColors = customization.colors || {
    primary: "#059669",
    secondary: "#10B981",
    accent: "#34D399",
    background: "#ECFDF5",
    cardBg: "#FFFFFF",
    text: "#064E3B",
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
          "🩺 Same-Day In-Person & Telehealth Appointments Available • Most Major Insurances Accepted"
        }
      />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Stethoscope size={14} />
                <span>Compassionate Physician-Led Medicine</span>
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-emerald-950 leading-tight">
                {customization.heroHeadline || "Comprehensive Family Care & Longevity."}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed max-w-lg">
                {customization.heroSubtitle ||
                  "Preventative primary medical care, advanced biometric screenings, and secure telehealth consultations by board-certified physicians."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => handleBook()}
                  className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Request Doctor Consultation</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={
                    customization.heroBanner ||
                    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&auto=format&fit=crop&q=80"
                  }
                  alt="Doctor with patient"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Services */}
        <section id="services" className="py-16 bg-white border-y border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-emerald-950 mb-10 text-center">
              Clinical Specializations & Diagnostics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className="p-6 rounded-3xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-16/10 rounded-2xl overflow-hidden">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {srv.badge || "Clinical Service"}
                    </span>
                    <h4 className="text-base font-bold text-emerald-950">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-emerald-900/70 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-emerald-100 flex items-center justify-between mt-4">
                    <span className="text-base font-black text-emerald-950">
                      ₹{Number(srv.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleBook(srv)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Book Consultation
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
