import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="shrink-0 w-[185px] sm:w-[215px] lg:w-[230px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 space-y-3 shadow-xs">
      <div className="aspect-[0.88] w-full rounded-xl shimmer-placeholder" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded-md shimmer-placeholder" />
        <div className="h-4 w-3/4 rounded-md shimmer-placeholder" />
        <div className="h-3 w-1/2 rounded-md shimmer-placeholder" />
        <div className="h-4 w-2/5 rounded-md shimmer-placeholder pt-1" />
        <div className="h-8 w-full rounded-xl shimmer-placeholder mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="shrink-0 w-[240px] sm:w-[270px] lg:w-[290px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 space-y-3 shadow-xs">
      <div className="h-[170px] sm:h-[185px] w-full rounded-xl shimmer-placeholder" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded-md shimmer-placeholder" />
        <div className="h-4 w-4/5 rounded-md shimmer-placeholder" />
        <div className="h-3 w-1/2 rounded-md shimmer-placeholder" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-2/5 rounded-md shimmer-placeholder" />
          <div className="h-8 w-24 rounded-xl shimmer-placeholder" />
        </div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 4 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
      {Array.from({ length: count }).map((_, idx) => (
        <ServiceCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4 shadow-xs">
      <div className="h-44 sm:h-48 w-full rounded-2xl shimmer-placeholder" />
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="h-5 w-1/2 rounded-md shimmer-placeholder" />
          <div className="h-4 w-12 rounded-md shimmer-placeholder" />
        </div>
        <div className="h-3 w-1/3 rounded-md shimmer-placeholder" />
        <div className="h-3 w-2/5 rounded-md shimmer-placeholder" />
        <div className="h-9 w-full rounded-xl shimmer-placeholder mt-3" />
      </div>
    </div>
  );
}

export function StoreGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <StoreCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function CategoryPillSkeleton({ count = 8 }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-16 h-16 rounded-2xl shimmer-placeholder" />
          <div className="h-3 w-12 rounded-md shimmer-placeholder" />
        </div>
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
      <div className="aspect-[1.2] w-full rounded-xl shimmer-placeholder" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded-md shimmer-placeholder" />
        <div className="h-3 w-full rounded-md shimmer-placeholder" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CategoryCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="h-4 w-48 rounded-md shimmer-placeholder" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-xl shimmer-placeholder" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-16 h-16 rounded-lg shimmer-placeholder shrink-0" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="h-3 w-24 rounded-md shimmer-placeholder" />
          <div className="h-8 w-3/4 rounded-md shimmer-placeholder" />
          <div className="h-4 w-1/3 rounded-md shimmer-placeholder" />
          <div className="h-10 w-1/2 rounded-md shimmer-placeholder pt-2" />
          <div className="h-20 w-full rounded-xl shimmer-placeholder" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-40 rounded-xl shimmer-placeholder" />
            <div className="h-12 w-40 rounded-xl shimmer-placeholder" />
          </div>
        </div>
      </div>
    </div>
  );
}
