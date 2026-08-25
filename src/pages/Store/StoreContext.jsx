import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

export const StoreContext = createContext({
  business: null,
  products: [],
  categories: [],
  vendors: [],
  banners: [],
  slides: [],
  template: null,
  storeSlug: "",
  storeHomePath: "",
});

export const useStore = () => {
  const context = useContext(StoreContext);
  let routeBusinessName = "";
  try {
    const params = useParams();
    routeBusinessName = params?.businessName || "";
  } catch (e) {
    // In case called outside Router
  }

  const rawSlug =
    routeBusinessName ||
    context?.storeSlug ||
    context?.business?.subdomain ||
    context?.business?.slugInfo?.slugName ||
    context?.business?.slug ||
    context?.business?.businessName ||
    "";

  const storeSlug = rawSlug
    ? encodeURIComponent(rawSlug).replace(/%20/g, "+") === rawSlug
      ? rawSlug
      : encodeURIComponent(rawSlug)
    : "";
  const storeHomePath = storeSlug ? `/${storeSlug}` : "";

  const allBanners = Array.isArray(context?.banners) ? context.banners : [];
  const heroBanners = allBanners.filter((b) => b.type === "hero");
  const promoBanners = allBanners.filter(
    (b) => b.type === "promotion" || b.type === "flashSale" || b.type === "occasion",
  );
  const offerBanners = allBanners.filter(
    (b) => b.type === "flashSale" || b.type === "promotion" || b.type === "announcement" || b.type === "occasion",
  );
  const announcementBanners = allBanners.filter(
    (b) => b.type === "announcement" || b.type === "flashSale",
  );

  if (!context) {
    return {
      business: null,
      products: [],
      categories: [],
      vendors: [],
      banners: [],
      slides: [],
      heroBanners: [],
      promoBanners: [],
      offerBanners: [],
      announcementBanners: [],
      template: null,
      storeSlug,
      storeHomePath,
    };
  }

  return {
    ...context,
    banners: allBanners,
    heroBanners,
    promoBanners,
    offerBanners,
    announcementBanners,
    storeSlug: context.storeSlug || storeSlug,
    storeHomePath: context.storeHomePath || storeHomePath,
  };
};

export default StoreContext;
