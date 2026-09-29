import React, { useRef, useState } from "react";
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
  Layers3,
} from "lucide-react";

/* -------------------------------------------------------
   Premium Icon Themes
------------------------------------------------------- */

const ICON_THEMES = [
  {
    wrapper:
      "bg-blue-50 text-blue-600 ring-blue-100 group-hover:bg-blue-600 group-hover:text-white",
    glow: "bg-blue-500/10",
  },
  {
    wrapper:
      "bg-indigo-50 text-indigo-600 ring-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
    glow: "bg-indigo-500/10",
  },
  {
    wrapper:
      "bg-emerald-50 text-emerald-600 ring-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
    glow: "bg-emerald-500/10",
  },
  {
    wrapper:
      "bg-amber-50 text-amber-600 ring-amber-100 group-hover:bg-amber-500 group-hover:text-white",
    glow: "bg-amber-500/10",
  },
  {
    wrapper:
      "bg-rose-50 text-rose-600 ring-rose-100 group-hover:bg-rose-500 group-hover:text-white",
    glow: "bg-rose-500/10",
  },
  {
    wrapper:
      "bg-purple-50 text-purple-600 ring-purple-100 group-hover:bg-purple-600 group-hover:text-white",
    glow: "bg-purple-500/10",
  },
  {
    wrapper:
      "bg-cyan-50 text-cyan-600 ring-cyan-100 group-hover:bg-cyan-600 group-hover:text-white",
    glow: "bg-cyan-500/10",
  },
  {
    wrapper:
      "bg-teal-50 text-teal-600 ring-teal-100 group-hover:bg-teal-600 group-hover:text-white",
    glow: "bg-teal-500/10",
  },
];

/* -------------------------------------------------------
   Category Icon
------------------------------------------------------- */

