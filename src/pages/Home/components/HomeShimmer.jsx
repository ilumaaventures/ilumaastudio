import React from "react";
import { Sparkles, Flame, Trophy, ShoppingBag, Wrench, Clock } from "lucide-react";

export default function HomeShimmer() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-slate-900 pb-16 space-y-6 sm:space-y-8 select-none animate-fadeIn">
      {/* 1. HERO CAROUSEL BANNER SHIMMER */}
      <section className="pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full h-[340px] sm:h-[390px] md:h-[440px] rounded-3xl overflow-hidden bg-slate-950/95 border border-slate-800/70 p-6 sm:p-10 md:p-12 flex items-center justify-between shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

          {/* Left Content Column */}
          <div className="relative z-10 space-y-4 sm:space-y-5 max-w-xl w-full">
            {/* Badge Pill */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-36 rounded-full bg-slate-800/80 shimmer-placeholder" />
            </div>

            {/* Giant Title Lines */}
            <div className="space-y-2.5">
              <div className="h-8 sm:h-11 md:h-12 w-11/12 rounded-2xl bg-slate-800/90 shimmer-placeholder" />
              <div className="h-8 sm:h-11 md:h-12 w-4/5 rounded-2xl bg-slate-800/90 shimmer-placeholder" />
            </div>

            {/* Subtitle Description */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 sm:h-4 w-full rounded-md bg-slate-800/60 shimmer-placeholder" />
              <div className="h-3.5 sm:h-4 w-3/4 rounded-md bg-slate-800/60 shimmer-placeholder" />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <div className="h-11 sm:h-12 w-40 rounded-2xl bg-slate-800/90 shimmer-placeholder shadow-sm" />
              <div className="h-11 sm:h-12 w-32 rounded-2xl bg-slate-800/60 shimmer-placeholder" />
            </div>
          </div>

          {/* Right Product Spotlight Skeleton (Desktop) */}
          <div className="hidden lg:flex relative z-10 flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-sm w-72 shrink-0 space-y-4">
            <div className="w-56 h-56 rounded-2xl bg-slate-800/90 shimmer-placeholder" />
            <div className="w-full space-y-2">
              <div className="h-4 w-3/4 rounded-md bg-slate-800 shimmer-placeholder" />
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-md bg-slate-800 shimmer-placeholder" />
                <div className="h-4 w-12 rounded-md bg-slate-800/60 shimmer-placeholder" />
              </div>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-8 h-2 rounded-full bg-slate-700/80 shimmer-placeholder" />
            <div className="w-2.5 h-2 rounded-full bg-slate-800 shimmer-placeholder" />
            <div className="w-2.5 h-2 rounded-full bg-slate-800 shimmer-placeholder" />
          </div>
        </div>
      </section>

      {/* 2. FLASH DEALS CAROUSEL SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header with Title & Live Timer Mock */}
        <div className="bg-white border border-rose-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-36 rounded-md bg-slate-200 shimmer-placeholder" />
                <div className="h-4 w-16 rounded-full bg-rose-100 shimmer-placeholder" />
              </div>
              <div className="h-3 w-48 rounded-md bg-slate-100 shimmer-placeholder mt-1.5" />
            </div>
          </div>

          {/* Timer Pills */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-14 rounded-xl bg-slate-100 border border-slate-200/80 shimmer-placeholder" />
            <span className="font-bold text-slate-300">:</span>
            <div className="h-9 w-14 rounded-xl bg-slate-100 border border-slate-200/80 shimmer-placeholder" />
            <span className="font-bold text-slate-300">:</span>
            <div className="h-9 w-14 rounded-xl bg-slate-100 border border-slate-200/80 shimmer-placeholder" />
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[205px] sm:w-[230px] lg:w-[245px] bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-3 shadow-2xs"
            >
              {/* Image with discount tag & heart */}
              <div className="relative aspect-square w-full rounded-xl bg-slate-100 shimmer-placeholder">
                <div className="absolute top-2 left-2 h-5 w-14 rounded-full bg-slate-200 shimmer-placeholder" />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-200 shimmer-placeholder" />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="h-3 w-16 rounded-md bg-slate-100 shimmer-placeholder" />
                <div className="h-4 w-4/5 rounded-md bg-slate-200 shimmer-placeholder" />
                <div className="h-3 w-24 rounded-md bg-slate-100 shimmer-placeholder" />
                <div className="flex items-baseline justify-between pt-1">
                  <div className="h-5 w-20 rounded-md bg-slate-200 shimmer-placeholder" />
                  <div className="h-3.5 w-12 rounded-md bg-slate-100 shimmer-placeholder" />
                </div>
                {/* Add to Cart Button */}
                <div className="h-9 w-full rounded-xl bg-slate-200 shimmer-placeholder pt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MARKETPLACE HUB DUAL CARDS SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#eef2ff] border border-indigo-100 rounded-3xl p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-2xl bg-indigo-200 shimmer-placeholder shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-44 rounded-md bg-indigo-200/80 shimmer-placeholder" />
                <div className="h-3 w-56 rounded-md bg-indigo-200/50 shimmer-placeholder" />
              </div>
            </div>
          </div>

          <div className="bg-[#e0f2fe] border border-sky-100 rounded-3xl p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-2xl bg-sky-200 shimmer-placeholder shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-44 rounded-md bg-sky-200/80 shimmer-placeholder" />
                <div className="h-3 w-56 rounded-md bg-sky-200/50 shimmer-placeholder" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER STRIP SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-28 sm:h-36 rounded-3xl bg-slate-200/80 shimmer-placeholder shadow-xs" />
      </section>

      {/* 5. BEST SELLING PRODUCTS GRID SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Title and Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Trophy size={16} />
              </div>
              <div className="h-6 w-48 rounded-md bg-slate-200 shimmer-placeholder" />
            </div>
            <div className="h-3.5 w-64 rounded-md bg-slate-100 shimmer-placeholder" />
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {["All", "Audio & Electronics", "Luxury Hampers", "Fashion", "Home Living"].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-full bg-slate-200/80 shimmer-placeholder shrink-0"
              />
            ))}
          </div>
        </div>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-3 shadow-2xs"
            >
              <div className="aspect-square w-full rounded-xl bg-slate-100 shimmer-placeholder relative">
                <div className="absolute top-2 left-2 h-4 w-12 rounded-full bg-slate-200 shimmer-placeholder" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-1/3 rounded-md bg-slate-100 shimmer-placeholder" />
                <div className="h-4 w-4/5 rounded-md bg-slate-200 shimmer-placeholder" />
                <div className="h-3 w-1/2 rounded-md bg-slate-100 shimmer-placeholder" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-5 w-2/5 rounded-md bg-slate-200 shimmer-placeholder" />
                  <div className="h-8 w-20 rounded-xl bg-slate-200 shimmer-placeholder" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MEGA SALE DUAL BANNER SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-40 sm:h-48 rounded-3xl bg-slate-200 shimmer-placeholder p-6 flex flex-col justify-between" />
          <div className="h-40 sm:h-48 rounded-3xl bg-slate-200 shimmer-placeholder p-6 flex flex-col justify-between" />
        </div>
      </section>

      {/* 7. TOP BRANDS / STOREFRONTS SHIMMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded-md bg-slate-200 shimmer-placeholder" />
          <div className="h-4 w-20 rounded-md bg-slate-100 shimmer-placeholder" />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xs flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-slate-100 shimmer-placeholder" />
              </div>
              <div className="h-3 w-14 rounded-md bg-slate-200 shimmer-placeholder" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
