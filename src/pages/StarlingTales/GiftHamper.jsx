import React from "react";
import { Link } from "react-router-dom";
import { MoveRight, Sparkles, Gift } from "lucide-react";
import "./StarlingTales.css";
import { useStore } from "../Store/StoreContext";
import { GIFT_HAMPERS, formatPrice } from "./constants";
import HeartDivider from "./components/HeartDivider";

function GiftHamper() {
  const { business, storeHomePath: contextHomePath } = useStore();
  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  const previewHampers = GIFT_HAMPERS.slice(0, 3);

  return (
    <section
      id="gift-hampers"
      className="reveal bg-gradient-to-b from-cream-dark via-[#FAF6F0] to-cream px-6 py-16 md:py-24 scroll-mt-20 border-t border-[#E8DFC8]/40"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFC8] text-[11px] font-bold tracking-[0.24em] uppercase text-text-dark mb-4">
              <Gift size={12} className="text-gold" />
              <span>The Gifting Atelier</span>
            </div>
            <div className="mb-4">
              <HeartDivider centered={false} />
            </div>
            <h2 className="font-display text-[34px] sm:text-[42px] leading-[1.1] text-text-dark">
              The perfect gift,{"\n"}beautifully wrapped.
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.85] text-text-body">
              Every hamper is thoughtfully curated and presented—a complete
              gifting ritual for new arrivals, birthdays, and milestone moments.
              We combine our hand-stitched companions, soft organic muslin
              textiles, and safe keepsakes into harmonious sets designed to
              delight both parents and little ones.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={`${storeHomePath}/gift-hampers`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-text-dark text-cream text-xs font-semibold uppercase tracking-[0.18em] rounded-full hover:bg-blue-soft transition-all duration-200 shadow-md group"
              >
                <span>Explore All Hampers</span>
                <MoveRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white">
              <img
                className="h-full min-h-[380px] max-h-[460px] w-full object-cover"
                src="https://starlingtales.vercel.app/19.jpeg"
                alt="A beautifully presented premium gift set displaying our hand-stitched toys"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFC8] shadow-lg max-w-[220px] hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5 mb-0.5">
                <Sparkles size={13} />
                <span>Wax-Sealed Note</span>
              </p>
              <p className="text-xs text-text-body font-light">
                Free handwritten calligraphy gift message included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GiftHamper;