function CategoryIcon({ category, index = 0 }) {
  const [imgError, setImgError] = useState(false);

  const rawIcon = category?.icon || category?.image;
  const name = (category?.name || category?.title || "").toLowerCase();

  const theme = ICON_THEMES[index % ICON_THEMES.length];

  const isValidImage =
    rawIcon &&
    typeof rawIcon === "string" &&
    (rawIcon.startsWith("http://") ||
      rawIcon.startsWith("https://") ||
      rawIcon.startsWith("/") ||
      rawIcon.startsWith("data:")) &&
    !imgError;

  if (isValidImage) {
    return (
      <div className="relative mb-5">
        <div
          className={`absolute -inset-2 rounded-3xl blur-xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${theme.glow}`}
        />

        <div
          className={`
            relative flex h-14 w-14 items-center justify-center
            rounded-2xl ring-1
            shadow-sm
            transition-all duration-300
            group-hover:-translate-y-0.5
            group-hover:scale-105
            ${theme.wrapper}
          `}
        >
          <img
            src={rawIcon}
            alt={category?.name || "Category"}
            className="h-8 w-8 rounded-xl object-contain"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    );
  }

  const isEmoji =
    rawIcon &&
    typeof rawIcon === "string" &&
    rawIcon.length <= 4 &&
    /\p{Extended_Pictographic}/u.test(rawIcon);

  if (isEmoji) {
    return (
      <div className="relative mb-5">
        <div
          className={`absolute -inset-2 rounded-3xl blur-xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${theme.glow}`}
        />

        <div
          className={`
            relative flex h-14 w-14 items-center justify-center
            rounded-2xl ring-1
            text-2xl
            shadow-sm
            transition-all duration-300
            group-hover:-translate-y-0.5
            group-hover:scale-105
            ${theme.wrapper}
          `}
        >
          {rawIcon}
        </div>
      </div>
    );
  }

  const renderIcon = () => {
    if (
      name.includes("tech") ||
      name.includes("it ") ||
      name.includes("software") ||
      name.includes("digital")
    ) {
      return <Laptop size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("finance") ||
      name.includes("bank") ||
      name.includes("investment") ||
      name.includes("bfsi")
    ) {
      return <Landmark size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("security") ||
      name.includes("facility") ||
      name.includes("mgmt")
    ) {
      return <ShieldCheck size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("astro") ||
      name.includes("spiritual") ||
      name.includes("beauty") ||
      name.includes("salon")
    ) {
      return <Sparkles size={24} strokeWidth={1.8} />;
    }

    if (name.includes("travel") || name.includes("tour")) {
      return <Plane size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("marketing") ||
      name.includes("brand") ||
      name.includes("advertis")
    ) {
      return <TrendingUp size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("event") ||
      name.includes("pr ") ||
      name.includes("party")
    ) {
      return <PartyPopper size={24} strokeWidth={1.8} />;
    }

    if (name.includes("office") || name.includes("corporate")) {
      return <Building2 size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("logistics") ||
      name.includes("delivery") ||
      name.includes("transport")
    ) {
      return <Truck size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("hospitality") ||
      name.includes("food") ||
      name.includes("restaurant")
    ) {
      return <UtensilsCrossed size={24} strokeWidth={1.8} />;
    }

    if (name.includes("auto") || name.includes("car")) {
      return <Car size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("health") ||
      name.includes("medical") ||
      name.includes("pharma") ||
      name.includes("wellness")
    ) {
      return <HeartPulse size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("home") ||
      name.includes("repair") ||
      name.includes("clean") ||
      name.includes("maintenance")
    ) {
      return <Wrench size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("construction") ||
      name.includes("real estate") ||
      name.includes("infrastructure")
    ) {
      return <HardHat size={24} strokeWidth={1.8} />;
    }

    if (
      name.includes("education") ||
      name.includes("training") ||
      name.includes("school")
    ) {
      return <GraduationCap size={24} strokeWidth={1.8} />;
    }

    if (name.includes("business") || name.includes("professional")) {
      return <Briefcase size={24} strokeWidth={1.8} />;
    }

    return <Store size={24} strokeWidth={1.8} />;
  };

  return (
    <div className="relative mb-5">
      <div
        className={`absolute -inset-2 rounded-3xl blur-xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${theme.glow}`}
      />

      <div
        className={`
          relative flex h-14 w-14 items-center justify-center
          rounded-2xl ring-1
          shadow-sm
          transition-all duration-300
          group-hover:-translate-y-0.5
          group-hover:scale-105
          ${theme.wrapper}
        `}
      >
        {renderIcon()}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Category Section
------------------------------------------------------- */

function CategorySection({
  title,
  subtitle,
  categories = [],
  loading = false,
  viewAllText = "View All",
  onViewAll,
  onCategoryClick,
  linkUrl = "/",
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  const handleViewAll = (e) => {
    if (onViewAll) {
      e.preventDefault();
      onViewAll();
    }
  };

  if (!loading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <section className="relative w-full py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ------------------------------------------------
            Section Header
        ------------------------------------------------ */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Explore
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[28px]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Desktop navigation */}

            {/* View all */}

            <a
              href={linkUrl}
              onClick={handleViewAll}
              className="
                group inline-flex items-center gap-1.5
                rounded-full
                bg-slate-900
                px-4 py-2
                text-xs font-semibold
                text-white
                shadow-sm
                transition-all duration-200
                hover:bg-blue-600
                hover:shadow-md
              "
            >
              <span>{viewAllText || "View All"}</span>

              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        {/* ------------------------------------------------
            Content
        ------------------------------------------------ */}

        <div className="relative">
          {/* Left fade */}

          {!loading && categories.length > 0 && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-8 bg-gradient-to-r from-white to-transparent sm:block" />
          )}

          {/* Right fade */}

          {!loading && categories.length > 0 && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-10 bg-gradient-to-l from-white to-transparent sm:block" />
          )}

          {loading ? (
            <div
              className="
                flex gap-4 overflow-hidden
                pb-3 pt-1
              "
            >
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="
                    flex-none
                    w-[250px] sm:w-[280px]
                    rounded-3xl
                    border border-slate-100
                    bg-white
                    p-5
                    shadow-sm
                    animate-pulse
                  "
                >
                  <div className="mb-5 h-14 w-14 rounded-2xl bg-slate-100" />

                  <div className="mb-3 h-4 w-3/4 rounded bg-slate-100" />

                  <div className="mb-2 h-3 w-full rounded bg-slate-100" />

                  <div className="mb-5 h-3 w-2/3 rounded bg-slate-100" />

                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="
                flex gap-4
                overflow-x-auto
                pb-4 pt-1
                snap-x snap-mandatory
                scroll-smooth
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {categories.map((category, index) => {
                const categoryId =
                  category?._id || category?.id || `cat-${index}`;

                const name = category?.name || category?.title || "Category";

                const description =
                  category?.description ||
                  category?.subtitle ||
                  (category?.itemCount
                    ? `${category.itemCount} items available`
                    : "Explore verified services & top providers");

                const itemCount =
                  category?.itemCount ||
                  category?.count ||
                  category?.productCount;

                return (
                  <button
                    key={categoryId}
                    type="button"
                    onClick={() => onCategoryClick?.(category)}
                    className="
                      group relative flex-none
                      w-[255px] sm:w-[285px]
                      snap-start
                      overflow-hidden
                      rounded-3xl
                      border border-slate-200/70
                      bg-white
                      p-5 sm:p-6
                      text-left
                      shadow-[0_4px_20px_rgba(15,23,42,0.04)]
                      transition-all duration-300
                      ease-out
                      hover:-translate-y-1
                      hover:border-blue-200
                      hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                  >
                    {/* Decorative gradient */}

                    <div
                      className="
                        pointer-events-none
                        absolute -right-10 -top-10
                        h-28 w-28
                        rounded-full
                        bg-blue-500/[0.04]
                        blur-2xl
                        transition-all duration-500
                        group-hover:bg-blue-500/[0.10]
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute bottom-0 left-0
                        h-px w-0
                        bg-gradient-to-r from-blue-500 to-indigo-500
                        transition-all duration-500
                        group-hover:w-full
                      "
                    />

                    <CategoryIcon category={category} index={index} />

                    {/* Category title */}

                    <div className="relative">
                      <h3
                        className="
                          line-clamp-1
                          text-[15px] sm:text-base
                          font-bold
                          tracking-tight
                          text-slate-900
                          transition-colors duration-200
                          group-hover:text-blue-600
                        "
                      >
                        {name}
                      </h3>

                      {/* Description */}

                      <p
                        className="
                          mt-2
                          min-h-[42px]
                          line-clamp-2
                          text-xs
                          leading-[1.35rem]
                          text-slate-500
                        "
                      >
                        {description}
                      </p>

                      {/* Footer */}

                      <div className="mt-5 flex items-center justify-between">
                        {itemCount ? (
                          <span
                            className="
                              inline-flex items-center gap-1.5
                              rounded-full
                              bg-slate-50
                              px-2.5 py-1
                              text-[10px]
                              font-semibold
                              text-slate-500
                              ring-1 ring-slate-100
                            "
                          >
                            <Layers3 size={11} />
                            {itemCount} items
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">
                            Explore category
                          </span>
                        )}

                        <span
                          className="
                            inline-flex items-center gap-1
                            text-xs
                            font-bold
                            text-blue-600
                            transition-all duration-300
                            group-hover:gap-2
                          "
                        >
                          Explore
                          <ArrowRight
                            size={13}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* ------------------------------------------------
                  Premium View All Card
              ------------------------------------------------ */}

              {(onViewAll || linkUrl) && (
                <button
                  type="button"
                  onClick={
                    onViewAll
                      ? onViewAll
                      : () => {
                          window.location.href = linkUrl;
                        }
                  }
                  className="
                    group relative flex-none
                    w-[205px] sm:w-[220px]
                    snap-start
                    overflow-hidden
                    rounded-3xl
                    border border-blue-100
                    bg-gradient-to-br
                    from-blue-50
                    via-white
                    to-indigo-50
                    p-5
                    text-left
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-[0_16px_40px_rgba(37,99,235,0.12)]
                  "
                >
                  <div
                    className="
                      absolute -right-10 -top-10
                      h-28 w-28
                      rounded-full
                      bg-blue-500/10
                      blur-2xl
                      transition-all duration-500
                      group-hover:scale-125
                    "
                  />

                  <div className="relative flex h-full min-h-[190px] flex-col justify-between">
                    <div>
                      <div
                        className="
                          flex h-12 w-12
                          items-center justify-center
                          rounded-2xl
                          bg-blue-600
                          text-white
                          shadow-lg shadow-blue-600/20
                          transition-all duration-300
                          group-hover:scale-105
                          group-hover:rotate-3
                        "
                      >
                        <ArrowRight size={21} />
                      </div>

                      <h3 className="mt-5 text-base font-bold text-slate-900">
                        {viewAllText || "View All"}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        Explore all businesses, sectors and services available
                        on ILUMAA.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      Explore everything
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
