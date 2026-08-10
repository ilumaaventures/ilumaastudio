import React, { useEffect, useMemo, useState } from "react";
import "./StarlingTales.css";
import {
  PRODUCTS,
  RESIDENTS,
  navLinks,
  pillars,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  readStorage,
} from "./constants";
import Icon from "./components/Icon";
import Botanical from "./components/Botanical";
import HeartDivider from "./components/HeartDivider";
import ButtonLink from "./components/ButtonLink";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import ResidentCard from "./components/ResidentCard";
import ResidentModal from "./components/ResidentModal";
import CartDrawer from "./components/CartDrawer";

function GiftHamper() {
  return (
    <section
      id="gift-hampers"
      className="reveal grid gap-8 bg-cream-dark px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:gap-0 md:px-0 md:py-0"
    >
      <div className="flex items-center px-0 md:px-12 lg:px-20">
        <div className="max-w-xl py-0 md:py-20">
          <p className="text-sm font-medium tracking-[0.26em] leading-normal uppercase text-text-dark max-md:text-xs max-md:tracking-[0.22em] text-left">
            Gift Hampers
          </p>
          <div className="mt-6">
            <HeartDivider centered={false} />
          </div>
          <h2 className="mt-8 whitespace-pre-line font-display text-[36px] leading-[1.08] text-text-dark md:text-[42px]">
            The perfect gift,{"\n"}beautifully wrapped.
          </h2>
          <p className="mt-6 text-[15px] font-light leading-[1.85] text-text-body">
            Every hamper is thoughtfully curated and presented - a complete
            gifting experience for new arrivals, birthdays, and milestone
            moments. We combine our most-loved hand-stitched companions, soft
            organic muslin textiles, and safe keepsakes into harmonious sets
            designed to delight both parents and little ones.
          </p>
          <ul className="mt-6 mb-8 space-y-3.5 p-0 list-none text-text-body text-[14px] font-light">
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shrink-0" />
              <span>Custom embroidery & name personalisation available</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shrink-0" />
              <span>
                Signature woven rope basket or keepsake keepsake box packaging
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shrink-0" />
              <span>Complimentary handwritten calligraphed gift note card</span>
            </li>
          </ul>
          <div className="mt-9">
            <ButtonLink href="#gift-hampers">Shop Hampers</ButtonLink>
          </div>
        </div>
      </div>
      <div className="p-0 md:p-8">
        <img
          className="h-full min-h-[420px] w-full rounded-lg object-cover"
          src="https://starlingtales.vercel.app/19.jpeg"
          alt="A beautifully presented premium gift set displaying our hand-stitched toys"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

export default GiftHamper;
