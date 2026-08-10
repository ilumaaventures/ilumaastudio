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

function PoeticBanner() {
  return (
    <section className="py-20 bg-blue-light/30 border-y border-cream-dark/45 px-6 text-center">
      <div className="max-w-xl mx-auto space-y-5">
        <Icon name="heart" className="h-6 w-6 text-blue-soft mx-auto" />
        <h3 className="text-2xl md:text-3xl font-display font-medium text-text-dark italic">
          "A little bundle of love, ready to accompany them on every tiny
          adventure."
        </h3>
        <p className="text-[10px] font-medium tracking-[0.2em] text-blue-soft uppercase">
          – Crafted for Childhood Memories
        </p>
      </div>
    </section>
  );
}

export default PoeticBanner;
