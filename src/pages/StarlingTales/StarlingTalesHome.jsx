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
import CartDrawer from "./components/CartDrawer";
import StarlingTalesHero from "./StarlingTalesHero";
import BrandPillars from "./BrandPillars";
import Residents from "./Residents";
import PoeticBanner from "./PoeticBanner";
import ThanksYou from "./ThanksYou";
import GiftHamper from "./GiftHamper";
import StarlingCollection from "./StarlingCollection";
import StarlingAbout from "./StarlingAbout";
export default function StarlingTalesHome() {
  // Cart, wishlist and dialog states
  const [cart, setCart] = useState(() => readStorage("starling_cart", []));
  const [wishlist, setWishlist] = useState(() =>
    readStorage("starling_wishlist", []),
  );

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("starling_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("starling_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft relative overflow-x-hidden">
      <div className="bg-text-dark text-cream text-[11px] tracking-[0.2em] uppercase py-2 text-center font-medium px-4">
        Free shipping on all heirloom keepsakes over ₹5,000
      </div>
      <StarlingTalesHero />
      <Residents />
      <StarlingAbout />
      <StarlingCollection />
      <PoeticBanner />
      <GiftHamper />
      <BrandPillars />

      <ThanksYou />
    </div>
  );
}
