import React from "react";
import { Link } from "react-router-dom";
import { Store, AlertTriangle, ArrowLeft } from "lucide-react";
import templateRegistry from "./registry";
import formatAddress from "../utils/formatAddress";
import { getProductImage, getAllProductImages } from "../utils/productImage";

function StoreNotAvailable({ templateKey }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Template Not Available
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested template <code className="font-mono font-bold text-slate-800">"{templateKey || "unknown"}"</code> is not registered in the ILUMA Studio registry or is currently undergoing maintenance.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
          >
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StoreRenderer({ templateKey = "freshmart", data = {}, isPreview = false }) {
  const normalizedKey = (templateKey || "freshmart").toLowerCase().trim();
  const entry = templateRegistry[normalizedKey] || templateRegistry["freshmart"];

  if (!entry || !entry.component) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 text-slate-800">
        <div className="text-center max-w-md">
          <p className="text-sm font-semibold text-rose-500 mb-1">Template Not Found</p>
          <h2 className="text-xl font-bold mb-2">"{templateKey}" is not registered</h2>
          <p className="text-xs text-slate-500">
            Please select an available template from the ILUMA Storefront Catalog.
          </p>
        </div>
      </div>
    );
  }

  const TemplateComponent = entry.component;

  // Merge default theme with real business customizations
  const mergedCustomization = {
    ...(entry.defaultTheme || {}),
    ...(data.customization || {}),
    colors: {
      ...(entry.defaultTheme?.colors || {}),
      ...(data.customization?.colors || {}),
    },
    fonts: {
      ...(entry.defaultTheme?.fonts || {}),
      ...(data.customization?.fonts || {}),
    },
    heroHeadline: data.customization?.heroHeadline || data.business?.heroHeadline || "",
    heroSubtitle: data.customization?.heroSubtitle || data.business?.heroSubtitle || "",
    heroBanner: data.customization?.heroBanner || data.business?.heroBanner || "",
    customContent: data.customization?.customContent || {},
    sections: data.customization?.sections || entry.supportedSections || [],
  };

  const rawBiz = data.business || entry.demoData?.business || {};
  const sanitizedBusiness = {
    ...rawBiz,
    address: formatAddress(rawBiz.address || rawBiz.registered_business_address),
  };

  const rawProds = data.products?.length ? data.products : entry.demoData?.products || [];
  const sanitizedProducts = rawProds.map((p) => {
    const defaultImg = typeof p.image === "string" && p.image ? p.image : undefined;
    return {
      ...p,
      image: getProductImage(p, defaultImg),
      images: getAllProductImages(p),
    };
  });

  const rawServices = data.services?.length ? data.services : entry.demoData?.services || [];
  const sanitizedServices = rawServices.map((s) => {
    const defaultImg = typeof s.image === "string" && s.image ? s.image : undefined;
    return {
      ...s,
      image: getProductImage(s, defaultImg),
      images: getAllProductImages(s),
    };
  });

  return (
    <TemplateComponent
      business={sanitizedBusiness}
      products={sanitizedProducts}
      services={sanitizedServices}
      categories={data.categories?.length ? data.categories : entry.demoData?.categories || []}
      offers={data.offers?.length ? data.offers : entry.demoData?.offers || []}
      coupons={data.coupons?.length ? data.coupons : entry.demoData?.coupons || []}
      reviews={data.reviews?.length ? data.reviews : entry.demoData?.reviews || []}
      settings={data.settings || {}}
      customization={mergedCustomization}
      isPreview={isPreview}
    />
  );
}
