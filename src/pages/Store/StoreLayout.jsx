import React, { useState, useEffect, useCallback } from "react";
import { useParams, Outlet, Link } from "react-router-dom";
import baseApi from "../../api/baseApi";
import * as storeApi from "../../api/storeApi";
import Navbar from "../../Components/store/Navbar";
import Footer from "../../Components/store/Footer";
import { Store, AlertTriangle, ArrowLeft, ArrowRight, X, AlertCircle, LayoutTemplate } from "lucide-react";
import customStoresRegistry from "./registry";
import { StoreContext, useStore } from "./StoreContext";
import templateRegistry from "../../templates/registry";
import StoreRenderer from "../../templates/StoreRenderer";
import formatAddress from "../../utils/formatAddress";
import { getTenantSubdomain } from "../../utils/tenant";

export { StoreContext, useStore };

function StoreAnnouncementBar() {
  const { banners, announcementBanners, storeHomePath } = useStore();
  const [dismissed, setDismissed] = useState(false);

  const activeAnnouncement =
    (announcementBanners && announcementBanners.length > 0 ? announcementBanners[0] : null) ||
    banners?.find((b) => b.type === "announcement" || b.type === "flashSale");

  if (dismissed || !activeAnnouncement) return null;

  const targetLink =
    activeAnnouncement.targetUrl ||
    (activeAnnouncement.targetId
      ? `${storeHomePath}/product/${typeof activeAnnouncement.targetId === "object" ? activeAnnouncement.targetId._id : activeAnnouncement.targetId}`
      : `${storeHomePath}/products`);

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white text-xs px-4 py-2 relative z-50 border-b border-indigo-900/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          {activeAnnouncement.subtitle && (
            <span className="font-extrabold text-[10px] uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
              ⚡ {activeAnnouncement.subtitle}
            </span>
          )}
          <span className="font-bold">{activeAnnouncement.title}</span>
          {activeAnnouncement.description && (
            <span className="text-slate-300 hidden md:inline text-[11px]">
              — {activeAnnouncement.description}
            </span>
          )}
          <Link
            to={targetLink}
            className="font-black text-cyan-400 hover:text-cyan-300 underline ml-1.5 inline-flex items-center gap-0.5"
          >
            <span>{activeAnnouncement.buttonText || "Claim Now"}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

const normalizeCatalogItem = (item) => {
  if (!item || typeof item !== "object") return item;
  const catName =
    typeof item.category === "object" && item.category !== null
      ? item.category.name || item.category.title || ""
      : typeof item.category === "string" && !/^[0-9a-fA-F]{24}$/.test(item.category)
        ? item.category
        : item.categoryName || "";

  const resolvedCat = catName || "General";

  return {
    ...item,
    category: resolvedCat,
    categoryName: resolvedCat,
    categoryObj: typeof item.category === "object" && item.category !== null ? item.category : { name: resolvedCat },
  };
};

export default function StoreLayout() {
  const { businessName: paramBusinessName } = useParams();
  const tenantSubdomain = getTenantSubdomain();
  const businessName = paramBusinessName || tenantSubdomain || "";

  const [business, setBusiness] = useState(null);
  const [slugInfo, setSlugInfo] = useState(null);
  const [hasTemplate, setHasTemplate] = useState(true);
  const [template, setTemplate] = useState(null);
  const [storefront, setStorefront] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [banners, setBanners] = useState([]);
  const [slides, setSlides] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [error, setError] = useState("");
  const [storeNotFound, setStoreNotFound] = useState(false);

  const fetchStoreData = useCallback(async () => {
    // If neither path param nor host subdomain is detected, mark not found
    if (!businessName) {
      setStoreNotFound(true);
      setLoading(false);
      return;
    }
    const decodedName = decodeURIComponent(businessName).trim();

    const RESERVED_STORE_NAMES = [
      "cart",
      "wishlist",
      "checkout",
      "shop",
      "login",
      "register",
      "products",
      "categories",
      "services",
      "about",
      "contact",
      "compare",
      "help",
      "offers",
    ];
    if (RESERVED_STORE_NAMES.includes(decodedName.toLowerCase())) {
      setStoreNotFound(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStoreNotFound(false);

      // Phase 1: Modular Store Bootstrap (Store Details + Storefront Config)
      let storeDetails = null;
      let storeConfig = null;

      try {
        const [detailsRes, configRes] = await Promise.all([
          storeApi.fetchStoreDetails(decodedName),
          storeApi.fetchStoreConfig(decodedName).catch(() => null),
        ]);
        storeDetails = detailsRes;
        storeConfig = configRes;
      } catch (bootErr) {
        console.warn("Direct modular bootstrap failed, checking fallback:", bootErr);
        if (bootErr.response?.status === 404) {
          setStoreNotFound(true);
          setLoading(false);
          return;
        } else if (bootErr.response?.status === 403) {
          setError(bootErr.response?.data?.message || "Storefront is disabled or inaccessible.");
          setLoading(false);
          return;
        }

        // Fallback to legacy composite endpoint if modular endpoints are unreachable
        const sfRes = await baseApi.get(`/storefronts/${encodeURIComponent(decodedName)}`);
        if (sfRes.data?.success && sfRes.data?.data) {
          const data = sfRes.data.data;
          setBusiness(data.business);
          setSlugInfo(data.slugInfo || null);
          setStorefront(data.storefront || null);
          setTemplate(data.template || null);
          setHasTemplate(Boolean(data.hasTemplate && data.template));
          setProducts(Array.isArray(data.products) ? data.products.map(normalizeCatalogItem) : []);
          setServices(Array.isArray(data.services) ? data.services.map(normalizeCatalogItem) : []);
          setCategories(Array.isArray(data.categories) ? data.categories : []);
          setBanners(Array.isArray(data.banners) ? data.banners : []);
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          setPolicies(Array.isArray(data.policies) ? data.policies : []);
          setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
          setLoading(false);
          return;
        }
      }

      if (!storeDetails) {
        setStoreNotFound(true);
        setLoading(false);
        return;
      }

      // Assign Bootstrap State
      setBusiness(storeDetails);
      setSlugInfo(storeConfig?.slugInfo || storeDetails?.slugInfo || null);
      setStorefront(storeConfig?.storefront || null);
      setTemplate(storeConfig?.template || null);
      setHasTemplate(Boolean(storeConfig?.hasTemplate));

      // Phase 2: Dedicated Feature-Specific Parallel Fetching
      const [prodsRes, catsRes, servsRes, bannersRes, reviewsRes, policiesRes, couponsRes] =
        await Promise.all([
          storeApi.fetchStoreProducts(decodedName).catch(() => []),
          storeApi.fetchStoreCategories(decodedName).catch(() => []),
          storeApi.fetchStoreServices(decodedName).catch(() => []),
          storeApi.fetchStoreBanners(decodedName).catch(() => []),
          storeApi.fetchStoreReviews(decodedName).catch(() => []),
          storeApi.fetchStorePolicies(decodedName).catch(() => []),
          storeApi.fetchStoreCoupons(decodedName).catch(() => []),
        ]);

      const rawProds = Array.isArray(prodsRes) ? prodsRes : prodsRes?.products || [];
      const rawCats = Array.isArray(catsRes) ? catsRes : catsRes?.categories || [];
      const rawServs = Array.isArray(servsRes) ? servsRes : servsRes?.services || [];
      const rawBanners = Array.isArray(bannersRes) ? bannersRes : bannersRes?.banners || [];
      const rawReviews = Array.isArray(reviewsRes) ? reviewsRes : reviewsRes?.reviews || [];
      const rawPolicies = Array.isArray(policiesRes) ? policiesRes : policiesRes?.policies || [];
      const rawCoupons = Array.isArray(couponsRes) ? couponsRes : couponsRes?.coupons || [];

      setProducts(rawProds.map(normalizeCatalogItem));
      setCategories(rawCats);
      setServices(rawServs.map(normalizeCatalogItem));
      setBanners(rawBanners);
      setReviews(rawReviews);
      setPolicies(rawPolicies);
      setCoupons(rawCoupons);
    } catch (err) {
      console.error("Error loading storefront:", err);
      if (err.response?.status === 404) {
        setStoreNotFound(true);
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.message || "Storefront is disabled or inaccessible.");
      } else {
        setError(err.response?.data?.message || "Failed to load storefront data");
      }
    } finally {
      setLoading(false);
    }
  }, [businessName]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Feature refetch handlers
  const refetchProducts = useCallback(async (params = {}) => {
    if (!businessName) return;
    const decodedName = decodeURIComponent(businessName).trim();
    try {
      setIsProductsLoading(true);
      const res = await storeApi.fetchStoreProducts(decodedName, params);
      const list = Array.isArray(res) ? res : res?.products || [];
      setProducts(list.map(normalizeCatalogItem));
    } catch (err) {
      console.warn("Failed to refetch products:", err);
    } finally {
      setIsProductsLoading(false);
    }
  }, [businessName]);

  const refetchReviews = useCallback(async () => {
    if (!businessName) return;
    const decodedName = decodeURIComponent(businessName).trim();
    try {
      const res = await storeApi.fetchStoreReviews(decodedName);
      const list = Array.isArray(res) ? res : res?.reviews || [];
      setReviews(list);
    } catch (err) {
      console.warn("Failed to refetch reviews:", err);
    }
  }, [businessName]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6">
        <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-gray-800 font-bold text-base">
          Opening Storefront...
        </h2>
        <p className="text-gray-400 text-xs mt-1 font-medium">
          Loading custom catalog and business preferences
        </p>
      </div>
    );
  }

  // 404 State
  if (storeNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Store size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Store Not Found
          </h2>
          <p className="text-gray-500 text-xs leading-relaxed">
            The store you are trying to visit ("{decodeURIComponent(businessName || "")}") does not exist or may have been renamed.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={14} /> Back to ILumaa Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error State (Disabled or Inactive)
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Unable to Load Store
          </h2>
          <p className="text-gray-500 text-xs">{error}</p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={14} /> Back to ILumaa Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const normalizedName = businessName
    ? businessName.toLowerCase().replace(/[\s-]/g, "")
    : "";

  // ================= 1. GIFTER & STARLINGTALES (PRESERVED 100%) =================
  const isGifterOrStarling =
    normalizedName === "gifter" ||
    normalizedName === "starlingtales" ||
    Boolean(customStoresRegistry[normalizedName]);

  const isSubdomainMode = Boolean(tenantSubdomain && !paramBusinessName);
  const storeSlug = businessName || business?.subdomain || business?.slug || business?.businessName || "";
  const storeHomePath = isSubdomainMode ? "" : (storeSlug ? `/${encodeURIComponent(storeSlug)}` : "");

  const contextValue = {
    business,
    products,
    services,
    categories,
    vendors,
    banners,
    slides,
    policies,
    reviews,
    coupons,
    template,
    storefront,
    slugInfo,
    storeSlug,
    storeHomePath,
    loading,
    isProductsLoading,
    refetchProducts,
    refetchReviews,
    refetchStore: fetchStoreData,
  };

  if (isGifterOrStarling) {
    const CustomNavbar = customStoresRegistry[normalizedName]?.Navbar;
    const CustomFooter = customStoresRegistry[normalizedName]?.Footer;

    return (
      <StoreContext.Provider value={contextValue}>
        <div className="min-h-screen flex flex-col font-sans">
          <StoreAnnouncementBar />
          {CustomNavbar ? <CustomNavbar /> : <Navbar />}
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
          {CustomFooter ? <CustomFooter /> : <Footer />}
        </div>
      </StoreContext.Provider>
    );
  }

  // ================= 2. NO TEMPLATE SELECTED: DO NOT SET DEFAULT TEMPLATE =================
  if (!hasTemplate || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
            <LayoutTemplate size={28} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            No Storefront Template Selected
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The business <span className="font-bold text-slate-800">"{business?.businessName || businessName}"</span> has not selected or published an active storefront template yet.
          </p>
          <p className="text-[11px] text-slate-400">
            Store routing type: <code className="font-mono font-bold text-indigo-600">{slugInfo?.slugType || "path"}</code>
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

  // ================= 3. RENDER THE BUSINESS'S SELECTED TEMPLATE =================
  const resolvedTemplateKey =
    template?.key ||
    template?.templateKey ||
    storefront?.templateKey ||
    business?.customTemplateKey;

  const normalizedKey = (resolvedTemplateKey || "").toLowerCase().trim();
  const templateMeta = templateRegistry[normalizedKey] || templateRegistry["freshmart"];

  const resolvedSections =
    storefront?.sections ||
    storefront?.customization?.sections ||
    template?.supportedSections ||
    [];

  const storeCustomization = {
    ...(templateMeta?.defaultTheme || {}),
    ...(storefront?.customization || template?.customization || {}),
    sections: resolvedSections,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      <div className="min-h-screen w-full font-sans">
        <StoreRenderer
          templateKey={templateMeta.key}
          data={{
            business: {
              ...business,
              name: business?.businessName || business?.name,
              address: formatAddress(business?.address || business?.registered_business_address),
            },
            storefront: {
              ...storefront,
              sections: resolvedSections,
            },
            sections: resolvedSections,
            products: products || [],
            services: services || [],
            categories: categories || [],
            banners: banners || [],
            reviews: reviews || [],
            policies: policies || [],
            coupons: coupons || [],
            customization: storeCustomization,
          }}
        />
      </div>
    </StoreContext.Provider>
  );
}
