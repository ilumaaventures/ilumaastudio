import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoveRight,
  Gift,
  Heart,
  Truck,
  CheckCircle2,
  Sparkles,
  Feather,
} from "lucide-react";
import "./StarlingTales.css";
import { useStore } from "../Store/StoreContext";

// Local Hamper Assets from ILumaaStudio
import hamper1 from "../../assests/hamper-1 (1).jpeg";
import hamper2 from "../../assests/hamper-1 (2).jpeg";
import hamper3 from "../../assests/hamper-1 (3).jpeg";
import hamper4 from "../../assests/hamper-1 (4).jpeg";
import hamper5 from "../../assests/hamper-1 (5).jpeg";

const HAMPERS_DATA = [
  {
    id: 1,
    title: "New Baby",
    tagline: "A basket of cuddles, comfort & treasured beginnings.",
    description:
      "Thoughtfully curated for little moments that become lifelong memories. Featuring a handmade giraffe companion, an ultra-soft baby blanket, and touch-and-feel books designed to inspire warmth, comfort, and early wonder—beautifully wrapped in a timeless keepsake basket.",
    city: "Mumbai",
    image: hamper1,
    callouts: [
      {
        title: "Ultra Soft\nBaby Blanket",
        top: "14%",
        left: "6%",
      },
      {
        title: "Handmade\nGiraffe Toy",
        top: "6%",
        left: "52%",
      },
      {
        title: "Touch & Feel\nFarm Animals Book",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Made with Love,",
    stampSubtitle: "SENT WITH HEART",
    waxNote: "Free handwritten calligraphy gift message included.",
  },
  {
    id: 2,
    title: "Tiny Explorer",
    tagline: "Adventures, sweet dreams & cuddly companions.",
    description:
      "A delightful discovery basket with handcrafted animal companions, snuggly organic swaddles, and keepsake storybooks curated to nurture curiosity and boundless imagination from day one.",
    city: "Bengaluru",
    image: hamper2,
    callouts: [
      {
        title: "Organic Muslin\nSwaddles",
        top: "12%",
        left: "6%",
      },
      {
        title: "Artisanal Teddy\nBear",
        top: "6%",
        left: "50%",
      },
      {
        title: "Keepsake Milestone\nStory Cards",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Handcrafted Bliss,",
    stampSubtitle: "PACKED WITH CARE",
    waxNote: "Free wax-sealed envelope & custom note included.",
  },
  {
    id: 3,
    title: "Blushing Meadow",
    tagline: "Gentle rose hues, pure muslin & sweet lullabies.",
    description:
      "Wrapped in delicate pastel ribbons, this enchanting set features cozy organic essentials, charming keepsake rattles, and soothing nursery pieces made for peaceful slumber and joyful mornings.",
    city: "Delhi",
    image: hamper3,
    callouts: [
      {
        title: "Pastel Pink\nMuslin Ribbons",
        top: "12%",
        left: "6%",
      },
      {
        title: "Pure Organic\nCotton Set",
        top: "6%",
        left: "52%",
      },
      {
        title: "Keepsake Rattle\n& Memory Token",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Purest Comfort,",
    stampSubtitle: "WRAPPED IN JOY",
    waxNote: "Free handwritten calligraphy gift message included.",
  },
  {
    id: 4,
    title: "Sleepy Bunny",
    tagline: "Dreamy blue clouds, bunny cuddles & quiet nights.",
    description:
      "An angelic nursery collection centered around our signature handcrafted bunny, sky-blue heirloom textiles, and calming keepsakes designed to bring serene smiles and restful sleep.",
    city: "Pune",
    image: hamper4,
    callouts: [
      {
        title: "Signature Velvet\nBunny",
        top: "12%",
        left: "6%",
      },
      {
        title: "Sky-Blue Cloud\nMuslin Wrap",
        top: "6%",
        left: "52%",
      },
      {
        title: "Wooden Teething\nKeepsake Ring",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Treasured Heirloom,",
    stampSubtitle: "MADE WITH CARE",
    waxNote: "Free gold-foiled handwritten message included.",
  },
  {
    id: 5,
    title: "Golden Sunshine",
    tagline: "Warm embrace of luxury, pure joy & celebrations.",
    description:
      "A grand celebration hamper accented with shimmering satin ribbons, premium organic cotton essentials, and beloved plush characters to commemorate the most cherished milestones.",
    city: "Hyderabad",
    image: hamper5,
    callouts: [
      {
        title: "Golden Satin\nBow & Wrap",
        top: "12%",
        left: "6%",
      },
      {
        title: "Premium Organic\nCotton Bodysuit",
        top: "6%",
        left: "50%",
      },
      {
        title: "Keepsake Baby\nMoments Journal",
        top: "14%",
        right: "4%",
      },
    ],
    stampTitle: "Celebration Special,",
    stampSubtitle: "CURATED WITH LOVE",
    waxNote: "Free wax-sealed personalized note included.",
  },
];

export default function GiftHamper() {
  const { business, storeHomePath: contextHomePath } = useStore();
  const [activeHamperIndex, setActiveHamperIndex] = useState(0);

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  const activeHamper = HAMPERS_DATA[activeHamperIndex] || HAMPERS_DATA[0];

  return (
    <section
      id="gift-hampers"
      className="reveal bg-[#FAF7F2] px-4 sm:px-6 lg:px-8 py-10 md:py-16 scroll-mt-20 border-t border-[#EAE3D2]/60 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-12 items-center">
          {/* ================= LEFT COLUMN: STORY & SELECTOR ================= */}
          <div className="lg:col-span-5 space-y-7">
            {/* Atelier Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E2D8C3] text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A695B] shadow-2xs">
              <Gift size={13} className="text-[#C5A880]" />
              <span>The Gifting Atelier</span>
            </div>

            {/* Heart Divider Icon */}
            <div className="flex items-center gap-3 text-[#96A9B8]">
              <Heart size={16} className="text-[#8AA4B4]" strokeWidth={1.5} />
              <div className="w-16 h-px border-t border-dashed border-[#D2DCE0]" />
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.12] text-[#2C3E35] font-normal tracking-tight">
              The perfect gift,
              <br />
              beautifully wrapped.
            </h2>

            {/* Editorial Paragraph */}
            <p className="text-[13.5px] sm:text-[14px] leading-[1.8] text-[#5B5B5B] font-light">
              Every hamper is thoughtfully curated and presented—a complete
              gifting ritual for new arrivals, birthdays, and milestone moments.
              We combine our hand-stitched companions, soft organic muslin
              textiles, and safe keepsakes into harmonious sets designed to
              delight both parents and little ones.
            </p>

            {/* Bullet Points */}
            <ul className="space-y-3.5 text-[13.5px] text-[#5B5B5B] font-light list-none p-0">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AA4B4] mt-2 shrink-0" />
                <span>
                  Pick from our wide range of handcrafted treasures and create a
                  hamper that’s uniquely yours.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AA4B4] mt-2 shrink-0" />
                <span>
                  Curate it, personalise it, and make every gift truly special.
                  Custom embroidery & name personalisation available.
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-[#9A8D82] text-[11px] font-bold tracking-[0.2em] uppercase mb-3.5">
              <Truck size={15} />
              <span>Delivered with Love</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {HAMPERS_DATA.map((h, idx) => {
                const isSelected = activeHamperIndex === idx;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHamperIndex(idx)}
                    className={`flex flex-col items-center text-center group cursor-pointer transition-all duration-200 outline-none ${
                      isSelected
                        ? "scale-[1.04]"
                        : "hover:scale-[1.02] opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div
                      className={`w-full aspect-[4/3] rounded-xl overflow-hidden border-2 bg-[#FAF6F0] shadow-xs transition-all ${
                        isSelected
                          ? "border-[#2C3E35] ring-2 ring-[#2C3E35]/20 shadow-md"
                          : "border-white hover:border-[#D0AE86]"
                      }`}
                    >
                      <img
                        src={h.image}
                        alt={h.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            {/* CTA Button */}
            <div>
              <Link
                to={`${storeHomePath}/gift-hampers`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#2C3E35] hover:bg-[#1E2B25] text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-200 shadow-md group"
              >
                <span>Explore All Hampers</span>
                <MoveRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Delivered With Love - Interactive Thumbnail Selector */}
            <div className="pt-4 border-t border-[#EAE3D2]"></div>
          </div>

          {/* ================= RIGHT COLUMN: ARTISAN SHOWCASE CARD ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 lg:p-7 shadow-xl border border-[#EDE4D5] flex flex-col md:flex-row gap-5 lg:gap-6 items-stretch relative overflow-hidden">
              {/* LEFT PARCHMENT CARD PANEL */}
              <div className="w-full md:w-[46%] bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#EDE5D8] flex flex-col justify-between relative shadow-2xs">
                <div>
                  {/* Script Cursive Header */}
                  <h3 className="font-script text-[42px] sm:text-[50px] text-[#4A3B32] text-center leading-none pt-1 mb-1 font-normal tracking-wide transition-all duration-300">
                    {activeHamper.title}
                  </h3>

                  {/* Delicate Heart Outline Icon */}
                  <div className="flex justify-center my-1.5 text-[#C5A880]">
                    <Heart
                      size={14}
                      strokeWidth={1.5}
                      className="text-[#C5A880]"
                    />
                  </div>

                  {/* Subtitle */}
                  <p className="font-serif italic text-xs text-[#5C4D42] text-center leading-snug px-2 mb-3">
                    {activeHamper.tagline}
                  </p>

                  {/* Decorative Flourish */}
                  <div className="flex items-center justify-center gap-2 my-2 text-[#C5A880]/60">
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
                    <span className="text-[9px]">❦</span>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
                  </div>

                  {/* Narrative Body */}
                  <p className="text-[11.5px] leading-[1.7] text-[#6B5E54] text-center font-light mt-3 mb-5 px-1">
                    {activeHamper.description}
                  </p>
                </div>

                {/* 3 Circular Value Highlights */}
                <div className="space-y-4 pt-3 border-t border-[#EAE3D2]/70">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E2D8C3] flex items-center justify-center text-[#7A695B] shadow-2xs mb-1">
                        <Heart size={13} className="text-[#C5A880]" />
                      </div>
                      <span className="text-[9.5px] font-bold text-[#4A3B32] leading-tight">
                        Handmade
                        <br />
                        with Love
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E2D8C3] flex items-center justify-center text-[#7A695B] shadow-2xs mb-1">
                        <Feather size={13} className="text-[#8AA4B4]" />
                      </div>
                      <span className="text-[9.5px] font-bold text-[#4A3B32] leading-tight">
                        Premium &<br />
                        Baby Safe
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E2D8C3] flex items-center justify-center text-[#7A695B] shadow-2xs mb-1">
                        <Gift size={13} className="text-[#D0AE86]" />
                      </div>
                      <span className="text-[9.5px] font-bold text-[#4A3B32] leading-tight">
                        Perfect for
                        <br />
                        Gifting
                      </span>
                    </div>
                  </div>

                  {/* Floating Wax-Sealed Note Pill */}
                  <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-[#E2D8C3] shadow-xs flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-50 text-[#C5A880] flex items-center justify-center shrink-0 border border-amber-200/60">
                      <Sparkles size={12} />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-[#7A695B] block">
                        Wax-Sealed Note
                      </span>
                      <p className="text-[10px] text-[#6B5E54] font-medium leading-tight">
                        {activeHamper.waxNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT BASKET IMAGE & ANNOTATION PHOTO AREA */}
              <div className="w-full md:w-[54%] relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F4EFE6] to-[#EAE2D2] min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-4 sm:p-6 border border-[#E8DFC8]">
                {/* Ambient Soft Blur */}
                <img
                  src={activeHamper.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
                />

                {/* Hamper Photo Full & Unclipped with Smooth Transition */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    key={activeHamper.id}
                    src={activeHamper.image}
                    alt={activeHamper.title}
                    className="max-h-[380px] sm:max-h-[440px] w-auto max-w-full object-contain drop-shadow-2xl rounded-2xl animate-fade-in transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Top Right "HAMPER" Ribbon Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="relative bg-[#5E3A1C] text-[#FAF7F2] font-display text-[11px] font-bold tracking-[0.24em] uppercase px-4 py-1 rounded-sm shadow-md flex items-center justify-center">
                    <span>HAMPER</span>
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-[#422610] rounded-l-xs" />
                    <div className="absolute -right-1 top-0 bottom-0 w-1 bg-[#422610] rounded-r-xs" />
                  </div>
                </div>

                {/* Dynamic Callouts & Pointing Lines */}
                {activeHamper.callouts.map((callout, cIdx) => (
                  <div
                    key={cIdx}
                    className="absolute hidden sm:flex items-center gap-1.5 z-10 animate-fade-in pointer-events-none"
                    style={{
                      top: callout.top,
                      left: callout.left,
                      right: callout.right,
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E2D8C3] shadow-sm text-center">
                      <span className="text-[10px] font-handwriting text-[#4A3B32] font-bold whitespace-pre-line leading-tight block">
                        {callout.title}
                      </span>
                    </div>
                    {/* Pointer curve icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7A695B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-70 drop-shadow-xs"
                    >
                      <path d="M4 4c0 8 6 14 14 14m0 0-4-4m4 4-4 4" />
                    </svg>
                  </div>
                ))}

                {/* Bottom Right Vintage Postage Stamp Badge */}
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="vintage-stamp bg-[#FAF7F2]/95 backdrop-blur-xs px-4 py-2.5 rounded-xl border-2 border-dashed border-[#C5A880] text-center shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="flex justify-center mb-0.5 text-[#C5A880]">
                      <Heart size={12} strokeWidth={1.5} />
                    </div>
                    <span className="font-handwriting text-sm text-[#4A3B32] font-bold block leading-tight">
                      {activeHamper.stampTitle}
                    </span>
                    <span className="text-[8.5px] font-extrabold tracking-[0.18em] uppercase text-[#7A695B] block mt-0.5">
                      {activeHamper.stampSubtitle}
                    </span>
                    <div className="flex justify-center mt-0.5 text-[#C5A880]">
                      <Heart size={8} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
