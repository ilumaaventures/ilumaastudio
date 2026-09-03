import React, { useState } from "react";
import { GraduationCap, BookOpen, Award, CheckCircle2, ArrowRight } from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";

export default function TutorAcademyTemplate({
  business = {},
  services = [],
  reviews = [],
  customization = {},
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const themeColors = customization.colors || {
    primary: "#4338CA",
    secondary: "#6366F1",
    accent: "#F59E0B",
    background: "#EEF2FF",
    cardBg: "#FFFFFF",
    text: "#1E1B4B",
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
          "🎓 98% of our students gain admission to their top-3 choice universities • Schedule a Free Diagnostic Session"
        }
      />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                Ivy League & Stanford Faculty Mentorship
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-indigo-950 leading-tight">
                {customization.heroHeadline || "Unlocking Top 1% Academic Potential."}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed max-w-lg">
                {customization.heroSubtitle ||
                  "Personalized 1-on-1 SAT/ACT prep, AP Calculus mastery, and Ivy League admissions coaching tailored to your learning pace."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleBook()}
                  className="px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-2xl shadow-lg transition cursor-pointer"
                >
                  Schedule Free Diagnostic Session
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={
                    customization.heroBanner ||
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80"
                  }
                  alt="Tutoring Session"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses / Subjects */}
        <section id="services" className="py-16 bg-white border-y border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-indigo-950 mb-10 text-center">
              Curriculum & Coaching Tracks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className="p-6 rounded-3xl bg-indigo-50/40 border border-indigo-100 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-16/10 rounded-2xl overflow-hidden">
                      <img
                        src={srv.image}
                        alt={srv.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {srv.badge || "Guaranteed Results"}
                    </span>
                    <h4 className="text-base font-bold text-indigo-950">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-indigo-900/70 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-indigo-100 flex items-center justify-between mt-4">
                    <span className="text-base font-black text-indigo-950">
                      ₹{Number(srv.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleBook(srv)}
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Enroll / Book
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
