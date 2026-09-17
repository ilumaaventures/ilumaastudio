import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import baseApi from "../../api/baseApi";
import * as storeApi from "../../api/storeApi";
import StoreRenderer from "../../templates/StoreRenderer";
import { Store, AlertTriangle, ArrowLeft } from "lucide-react";

export default function SlugStorefrontPage() {
  const params = useParams();
  // Support either :slug or :businessName
  const slug = params.slug || params.businessName || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError("");

        let biz = null;
        let config = null;

        try {
          const [bizRes, configRes] = await Promise.all([
            storeApi.fetchStoreDetails(slug),
            storeApi.fetchStoreConfig(slug).catch(() => null),
          ]);
          biz = bizRes;
          config = configRes;
        } catch (bootErr) {
          // Fallback to legacy composite endpoint
          const res = await baseApi.get(`/storefronts/${encodeURIComponent(slug)}`);
          if (res.data && res.data.success) {
            setStoreData(res.data.data);
            setLoading(false);
            return;
          }
          throw bootErr;
        }

        if (!biz) {
          setError("Failed to load storefront data.");
          setLoading(false);
          return;
        }

        const [prodsRes, catsRes, servsRes, bannersRes, reviewsRes, policiesRes, couponsRes] =
          await Promise.all([
            storeApi.fetchStoreProducts(slug).catch(() => []),
            storeApi.fetchStoreCategories(slug).catch(() => []),
            storeApi.fetchStoreServices(slug).catch(() => []),
            storeApi.fetchStoreBanners(slug).catch(() => []),
            storeApi.fetchStoreReviews(slug).catch(() => []),
            storeApi.fetchStorePolicies(slug).catch(() => []),
            storeApi.fetchStoreCoupons(slug).catch(() => []),
          ]);

        setStoreData({
          business: {
            ...biz,
            name: biz.businessName || biz.name,
            address: biz.address || "",
          },
          storefront: config?.storefront || {
            templateKey: biz.customTemplateKey || "freshmart",
          },
          template: config?.template || null,
          sections: config?.storefront?.sections || [],
          products: Array.isArray(prodsRes) ? prodsRes : prodsRes?.products || [],
          services: Array.isArray(servsRes) ? servsRes : servsRes?.services || [],
          categories: Array.isArray(catsRes) ? catsRes : catsRes?.categories || [],
          banners: Array.isArray(bannersRes) ? bannersRes : bannersRes?.banners || [],
          reviews: Array.isArray(reviewsRes) ? reviewsRes : reviewsRes?.reviews || [],
          policies: Array.isArray(policiesRes) ? policiesRes : policiesRes?.policies || [],
          coupons: Array.isArray(couponsRes) ? couponsRes : couponsRes?.coupons || [],
        });
      } catch (err) {
        console.error("Error loading storefront:", err);
        setError(err.response?.data?.message || "Storefront not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchStorefront();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">
          Loading Storefront...
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Retrieving custom catalog, themes, and business settings
        </p>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Store size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Storefront Not Found
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The storefront <code className="font-mono font-bold text-slate-800">"{decodeURIComponent(slug)}"</code> could not be found or has not published a template yet.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={14} /> Back to Marketplace Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mapCategoryToTemplate = (categoryName = "") => {
    if (!categoryName) return null;
    const cat = categoryName.toLowerCase();
    if (cat.includes("grocer") || cat.includes("supermarket")) return "freshmart";
    if (cat.includes("fashion") || cat.includes("apparel") || cat.includes("cloth")) return "urban-fashion";
    if (cat.includes("tech") || cat.includes("electronic") || cat.includes("gadget") || cat.includes("computer")) return "technova";
    if (cat.includes("beauty") || cat.includes("cosmetic") || cat.includes("skin")) return "glow-beauty";
    if (cat.includes("furnitur") || cat.includes("home decor") || cat.includes("interior")) return "casaliving";
    if (cat.includes("jewel") || cat.includes("diamond") || cat.includes("gem")) return "luxe-jewels";
    if (cat.includes("bag") || cat.includes("leather") || cat.includes("luggage")) return "cuir-bags";
    if (cat.includes("tool") || cat.includes("hardware") || cat.includes("industrial")) return "powerforge-tools";
    if (cat.includes("book") || cat.includes("publish") || cat.includes("author")) return "chapter-books";
    if (cat.includes("food") || cat.includes("gourmet") || cat.includes("delicac")) return "gourmet-food";
    if (cat.includes("flower") || cat.includes("floral") || cat.includes("botan")) return "bloom-flora";
    if (cat.includes("shoe") || cat.includes("sneaker") || cat.includes("footwear")) return "sole-sneakers";
    if (cat.includes("restaurant") || cat.includes("cafe") || cat.includes("bistro") || cat.includes("dining")) return "foodie-bistro";
    if (cat.includes("spa") || cat.includes("salon") || cat.includes("wellness") || cat.includes("massage")) return "zen-spa";
    if (cat.includes("tutor") || cat.includes("educat") || cat.includes("academy") || cat.includes("school")) return "tutor-academy";
    if (cat.includes("repair") || cat.includes("electrician") || cat.includes("plumb") || cat.includes("cleaning")) return "home-service-pro";
    if (cat.includes("fitness") || cat.includes("gym") || cat.includes("crossfit") || cat.includes("train")) return "ironpulse-fitness";
    if (cat.includes("clinic") || cat.includes("health") || cat.includes("doctor") || cat.includes("dental")) return "carepoint-clinic";
    return null;
  };

  const templateKey =
    storeData.template?.key ||
    storeData.template?.templateKey ||
    storeData.storefront?.templateKey ||
    storeData.storefront?.templateId?.templateKey ||
    storeData.business?.customTemplateKey;

  if (!templateKey || storeData.hasTemplate === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
            <Store size={28} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            No Storefront Template Selected
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The business <span className="font-bold text-slate-800">"{storeData.business?.businessName || decodeURIComponent(slug)}"</span> has not selected or published an active storefront template yet.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              to="/store-template"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Browse Template Catalog
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              <ArrowLeft size={13} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StoreRenderer
      templateKey={templateKey}
      data={storeData}
      isPreview={false}
    />
  );
}
