import React, { useState, useEffect } from "react";
import { useParams, Outlet, Link, useLocation } from "react-router-dom";
import baseApi from "../../api/baseApi";
import Navbar from "../../Components/store/Navbar";
import Footer from "../../Components/store/Footer";
import { Store, AlertTriangle, ArrowLeft, ArrowRight, X, AlertCircle } from "lucide-react";
import customStoresRegistry from "./registry";
import { StoreContext, useStore } from "./StoreContext";

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

export default function StoreLayout() {
  const { businessName } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [banners, setBanners] = useState([]);
  const [slides, setSlides] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeNotFound, setStoreNotFound] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!businessName) return;
      const decodedName = decodeURIComponent(businessName);

      try {
        setLoading(true);
        setError("");
        setStoreNotFound(false);

        // 1. Fetch Store Details
        const storeRes = await baseApi.get(
          `/public/store/${encodeURIComponent(decodedName)}`,
        );
        const bizData = storeRes.data;
        setBusiness(bizData);

        // Fetch storefront custom visual template if exists
        try {
          const templateRes = await baseApi.get(
            `/business/templates/public/${bizData._id}`,
          );
          if (templateRes.data && templateRes.data.success) {
            setTemplate(templateRes.data.data);
          }
        } catch (templateErr) {
          console.log(
            "No published store templates found, fallback to classic default styling.",
          );
        }

        // 2. Fetch associated products, categories, vendors, banners, slides, policies in parallel
        const [productsRes, categoriesRes, vendorsRes, bannersRes, slidesRes, policiesRes] =
          await Promise.all([
            baseApi
              .get(`/public/store/${encodeURIComponent(decodedName)}/products`)
              .catch(() => ({ data: [] })),
            baseApi
              .get(`/public/store/${encodeURIComponent(decodedName)}/categories`, {
                params: { businessType: "E-Commerce" },
              })
              .catch(() => ({ data: [] })),
            baseApi
              .get(`/public/store/${encodeURIComponent(decodedName)}/vendors`)
              .catch(() => ({ data: [] })),
            baseApi
              .get("/public/banners", {
                params: { businessId: bizData._id },
              })
              .catch(() =>
                baseApi
                  .get(`/public/store/${encodeURIComponent(decodedName)}/banners`)
                  .catch(() => ({ data: { banners: [] } })),
              ),
            baseApi
              .get(`/marketing/public/slides/${bizData._id}`)
              .catch(() => ({ data: [] })),
            baseApi
              .get("/business-policies/public", {
                params: { businessId: bizData._id },
              })
              .catch(() => ({ data: { policies: [] } })),
          ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
        );
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : []);

        const extractedBanners =
          bannersRes.data?.banners ||
          (Array.isArray(bannersRes.data) ? bannersRes.data : []);
        setBanners(extractedBanners);

        const extractedSlides = Array.isArray(slidesRes.data)
          ? slidesRes.data
          : slidesRes.data?.data || [];
        setSlides(extractedSlides);

        const extractedPolicies = Array.isArray(policiesRes.data?.policies)
          ? policiesRes.data.policies
          : Array.isArray(policiesRes.data)
            ? policiesRes.data
            : [];
        setPolicies(extractedPolicies);
      } catch (err) {
        console.error("Error loading store data:", err);
        if (err.response?.status === 404) {
          setStoreNotFound(true);
        } else {
          setError(
            err.response?.data?.message || "Failed to load storefront data",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
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

  // Error State
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
  const templateKey =
    business?.customTemplateKey ||
    (business?.businessName ? business.businessName.toLowerCase().replace(/[\s-]/g, "") : "") ||
    (business?.subdomain ? business.subdomain.toLowerCase().replace(/[\s-]/g, "") : "") ||
    normalizedName;

  const CustomNavbar =
    customStoresRegistry[templateKey]?.Navbar ||
    customStoresRegistry[normalizedName]?.Navbar;
  const CustomFooter =
    customStoresRegistry[templateKey]?.Footer ||
    customStoresRegistry[normalizedName]?.Footer;

  const storeSlug = businessName || business?.subdomain || business?.slug || business?.businessName || "";
  const storeHomePath = storeSlug ? `/${encodeURIComponent(storeSlug)}` : "";

  const theme = template?.selectedTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

  return (
    <StoreContext.Provider
      value={{
        business,
        products,
        categories,
        vendors,
        banners,
        slides,
        policies,
        template,
        theme,
        storeSlug,
        storeHomePath,
      }}
    >
      <div
        className="min-h-screen flex flex-col font-sans transition-colors duration-300"
        style={{
          backgroundColor: theme.colors?.background || "#F8FAFC",
          color: theme.colors?.textColor || "#0F172A",
          fontFamily: template?.selectedFont?.fontFamily || "inherit",
        }}
      >
        <StoreAnnouncementBar />
        {CustomNavbar ? <CustomNavbar /> : <Navbar />}
        <main
          className="flex-1 flex flex-col transition-colors duration-300"
          style={{
            backgroundColor: theme.colors?.background || "#F8FAFC",
          }}
        >
          <Outlet />
        </main>
        {CustomFooter ? <CustomFooter /> : <Footer />}
      </div>
    </StoreContext.Provider>
  );
}
