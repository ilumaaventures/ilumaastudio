import React, { useState, useEffect } from "react";
import { MapPin, Sparkles, Trophy, GraduationCap, Zap } from "lucide-react";
import { getServices } from "../../api/serviceService";
import { ServiceGridSkeleton } from "../../Components/Skeletons";

// Modular Section Components
import ServiceHeroHeader from "./sections/ServiceHeroHeader";
import ServiceSection from "./sections/ServiceSection";
import ServicePromoBanner from "./sections/ServicePromoBanner";
import ServiceEmptyState from "./sections/ServiceEmptyState";
import FeaturedServiceCategory from "./FeaturedServiceCategory";
import NearbyRestaurants from "./NearbyRestaurants";
import PopularServices from "./PopularServices";

export default function ServiceListing() {
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        setLoading(true);
        const res = await getServices({ limit: 50 });
        const list = Array.isArray(res)
          ? res
          : res?.services || res?.data || [];

        if (list.length > 0) {
          const formatted = list.map((s, idx) => ({
            _id: s._id || `s_${idx}`,
            id: s._id || idx + 1,
            name: s.name || s.title || "Doorstep Service",
            category:
              typeof s.category === "object"
                ? s.category?.name || "Home Care"
                : s.category || "Home Care",
            price: Number(s.pricing?.amount || s.price) || 0,
            rating: s.rating || 4.8,
            reviews: s.reviewsCount || 0,
            bookings: s.bookingsCount || 0,
            duration: s.duration || "45 mins",
            location: s.location || "Lucknow",
            image:
              s.thumbnail ||
              s.images?.[0] ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
            badge:
              idx % 3 === 0
                ? "Popular"
                : idx % 3 === 1
                  ? "Premium"
                  : "Recently Added",
          }));
          setServiceList(formatted);
        } else {
          setServiceList([]);
        }
      } catch (err) {
        console.error("Services listing fetch error:", err);
        setServiceList([]);
      } finally {
        setLoading(false);
      }
    };
    loadServicesData();
  }, []);

  const nearbyServices = serviceList.slice(0, 5);
  const recentlyAddedServices = [...serviceList].reverse().slice(0, 5);
  const premiumServices = serviceList.filter(
    (s) => s.price >= 500 || s.badge === "Premium"
  );
  const playingServices = serviceList.filter(
    (s) =>
      (s.category || "").toLowerCase().includes("play") ||
      (s.name || "").toLowerCase().includes("fitness") ||
      (s.name || "").toLowerCase().includes("sport") ||
      (s.name || "").toLowerCase().includes("coach")
  );
  const teachingServices = serviceList.filter(
    (s) =>
      (s.category || "").toLowerCase().includes("teach") ||
      (s.name || "").toLowerCase().includes("tutor") ||
      (s.name || "").toLowerCase().includes("music") ||
      (s.name || "").toLowerCase().includes("lesson")
  );

  return (
    <section className="w-full py-10 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Modular Hero Header */}
        <ServiceHeroHeader />

        {loading ? (
          <ServiceGridSkeleton count={4} />
        ) : serviceList.length === 0 ? (
          <ServiceEmptyState />
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
            <ServicePromoBanner
              badge="Special Offer"
              title="Get ₹200 OFF on First Home Cleaning or AC Service!"
              description="Use coupon code STUDIOHOME at checkout. Valid on all verified doorstep appointments."
              couponCode="STUDIOHOME"
              ctaText="Claim Offer"
              ctaLink="/services"
              bgGradient="from-blue-900 via-indigo-900 to-slate-900"
            />

            <FeaturedServiceCategory />

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
              services={playingServices}
              icon={<Trophy size={22} className="text-emerald-500" />}
            />

            <NearbyRestaurants />

            {/* Promo Banner 2 */}
            <ServicePromoBanner
              badge="Personalized Learning & Sports"
              title="Book Experienced Tutors & Sports Trainers at Doorstep"
              description="Verified 1-on-1 private tutoring, music lessons, and fitness coaching tailored to your schedule."
              couponCode=""
              ctaText="Explore Trainers"
              ctaLink="/services"
              bgGradient="from-amber-600 via-orange-600 to-rose-600"
            />

            {/* Section 4: Teaching & Tutoring */}
            <ServiceSection
              title="Teaching & Tutoring"
              subtitle="Home tutors for Academics, Languages & Music Lessons"
              services={teachingServices}
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

            <PopularServices />
          </>
        )}
      </div>
    </section>
  );
}
