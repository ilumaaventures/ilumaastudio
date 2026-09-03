import React, { useState } from "react";
import {
  Utensils,
  Wine,
  Calendar,
  Clock,
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import TemplateHeader from "../../common/TemplateHeader";
import TemplateFooter from "../../common/TemplateFooter";
import BookingModal from "../../common/BookingModal";
import ServicesCatalogPage from "../../common/ServicesCatalogPage";
import PricingPackagesPage from "../../common/PricingPackagesPage";
import AboutPage from "../../common/AboutPage";
import ContactPage from "../../common/ContactPage";

export default function FoodieBistroTemplate({
  business = {},
  services = [],
  categories = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "services" | "pricing" | "about" | "contact"
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const themeColors = customization.colors || {
    primary: "#EA580C",
    secondary: "#C2410C",
    accent: "#F59E0B",
    background: "#FFF7ED",
    cardBg: "#FFFFFF",
    text: "#431407",
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookTable = (service = null) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  const filteredDishes =
    activeCategory === "all"
      ? services
      : services.filter(
          (s) =>
            (s.category || "").toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      <TemplateHeader
        business={business}
        onOpenBooking={() => handleBookTable()}
        isService={true}
        themeColors={themeColors}
        announcementText={
          customization.customContent?.announcement ||
          "🍷 Michelin-Star Inspired Tasting Menus • Reserve Your Weekend Table"
        }
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* ================= PAGE 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    <Flame size={14} className="text-orange-600" />
                    <span>Artisanal Woodfire & Seasonal Harvest</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-orange-950 leading-tight">
                    {customization.heroHeadline || "Culinary Passion on Every Plate."}
                  </h1>

                  <p className="text-xs sm:text-sm text-orange-950/80 leading-relaxed max-w-xl font-normal">
                    {customization.heroSubtitle ||
                      "Farm-fresh locally sourced ingredients, handcrafted pasta, aged steaks, and artisanal cocktails prepared by master chefs."}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => handleBookTable()}
                      className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar size={16} />
                      <span>Reserve a Table</span>
                    </button>
                    <button
                      onClick={() => handleNavigate("services")}
                      className="px-6 py-4 bg-white border border-orange-200 text-orange-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xs hover:bg-orange-50 transition cursor-pointer"
                    >
                      Explore Menu
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={
                        customization.heroBanner ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80"
                      }
                      alt="Bistro Interior"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Chef Highlights */}
            <section className="py-16 bg-white border-y border-orange-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Signature Dishes
                    </span>
                    <h2 className="text-3xl font-black text-orange-950">
                      Chef's Tasting Menu
                    </h2>
                  </div>
                  <button
                    onClick={() => handleNavigate("services")}
                    className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Complete Menu</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDishes.slice(0, 6).map((dish) => (
                    <div
                      key={dish._id}
                      className="p-5 rounded-3xl bg-orange-50/50 border border-orange-100/80 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="aspect-16/10 rounded-2xl overflow-hidden bg-orange-100">
                          <img
                            src={dish.image}
                            alt={dish.serviceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-base font-bold text-orange-950">
                            {dish.serviceName}
                          </h4>
                          <span className="text-sm font-black text-orange-600">
                            ₹{Number(dish.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-orange-950/70 leading-relaxed line-clamp-2">
                          {dish.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleBookTable(dish)}
                        className="w-full mt-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Reserve Table for This Dish
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= PAGE 2: SERVICES & MENU ================= */}
        {activePage === "services" && (
          <ServicesCatalogPage
            services={services}
            onOpenBooking={handleBookTable}
            themeColors={themeColors}
            business={business}
          />
        )}

        {/* ================= PAGE 3: PRICING & PACKAGES ================= */}
        {activePage === "pricing" && (
          <PricingPackagesPage
            onOpenBooking={handleBookTable}
            themeColors={themeColors}
            business={business}
          />
        )}

        {/* ================= PAGE 4: ABOUT US ================= */}
        {activePage === "about" && (
          <AboutPage
            business={business}
            themeColors={themeColors}
            onNavigate={handleNavigate}
            isService={true}
          />
        )}

        {/* ================= PAGE 5: CONTACT & HOURS ================= */}
        {activePage === "contact" && (
          <ContactPage
            business={business}
            themeColors={themeColors}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        service={selectedService}
        business={business}
        themeColors={themeColors}
      />

      {/* Footer */}
      <TemplateFooter
        business={business}
        themeColors={themeColors}
        isService={true}
      />
    </div>
  );
}
