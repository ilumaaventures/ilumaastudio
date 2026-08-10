import React from "react";
import HeartDivider from "./components/HeartDivider";

export default function StarlingAbout() {
  return (
    <>
      <section
        id="about-us"
        className="reveal grid bg-cream md:grid-cols-2 py-10"
      >
        <img
          className="w-full h-[410px] sm:h-[540px] md:h-[635px] lg:h-[820px] object-cover self-center"
          src="https://starlingtales.vercel.app/23.png"
          alt="Handcrafted toys and soft textiles reflecting Starling Tales philosophy"
          loading="lazy"
          decoding="async"
        />
        <div className="relative overflow-hidden px-5 py-16 md:px-12 lg:px-20 lg:py-24">
          {/* <Botanical className="absolute -right-10 bottom-6 h-48 w-48 text-blue-muted opacity-20" /> */}
          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-medium tracking-[0.26em] leading-normal uppercase text-text-dark max-md:text-xs max-md:tracking-[0.22em] text-left">
              Our Philosophy
            </p>
            <div className="mt-6">
              <HeartDivider centered={false} />
            </div>
            <p className="mt-8 text-[15px] font-light leading-[1.85] text-text-body">
              At Starling Tales, we believe childhood should feel gentle,
              comforting, and beautifully unhurried. We are dedicated to
              creating a serene world of wonder, crafted with mindful materials
              that feel like a soft, warm hug for your little ones.
            </p>
            <p className="mt-5 text-[15px] font-light leading-[1.85] text-text-body">
              Every piece is thoughtfully created in our quiet workshop using
              chemical-free fibres, soothing tones, and understated accents. We
              place each stitch with intention, crafting toys and nursery
              textiles that are meant to celebrate childhood milestones while
              becoming cherished family heirlooms over time.
            </p>
            <p className="mt-5 mb-8 text-[15px] font-light leading-[1.85] text-text-body">
              Our philosophy is simple: to encourage slow, mindful living from
              the very start. By choosing natural cottons, hypoallergenic
              fillings, and safety-tested details, we ensure that every Starling
              Tales companion brings a gentle, enduring sense of comfort,
              imagination, and peace into your home.
            </p>
            <div className="mt-9">
              {/* <ButtonLink href="#about-us">Our Story</ButtonLink> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
