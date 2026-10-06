import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  Wrench,
  Sparkles,
  HeartPulse,
  Laptop,
  GraduationCap,
  Landmark,
  TrendingUp,
  HardHat,
  PartyPopper,
  UtensilsCrossed,
  Truck,
  Car,
  Plane,
  ShieldCheck,
  Store,
  BadgeCheck,
  Boxes,
} from "lucide-react";
import { BASE_URL } from "../../../api/baseApi";

/* =========================================================
   CURATED HIGH-RESOLUTION FALLBACK IMAGERY
   Used ONLY if backend doesn't have an image uploaded
========================================================= */
const FALLBACK_IMAGES = {
  realEstate:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  finance:
    "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=85",
  office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
  tech:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
  marketing:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  health:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
  education:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85",
  security:
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=85",
  astrology:
    "https://images.unsplash.com/photo-1532968961962-8a0c9625a0a8?auto=format&fit=crop&w=1200&q=85",
  travel:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
  events:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
  food:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
  automotive:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
  home:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85",
  professional:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
};

/* =========================================================
   CATEGORY NAME RESOLVER
========================================================= */
const getCategoryName = (category) => {
  return (
    category?.name ||
    category?.title ||
    category?.categoryName ||
    "Professional Category"
  );
};

/* =========================================================
   CATEGORY IMAGE RESOLVER
   Priority 1: Real backend image (Cloudinary / URL / uploaded)
   Priority 2: Matched high-res professional visual fallback
========================================================= */
const getCategoryImage = (category) => {
  const rawImage =
    category?.image ||
    category?.banner ||
    category?.coverImage ||
    category?.thumbnail ||
    category?.imageUrl;

  if (rawImage && typeof rawImage === "string" && rawImage.trim() !== "") {
    const trimmed = rawImage.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:")
    ) {
      return trimmed;
    }
    return `${BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  }

  const name = getCategoryName(category).toLowerCase();
  if (
    name.includes("real estate") ||
    name.includes("property") ||
    name.includes("construction")
  ) {
    return FALLBACK_IMAGES.realEstate;
  }
  if (
    name.includes("finance") ||
    name.includes("investment") ||
    name.includes("bank") ||
    name.includes("tax")
  ) {
    return FALLBACK_IMAGES.finance;
  }
  if (name.includes("office") || name.includes("work")) {
    return FALLBACK_IMAGES.office;
  }
  if (
    name.includes("it") ||
    name.includes("tech") ||
    name.includes("software") ||
    name.includes("digital service")
  ) {
    return FALLBACK_IMAGES.tech;
  }
  if (
    name.includes("marketing") ||
    name.includes("brand") ||
    name.includes("advertis")
  ) {
    return FALLBACK_IMAGES.marketing;
  }
  if (
    name.includes("health") ||
    name.includes("medical") ||
    name.includes("pharma") ||
    name.includes("wellness")
  ) {
    return FALLBACK_IMAGES.health;
  }
  if (
    name.includes("education") ||
    name.includes("training") ||
    name.includes("school") ||
    name.includes("course")
  ) {
    return FALLBACK_IMAGES.education;
  }
  if (name.includes("security") || name.includes("facility")) {
    return FALLBACK_IMAGES.security;
  }
  if (
    name.includes("astro") ||
    name.includes("spiritual") ||
    name.includes("puja")
  ) {
    return FALLBACK_IMAGES.astrology;
  }
  if (name.includes("travel") || name.includes("tour")) {
    return FALLBACK_IMAGES.travel;
  }
  if (
    name.includes("event") ||
    name.includes("party") ||
    name.includes("wedding")
  ) {
    return FALLBACK_IMAGES.events;
  }
  if (
    name.includes("food") ||
    name.includes("restaurant") ||
    name.includes("hospitality")
  ) {
    return FALLBACK_IMAGES.food;
  }
  if (
    name.includes("auto") ||
    name.includes("car") ||
    name.includes("vehicle")
  ) {
    return FALLBACK_IMAGES.automotive;
  }
  if (
    name.includes("home") ||
    name.includes("repair") ||
    name.includes("maintenance")
  ) {
    return FALLBACK_IMAGES.home;
  }

  return FALLBACK_IMAGES.professional;
};

/* =========================================================
   CATEGORY ICON RESOLVER
   Priority 1: Backend uploaded icon (URL/image)
   Priority 2: Contextual Lucide icon
========================================================= */
const getCategoryIcon = (category) => {
  const iconVal = category?.icon;

  if (
    iconVal &&
    typeof iconVal === "string" &&
    (iconVal.startsWith("http://") ||
      iconVal.startsWith("https://") ||
      iconVal.startsWith("/") ||
      iconVal.startsWith("data:"))
  ) {
    const iconSrc =
      iconVal.startsWith("http://") ||
      iconVal.startsWith("https://") ||
      iconVal.startsWith("data:")
        ? iconVal
        : `${BASE_URL}/${iconVal.replace(/^\/+/, "")}`;
    return (
      <img
        src={iconSrc}
        alt={category.name || "Icon"}
        className="w-5 h-5 object-contain rounded"
      />
    );
  }

  const name = getCategoryName(category).toLowerCase();
  const iconStr = typeof iconVal === "string" ? iconVal.toLowerCase() : "";

  if (iconStr.includes("box") || iconStr.includes("package")) {
    return <Boxes size={20} strokeWidth={2} />;
  }
  if (name.includes("real estate") || name.includes("property")) {
    return <Building2 size={20} strokeWidth={2} />;
  }
  if (
    name.includes("finance") ||
    name.includes("investment") ||
    name.includes("bank")
  ) {
    return <Landmark size={20} strokeWidth={2} />;
  }
  if (name.includes("security") || name.includes("facility")) {
    return <ShieldCheck size={20} strokeWidth={2} />;
  }
  if (name.includes("astro") || name.includes("spiritual")) {
    return <Sparkles size={20} strokeWidth={2} />;
  }
  if (
    name.includes("health") ||
    name.includes("medical") ||
    name.includes("pharma")
  ) {
    return <HeartPulse size={20} strokeWidth={2} />;
  }
  if (
    name.includes("education") ||
    name.includes("training") ||
    name.includes("school")
  ) {
    return <GraduationCap size={20} strokeWidth={2} />;
  }
  if (name.includes("office") || name.includes("work")) {
    return <Building2 size={20} strokeWidth={2} />;
  }
  if (
    name.includes("it") ||
    name.includes("tech") ||
    name.includes("software")
  ) {
    return <Laptop size={20} strokeWidth={2} />;
  }
  if (
    name.includes("marketing") ||
    name.includes("brand") ||
    name.includes("advertis")
  ) {
    return <TrendingUp size={20} strokeWidth={2} />;
  }
  if (name.includes("event") || name.includes("wedding")) {
    return <PartyPopper size={20} strokeWidth={2} />;
  }
  if (name.includes("food") || name.includes("restaurant")) {
    return <UtensilsCrossed size={20} strokeWidth={2} />;
  }
  if (name.includes("auto") || name.includes("car")) {
    return <Car size={20} strokeWidth={2} />;
  }
  if (name.includes("home") || name.includes("repair")) {
    return <Wrench size={20} strokeWidth={2} />;
  }
  if (name.includes("logistics") || name.includes("transport")) {
    return <Truck size={20} strokeWidth={2} />;
  }
  if (name.includes("travel") || name.includes("tour")) {
    return <Plane size={20} strokeWidth={2} />;
  }
  if (name.includes("construction")) {
    return <HardHat size={20} strokeWidth={2} />;
  }
  if (
    name.includes("business") ||
    name.includes("corporate") ||
    name.includes("professional")
  ) {
    return <Briefcase size={20} strokeWidth={2} />;
  }

  return <Store size={20} strokeWidth={2} />;
};

/* =========================================================
   CATEGORY DESCRIPTION RESOLVER
   Priority 1: Backend category description
   Priority 2: Contextual, polished domain description
========================================================= */
const getCategoryDescription = (category, sectionType = "services") => {
  if (category?.description && category.description.trim() !== "") {
    return category.description.trim();
  }
  if (category?.subtitle && category.subtitle.trim() !== "") {
    return category.subtitle.trim();
  }
  if (category?.shortDescription && category.shortDescription.trim() !== "") {
    return category.shortDescription.trim();
  }

  const name = getCategoryName(category).toLowerCase();

  if (name.includes("real estate") || name.includes("property")) {
    return "Residential, commercial spaces & verified property consultations.";
  }
  if (
    name.includes("marketing") ||
    name.includes("branding") ||
    name.includes("advertis")
  ) {
    return "Growth strategy, brand identity, digital marketing & creative media.";
  }
  if (
    name.includes("finance") ||
    name.includes("investment") ||
    name.includes("bank")
  ) {
    return "Wealth management, tax filing, accounting & financial planning.";
  }
  if (name.includes("office") || name.includes("work")) {
    return "Modern workspace setups, coworking facilities & corporate offices.";
  }
  if (
    name.includes("it") ||
    name.includes("tech") ||
    name.includes("digital service")
  ) {
    return "Custom software, cloud infrastructure & enterprise digital solutions.";
  }
  if (
    name.includes("health") ||
    name.includes("pharma") ||
    name.includes("medical")
  ) {
    return "Clinical healthcare, certified doctors & pharmaceutical provisions.";
  }
  if (
    name.includes("education") ||
    name.includes("training") ||
    name.includes("school")
  ) {
    return "Professional skill development, academic tutoring & certifications.";
  }
  if (
    name.includes("professional") ||
    name.includes("business") ||
    name.includes("corporate")
  ) {
    return sectionType === "business"
      ? "Enterprise service providers, consulting agencies & corporate partners."
      : "Verified professionals and consulting specialists for your needs.";
  }

  return sectionType === "business"
    ? "Explore verified business partners, suppliers, and industry solutions."
    : "Explore verified experts, certified consultations, and on-demand services.";
};

/* =========================================================
   AUTHENTIC SERVICE / BUSINESS CARD
========================================================= */
function ServiceCard({
  category,
  index,
  onClick,
  sectionType = "services",
  cardCtaText,
}) {
  const [imageError, setImageError] = useState(false);

  const name = getCategoryName(category);
  const description = getCategoryDescription(category, sectionType);
  const image = imageError
    ? FALLBACK_IMAGES.professional
    : getCategoryImage(category);

  // Authentically check if backend sent a real count
  const rawCount =
    category?.providerCount ??
    category?.serviceCount ??
    category?.itemCount ??
    category?.count ??
    category?.storeCount ??
    category?.productCount;

  const hasRealCount = typeof rawCount === "number" && rawCount > 0;

  // Sector or Type label
  const sectorLabel =
    category?.businessType ||
    category?.businessCategory?.name ||
    (sectionType === "business" ? "Business Sector" : "Verified Service");

  const ctaLabel =
    cardCtaText ||
    (sectionType === "business" ? "Explore Businesses" : "Explore Services");

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        relative
        flex-none
        w-[285px]
        sm:w-[315px]
        snap-start
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-white
        text-left
        shadow-[0_4px_20px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1.5
        hover:border-blue-300
        hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500/20
      "
    >
      {/* =================================================
          HERO IMAGE AREA
      ================================================= */}
      <div className="relative h-[240px] overflow-hidden bg-slate-900">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
          "
          onError={() => setImageError(true)}
        />

        {/* Ambient Dark Gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950/95
            via-slate-950/35
            to-slate-950/10
          "
        />

        {/* Top-Left Category Icon */}
        <div
          className="
            absolute
            left-4
            top-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-white/95
            text-blue-600
            shadow-md
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:bg-blue-600
            group-hover:text-white
          "
        >
          {getCategoryIcon(category)}
        </div>

        {/* Top-Right Badge: Real Count if available, otherwise 'Verified' */}
        {hasRealCount ? (
          <div
            className="
              absolute
              right-4
              top-4
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/20
              bg-slate-950/60
              px-3
              py-1.5
              text-white
              shadow-lg
              backdrop-blur-md
            "
          >
            <span className="text-[12px] font-bold leading-none">
              {rawCount}+
            </span>
            <span className="text-[9px] font-medium text-white/80 leading-none">
              {sectionType === "business" ? "Stores" : "Providers"}
            </span>
          </div>
        ) : (
          <div
            className="
              absolute
              right-4
              top-4
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/20
              bg-slate-950/50
              px-2.5
              py-1
              text-white
              shadow-lg
              backdrop-blur-md
            "
          >
            <BadgeCheck size={13} className="text-emerald-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-white/90">
              Verified
            </span>
          </div>
        )}

        {/* Content on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3
            className="
              text-[20px]
              sm:text-[22px]
              font-bold
              leading-[1.2]
              tracking-tight
              text-white
              drop-shadow-sm
            "
          >
            {name}
          </h3>

          <p
            className="
              mt-1.5
              line-clamp-2
              text-[11px]
              leading-relaxed
              text-white/80
            "
          >
            {description}
          </p>

          {/* Micro arrow icon */}
          <div
            className="
              absolute
              bottom-0
              right-0
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/15
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:bg-white
              group-hover:text-blue-600
            "
          >
            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            />
          </div>
        </div>
      </div>

      {/* =================================================
          BOTTOM ACTION BAR
      ================================================= */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100/90
          bg-white
          px-4
          py-3.5
        "
      >
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Sector
          </span>
          <span className="text-[11px] font-bold text-slate-800 truncate">
            {sectorLabel}
          </span>
        </div>

        <span
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            bg-blue-600
            px-3.5
            py-2
            text-[11px]
            font-bold
            text-white
            shadow-sm
            shadow-blue-600/20
            transition-all
            duration-300
            group-hover:gap-2
            group-hover:bg-blue-700
            group-hover:shadow-blue-600/30
          "
        >
          <span>{ctaLabel}</span>
          <ArrowRight
            size={12}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5
            "
          />
        </span>
      </div>

      {/* Hover bottom gradient line */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[2.5px]
          w-0
          bg-gradient-to-r
          from-blue-500
          to-indigo-500
          transition-all
          duration-500
          group-hover:w-full
        "
      />
    </button>
  );
}

/* =========================================================
   PREMIUM SKELETON PLACEHOLDER
========================================================= */
function ServiceSkeleton() {
  return (
    <div
      className="
        flex-none
        w-[285px]
        sm:w-[315px]
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-white
        shadow-sm
      "
    >
      {/* Image Skeleton */}
      <div className="relative h-[240px] bg-slate-100 animate-pulse overflow-hidden p-4 flex flex-col justify-between">
        {/* Top placeholders */}
        <div className="flex items-center justify-between">
          <div className="h-11 w-11 rounded-2xl bg-slate-200/80" />
          <div className="h-6 w-20 rounded-full bg-slate-200/80" />
        </div>

        {/* Bottom placeholders */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 rounded-lg bg-slate-200/90" />
          <div className="h-3.5 w-full rounded bg-slate-200/60" />
          <div className="h-3.5 w-2/3 rounded bg-slate-200/60" />
        </div>
      </div>

      {/* Bottom Bar Skeleton */}
      <div className="px-4 py-3.5 flex items-center justify-between border-t border-slate-100 bg-white animate-pulse">
        <div className="space-y-1">
          <div className="h-2 w-10 rounded bg-slate-200/60" />
          <div className="h-3.5 w-24 rounded bg-slate-200/80" />
        </div>
        <div className="h-8 w-28 rounded-xl bg-slate-200/80" />
      </div>
    </div>
  );
}

/* =========================================================
   TAILORED VIEW ALL CARD
========================================================= */
function ViewAllCard({
  viewAllText,
  onViewAll,
  linkUrl,
  sectionType = "services",
}) {
  const handleClick = (e) => {
    if (onViewAll) {
      e.preventDefault();
      onViewAll();
      return;
    }
    if (linkUrl) {
      window.location.href = linkUrl;
    }
  };

  const title =
    viewAllText ||
    (sectionType === "business" ? "View All Businesses" : "View All Services");

  const description =
    sectionType === "business"
      ? "Discover verified local brands, enterprise suppliers, and commercial partners across ILUMAA."
      : "Discover specialized consultants, licensed contractors, and certified service professionals across ILUMAA.";

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        group
        relative
        flex-none
        w-[245px]
        sm:w-[270px]
        snap-start
        overflow-hidden
        rounded-[24px]
        border
        border-blue-100
        bg-gradient-to-br
        from-blue-50/90
        via-white
        to-indigo-50/70
        p-6
        text-left
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-blue-300
        hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]
      "
    >
      {/* Decorative ambient blur */}
      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-36
          w-36
          rounded-full
          bg-blue-500/10
          blur-3xl
          transition-transform
          duration-500
          group-hover:scale-125
        "
      />

      <div className="relative flex min-h-[265px] flex-col justify-between">
        <div>
          {/* Arrow Icon */}
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              text-white
              shadow-lg
              shadow-blue-600/25
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:rotate-6
            "
          >
            <ArrowRight size={22} />
          </div>

          <h3
            className="
              mt-6
              text-lg
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-slate-500
            "
          >
            {description}
          </p>
        </div>

        {/* CTA link */}
        <div
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-bold
            text-blue-600
            transition-all
            duration-300
            group-hover:gap-2.5
          "
        >
          <span>Explore everything</span>
          <ArrowRight
            size={14}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   MAIN CATEGORY SECTION COMPONENT
========================================================= */
function CategorySection({
  badge,
  title = "Services, when you need them.",
  subtitle = "Find trusted professionals and businesses for your everyday needs.",
  categories = [],
  loading = false,
  viewAllText = "View All Services",
  cardCtaText,
  sectionType = "services",
  onViewAll,
  onCategoryClick,
  linkUrl = "/",
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundary state
  const checkScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, categories, loading]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -330 : 330;
    scrollRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  const handleViewAll = (event) => {
    if (onViewAll) {
      event.preventDefault();
      onViewAll();
    }
  };

  // Only show section if loading OR backend returned items
  if (!loading && (!categories || categories.length === 0)) {
    return null;
  }

  const badgeText =
    badge ||
    (sectionType === "business"
      ? "Enterprise & Business Sectors"
      : "Professional Services");

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        py-8
        sm:py-10
        lg:py-12
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}
        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* Header Left */}
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-blue-600
                "
              >
                {badgeText}
              </span>
            </div>

            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                sm:text-[28px]
                lg:text-[32px]
              "
            >
              {title}
            </h2>

            {subtitle && (
              <p
                className="
                  mt-1.5
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Header Right: Carousel Controls + View All */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`
                h-10
                w-10
                rounded-full
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                text-slate-700
                shadow-sm
                transition-all
                duration-200
                ${
                  canScrollLeft
                    ? "hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }
              `}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`
                h-10
                w-10
                rounded-full
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                text-slate-700
                shadow-sm
                transition-all
                duration-200
                ${
                  canScrollRight
                    ? "hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }
              `}
            >
              <ChevronRight size={18} />
            </button>

            {/* View All Button */}
            <a
              href={linkUrl}
              onClick={handleViewAll}
              className="
                group
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-slate-900
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-blue-600
                hover:shadow-md
              "
            >
              <span>{viewAllText}</span>
              <ArrowRight
                size={13}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
              />
            </a>
          </div>
        </div>

        {/* =================================================
            CAROUSEL WITH FADES
        ================================================= */}
        <div className="relative">
          {/* Subtle Left Fade */}
          {!loading && categories.length > 0 && canScrollLeft && (
            <div
              className="
                pointer-events-none
                absolute
                left-0
                top-0
                z-20
                hidden
                h-full
                w-12
                bg-gradient-to-r
                from-[#fafafa]
                to-transparent
                sm:block
              "
            />
          )}

          {/* Subtle Right Fade */}
          {!loading && categories.length > 0 && canScrollRight && (
            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                z-20
                hidden
                h-full
                w-14
                bg-gradient-to-l
                from-[#fafafa]
                to-transparent
                sm:block
              "
            />
          )}

          {/* SKELETON STATE: Only shown while fetching */}
          {loading ? (
            <div
              className="
                flex
                gap-4
                overflow-hidden
                pb-5
                pt-1
              "
            >
              {[1, 2, 3, 4].map((item) => (
                <ServiceSkeleton key={item} />
              ))}
            </div>
          ) : (
            /* REAL BACKEND DATA CAROUSEL */
            <div
              ref={scrollRef}
              className="
                flex
                gap-4
                overflow-x-auto
                pb-5
                pt-1
                snap-x
                snap-mandatory
                scroll-smooth
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {categories.map((category, index) => (
                <ServiceCard
                  key={category?._id || category?.id || `cat-${index}`}
                  category={category}
                  index={index}
                  sectionType={sectionType}
                  cardCtaText={cardCtaText}
                  onClick={() => onCategoryClick?.(category)}
                />
              ))}

              {/* View All Card at end of carousel */}
              {(onViewAll || linkUrl) && (
                <ViewAllCard
                  viewAllText={viewAllText}
                  onViewAll={onViewAll}
                  linkUrl={linkUrl}
                  sectionType={sectionType}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
