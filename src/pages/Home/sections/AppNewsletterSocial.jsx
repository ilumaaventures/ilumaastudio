import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Gift,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";

function AppNewsletterSocial() {
  return (
    <footer className="w-full pt-6 sm:pt-10">
      {/* =====================================================
          PREMIUM FEATURED OFFER
      ====================================================== */}

      <section className="px-4 sm:px-6 lg:px-8">
        <div
          className="
            group
            relative
            mx-auto
            max-w-7xl
            overflow-hidden
            rounded-[28px]
            sm:rounded-[34px]
            bg-[#27211E]
            shadow-[0_24px_70px_rgba(45,34,28,0.14)]
          "
        >
          {/* Background decorative glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-28
              h-72
              w-72
              rounded-full
              bg-[#C98289]/15
              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-10
              h-72
              w-72
              rounded-full
              bg-[#C9A16B]/10
              blur-[90px]
            "
          />

          {/* Main layout */}

          <div className="relative grid min-h-[340px] items-stretch md:grid-cols-[1.05fr_0.95fr]">
            {/* =================================================
                CONTENT
            ================================================== */}

            <div
              className="
                relative
                z-10
                flex
                flex-col
                justify-center
                px-6
                py-10
                sm:px-10
                sm:py-12
                lg:px-14
                lg:py-14
              "
            >
              {/* Eyebrow */}

              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#E5BFAF]">
                  <Gift size={14} strokeWidth={1.5} />
                </span>

                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#DDB7A8]
                  "
                >
                  A Little Something Special
                </span>
              </div>

              {/* Heading */}

              <h2
                className="
                  max-w-xl
                  font-serif
                  text-[34px]
                  font-medium
                  leading-[1.05]
                  tracking-[-0.025em]
                  text-white
                  sm:text-[42px]
                  lg:text-[48px]
                "
              >
                Make the moment
                <span className="block italic text-[#E1AEB0]">
                  a little more memorable.
                </span>
              </h2>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-lg
                  text-[13px]
                  leading-6
                  text-white/65
                  sm:text-[14px]
                  sm:leading-7
                "
              >
                Discover thoughtfully curated gifts, beautiful keepsakes and
                special pieces made for moments worth remembering.
              </p>

              {/* CTA */}

              <div className="mt-7">
                <Link
                  to="/shop"
                  className="
                    group/btn
                    inline-flex
                    h-11
                    items-center
                    gap-4
                    rounded-full
                    bg-[#F8F3ED]
                    px-5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#2B211D]
                    transition-all
                    duration-300
                    hover:bg-[#E6C5BA]
                    hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                  "
                >
                  <span>Explore Gifts</span>

                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-[#2B211D]
                      text-white
                      transition-transform
                      duration-300
                      group-hover/btn:translate-x-1
                    "
                  >
                    <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            </div>

            {/* =================================================
                IMAGE
            ================================================== */}

            <div className="relative min-h-[260px] overflow-hidden md:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=85"
                alt="Curated gifts"
                loading="lazy"
                decoding="async"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-[1200ms]
                  ease-out
                  group-hover:scale-[1.045]
                "
              />

              {/* Image overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#27211E]
                  via-[#27211E]/20
                  to-transparent
                  md:from-[#27211E]/80
                  md:via-[#27211E]/10
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/30
                  via-transparent
                  to-transparent
                "
              />

              {/* Floating label */}

              <div
                className="
                  absolute
                  right-5
                  top-5
                  sm:right-7
                  sm:top-7
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/20
                    bg-black/20
                    px-3
                    py-2
                    backdrop-blur-xl
                  "
                >
                  <Sparkles
                    size={12}
                    className="text-[#E5BFAF]"
                    strokeWidth={1.5}
                  />

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white
                    "
                  >
                    Gifter Edit
                  </span>
                </div>
              </div>

              {/* Bottom image caption */}

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  sm:bottom-7
                  sm:left-7
                "
              >
                <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-white/65">
                  Curated with intention
                </p>

                <p className="mt-1 font-serif text-lg text-white">
                  Gifts that say more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default AppNewsletterSocial;
