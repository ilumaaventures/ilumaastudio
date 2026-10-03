import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getShops } from "../../../api/publicService";
import { StoreGridSkeleton } from "../../../Components/Skeletons";

const DEFAULT_SERVICE_COVERS = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
];

const ACCENT_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-emerald-600 to-teal-700",
  "from-violet-600 to-indigo-700",
  "from-orange-500 to-red-600",
  "from-cyan-600 to-blue-700",
];

function ServiceProviderSkeleton() {
  return (
    <div className="min-w-[315px] max-w-[315px] snap-start rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-sm animate-pulse space-y-4">
      <div className="h-36 bg-slate-100 rounded-2xl w-full" />
      <div className="space-y-2 pt-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-full" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-full pt-4" />
    </div>
  );
}

function BusinessCard({ provider, index }) {
  const coverImage =
    provider.cover ||
    provider.banner ||
    provider.heroBanner ||
    DEFAULT_SERVICE_COVERS[index % DEFAULT_SERVICE_COVERS.length];

  const accentGradient = ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];

  const businessName =
    provider.businessName || provider.tradeName || "Service Provider";

  const categoryName =
    (typeof provider.businessCategory === "object"
      ? provider.businessCategory?.name
      : provider.businessCategory) ||
    (typeof provider.businessType === "object"
      ? provider.businessType?.name
      : provider.businessType) ||
    "Professional Services";

  const tagline =
    provider.description ||
    provider.tagline ||
    "High quality professional and on-demand services.";

  const location =
    provider.location ||
    [provider.address?.city, provider.address?.state]
      .filter(Boolean)
      .join(", ") ||
    "Verified Location";

  const shopSlug =
    provider.slugName ||
    (typeof provider.slug === "object"
      ? provider.slug?.slugName
      : provider.slug) ||
    provider.businessSlug ||
    provider.subdomain ||
    provider._id;

  const isCustomDomain =
    provider.slugType === "domain" && provider.customDomain;
  const storeUrl = isCustomDomain
    ? `https://${provider.customDomain}`
    : `/store/${shopSlug}`;

  const servicesUrl = `/services?businessId=${provider._id}`;

  return (
    <article
      className="
        group relative
        min-w-[315px] max-w-[315px]
        snap-start
        overflow-hidden
        rounded-[26px]
        border border-slate-200/80
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-blue-200
        hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]
        flex flex-col justify-between
      "
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-[145px] overflow-hidden">
          <img
            src={coverImage}
            alt={`${businessName} cover`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

          {/* Business Label */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-blue-400" />
            Service
          </div>

          {/* Verified Badge */}
          <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-md">
            <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
            Verified
          </div>

          {/* Bottom Cover Title */}
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Featured Provider
            </p>
            <h3 className="mt-0.5 text-base font-bold text-white truncate">
              {businessName}
            </h3>
          </div>
        </div>

        {/* Logo Avatar */}
        <div className="relative px-5">
          <div className="absolute -top-9 left-5 flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={`${businessName} logo`}
                className="h-full w-full object-contain p-1.5"
                loading="lazy"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${accentGradient} text-xl font-black text-white`}
              >
                {(businessName[0] || "S").toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-11">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-950 transition-colors group-hover:text-blue-600 line-clamp-1">
              {businessName}
            </h3>
            <p className="mt-1 text-xs font-semibold text-blue-600 truncate">
              {categoryName}
            </p>
          </div>

          <p className="mt-2.5 min-h-[40px] line-clamp-2 text-xs leading-5 text-slate-500">
            {tagline}
          </p>

          {location && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer CTAs */}
      <div className="p-5 pt-0 pb-5">
        <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
          <Link
            to={servicesUrl}
            className="
              inline-flex items-center justify-center gap-1
              rounded-xl bg-blue-50 px-3 py-2
              text-xs font-bold text-blue-600
              hover:bg-blue-100 transition-colors
            "
          >
            <span>Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* <Link
            to={storeUrl}
            className="
              inline-flex items-center justify-center gap-1
              rounded-xl bg-slate-950 px-3 py-2
              text-xs font-bold text-white
              hover:bg-blue-600 transition-colors
            "
          >
            <span>Storefront</span>
            <ExternalLink className="h-3 w-3" />
          </Link> */}
        </div>
      </div>
    </article>
  );
}

function FeaturedBusinesses() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await getShops({
        isFeatured: true,
        businessCategory: "SERVICE",
        anySlugType: true,
      });

      const shopsData = response?.data ?? response;
      const shops = Array.isArray(shopsData)
        ? shopsData
        : shopsData?.data || [];

      // Strictly only show businesses marked as isFeatured: true AND category is service / services
      const featuredServicesOnly = shops.filter((s) => {
        if (!s.isFeatured) return false;
        const catCode =
          (typeof s.businessCategory === "object"
            ? s.businessCategory?.code
            : ""
          )?.toUpperCase() || "";
        const catName =
          (typeof s.businessCategory === "object"
            ? s.businessCategory?.name
            : String(s.businessCategory || "")
          )?.toLowerCase() || "";
        const isService =
          catCode === "SERVICE" ||
          catCode === "SERVICES" ||
          catName.includes("service");
        return isService;
      });

      setProviders(featuredServicesOnly);
    } catch (error) {
      console.error(
        "Failed to fetch featured service providers:",
        error?.response?.data || error?.message || error,
      );
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Top Rated Service Providers
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Explore verified service providers and agencies connected through
              the ILUMAA ecosystem.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Link
              to="/store"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
            >
              <span>View All</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Business Cards / Loading / Fallback */}
        <div className="relative">
          {loading ? (
            <div className="flex gap-5 overflow-x-auto pb-4">
              <ServiceProviderSkeleton />
              <ServiceProviderSkeleton />
              <ServiceProviderSkeleton />
            </div>
          ) : providers.length > 0 ? (
            <div
              ref={scrollRef}
              className="
                flex
                gap-5
                overflow-x-auto
                pb-4
                snap-x
                snap-mandatory
                scroll-smooth
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {providers.map((provider, index) => (
                <BusinessCard
                  key={provider._id || index}
                  provider={provider}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              <p className="text-sm font-medium">
                No featured service providers found at the moment.
              </p>
              <Link
                to="/services"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                <span>Browse all available services</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            to="/services"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-2.5
              text-xs
              font-bold
              text-slate-800
              shadow-2xs
              transition
              hover:border-blue-200
              hover:text-blue-600
            "
          >
            <span>Explore All Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBusinesses;
