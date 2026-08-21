import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams, Outlet, Link, useLocation } from "react-router-dom";
import baseApi from "../../api/baseApi";
import Navbar from "../../Components/store/Navbar";
import Footer from "../../Components/store/Footer";
import { Store, AlertTriangle, ArrowLeft } from "lucide-react";
import customStoresRegistry from "./registry";
import { getTenantSubdomain } from "../../utils/tenant";

const StoreContext = createContext(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export default function StoreLayout() {
  const { businessName } = useParams();
  const activeTenant = businessName || getTenantSubdomain();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeNotFound, setStoreNotFound] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!activeTenant) return;
      const decodedName = decodeURIComponent(activeTenant);

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

        // 2. Fetch associated products, categories, vendors in parallel
        const [productsRes, categoriesRes, vendorsRes] = await Promise.all([
          baseApi.get(
            `/public/store/${encodeURIComponent(decodedName)}/products`,
          ),
          baseApi.get(
            `/public/store/${encodeURIComponent(decodedName)}/categories`,
            { params: { businessType: "E-Commerce" } },
          ),
          baseApi.get(
            `/public/store/${encodeURIComponent(decodedName)}/vendors`,
          ),
        ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
        );
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : []);
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
  }, [activeTenant]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-semibold text-sm">
            Opening storefront...
          </p>
        </div>
      </div>
    );
  }

  // Beautiful 404 Page (Business does not exist)
  if (storeNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Store size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Storefront Not Found
            </h1>
            <p className="text-gray-500 text-xs leading-relaxed">
              We couldn't find a storefront registered under the name{" "}
              <span className="font-bold text-indigo-600">
                "{decodeURIComponent(activeTenant || "")}"
              </span>
              .
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-sm"
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white border border-rose-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Access Restricted
            </h1>
            <p className="text-gray-500 text-xs leading-relaxed">{error}</p>
          </div>
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

  const normalizedName = activeTenant
    ? activeTenant.toLowerCase().replace(/[\s-]/g, "")
    : "";
  const CustomNavbar = customStoresRegistry[normalizedName]?.Navbar;
  const CustomFooter = customStoresRegistry[normalizedName]?.Footer;

  return (
    <StoreContext.Provider
      value={{ business, products, categories, vendors, template }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {CustomNavbar ? <CustomNavbar /> : <Navbar />}
        <main className="flex-1 flex flex-col bg-white">
          <Outlet />
        </main>
        {CustomFooter ? <CustomFooter /> : <Footer />}
      </div>
    </StoreContext.Provider>
  );
}
