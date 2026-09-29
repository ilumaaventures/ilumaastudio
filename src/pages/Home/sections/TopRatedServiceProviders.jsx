import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Laptop,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =========================================================
   FEATURED BUSINESSES
   Only relevant business information is displayed.
========================================================= */

const providers = [
  {
    id: 1,
    name: "Resource Gateway",
    type: "Business Consulting & Services",
    tagline: "Helping businesses build, grow and operate better.",
    location: "Gurugram, Haryana",
    logo: "https://resourcegateway.in/logo-clean.png",
    cover: "https://resourcegateway.in/hero-bg.jpg",
    website: "https://resourcegateway.in/",
    accent: "from-slate-900 to-blue-700",
    icon: BriefcaseBusiness,
  },

  {
    id: 2,
    name: "TalentCIO",
    type: "Technology Talent Platform",
    tagline: "Connecting businesses with skilled technology talent.",
    location: "India · Global",
    logo: "https://talentcio.in/navbar-logo.png",
    cover:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    website: "https://talentcio.in/",
    accent: "from-emerald-600 to-teal-700",
    icon: Laptop,
  },

  {
    id: 3,
    name: "ILUMAA Tech",
    type: "Technology & Product Engineering",
    tagline: "Technology solutions for modern businesses.",
    location: "India",
    logo: "https://tech.ilumaa.com/ilumaa_logo.png",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    website: "https://tech.ilumaa.com/",
    accent: "from-violet-600 to-indigo-700",
    icon: Laptop,
  },

  {
    id: 4,
    name: "Cowork Insta",
    type: "Coworking & Managed Workspace",
    tagline: "Flexible workspaces designed for modern businesses.",
    location: "Gurugram, Haryana",
    logo: "https://coworkinsta.com/images/favicon/114.png",
    cover: "https://coworkinsta.com/images/cabins/3.png",
    website: "https://coworkinsta.com/",
    accent: "from-orange-500 to-red-600",
    icon: Building2,
  },

  {
    id: 5,
    name: "Flance",
    type: "Finance SaaS",
    tagline: "A SaaS platform built for modern financial operations.",
    location: "India",
    logo: null,
    cover:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
    website: "#",
    accent: "from-cyan-600 to-blue-700",
    icon: WalletCards,
  },
];

/* =========================================================
   BUSINESS CARD
========================================================= */

function BusinessCard({ provider }) {
  const Icon = provider.icon;

  return (
    <article
      className="
        group relative
        min-w-[315px] max-w-[315px]
        snap-start
        overflow-hidden
        rounded-[26px]
        border border-slate-200/70
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:border-blue-200
        hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]
      "
    >
      {/* =================================================
          Cover Image
      ================================================= */}

      <div className="relative h-[145px] overflow-hidden">
        <img
          src={provider.cover}
          alt={`${provider.name} cover`}
          className="
            h-full w-full
            object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
          loading="lazy"
        />

        {/* Image Overlay */}

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-slate-950/65
            via-slate-950/10
            to-transparent
          "
        />

        {/* Business Label */}

        <div
          className="
            absolute left-4 top-4
            inline-flex items-center gap-1.5
            rounded-full
            border border-white/20
            bg-black/20
            px-3 py-1.5
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            text-white
            backdrop-blur-md
          "
        >
          <Icon className="h-3.5 w-3.5" />
          Business
        </div>

        {/* Verified */}

        <div
          className="
            absolute right-4 top-4
            inline-flex items-center gap-1.5
            rounded-full
            bg-white/95
            px-2.5 py-1.5
            text-[10px]
            font-semibold
            text-slate-700
            shadow-sm
          "
        >
          <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
          Verified
        </div>

        {/* Cover Title */}

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
            Featured Business
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">{provider.name}</h3>
        </div>
      </div>

      {/* =================================================
          Logo
      ================================================= */}

      <div className="relative px-5">
        <div
          className="
            absolute
            -top-9 left-5
            flex h-[72px] w-[72px]
            items-center justify-center
            overflow-hidden
            rounded-2xl
            border-4 border-white
            bg-white
            shadow-lg
          "
        >
          {provider.logo ? (
            <img
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <div
              className={`
                flex h-full w-full
                items-center justify-center
                bg-gradient-to-br ${provider.accent}
                text-xl font-black
                text-white
              `}
            >
              F
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          Content
      ================================================= */}

      <div className="p-5 pt-12">
        {/* Business Name + Type */}

        <div>
          <h3
            className="
              text-lg
              font-bold
              tracking-tight
              text-slate-950
              transition-colors
              group-hover:text-blue-600
            "
          >
            {provider.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-blue-600">
            {provider.type}
          </p>
        </div>

        {/* Description */}

        <p
          className="
            mt-3
            min-h-[42px]
            line-clamp-2
            text-sm
            leading-5
            text-slate-500
          "
        >
          {provider.tagline}
        </p>

        {/* Location */}

        {provider.location && (
          <div
            className="
              mt-4
              flex items-center gap-1.5
              text-xs
              text-slate-400
            "
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{provider.location}</span>
          </div>
        )}

        {/* CTA */}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <Link
            to="/businesses"
            className="
              group/cta
              inline-flex
              w-full
              items-center
              justify-between
              rounded-xl
              bg-slate-950
              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              transition-all duration-300
              hover:bg-blue-600
            "
          >
            <span>Explore Business</span>

            <ArrowRight
              className="
                h-4 w-4
                transition-transform duration-300
                group-hover/cta:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

function FeaturedBusinesses() {
  const scrollLeft = () => {
    document.getElementById("featured-businesses")?.scrollBy({
      left: -335,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("featured-businesses")?.scrollBy({
      left: 335,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            mb-7
            flex flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            {/* Eyebrow */}

            {/* Heading */}

            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-3xl
              "
            >
              Top Rated Service Providers
            </h2>

            {/* Description */}

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Explore Service providers connected through the ILUMAA ecosystem.
            </p>
          </div>

          {/* =================================================
              Navigation
          ================================================= */}

          <div className="flex items-center gap-2">
            <Link
              to="/businesses"
              className="
                group
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-slate-950
                px-4
                py-2
                text-xs
                font-semibold
                text-white
                transition-all
                hover:bg-blue-600
              "
            >
              View All
              <ArrowRight
                className="
                  h-3.5 w-3.5
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            Business Cards
        ================================================= */}

        <div className="relative">
          {/* Right fade */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              z-10
              hidden
              h-full
              w-16
              bg-gradient-to-l
              from-white
              to-transparent
              sm:block
            "
          />

          <div
            id="featured-businesses"
            className="
              flex
              gap-5
              overflow-x-auto
              pb-5
              snap-x
              snap-mandatory
              scroll-smooth
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {providers.map((provider) => (
              <BusinessCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>

        {/* =================================================
            Mobile CTA
        ================================================= */}

        <div className="mt-2 flex justify-center sm:hidden">
          <Link
            to="/businesses"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm
              font-semibold
              text-slate-800
              shadow-sm
              transition
              hover:border-blue-200
              hover:text-blue-600
            "
          >
            Explore All Businesses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBusinesses;
