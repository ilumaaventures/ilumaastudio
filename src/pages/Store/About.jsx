import React from "react";
import { useStore } from "./StoreContext";
import {
  Store,
  ShieldCheck,
  Truck,
  Headphones,
  Info,
  Shield,
  Award,
  Users,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const { business, template, storeHomePath, theme: layoutTheme } = useStore();

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <div
      className="w-full min-h-screen py-12 px-6 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-12 text-left">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="space-y-1">
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: primaryColor }}
            >
              <Sparkles size={12} /> Our Story & Mission
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: theme.colors?.textColor }}
            >
              About {business?.businessName || "Our Brand"}
            </h1>
            <p className="text-xs opacity-75 font-medium">
              Discover our history, values, and dedication to excellence
            </p>
          </div>

          <Link
            to={`${storeHomePath}/contact`}
            className="text-xs font-black inline-flex items-center gap-1 hover:underline"
            style={{ color: primaryColor }}
          >
            <span>Get in Touch</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Story & Company Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Business Brand Card */}
          <div
            className="md:col-span-1 p-6 sm:p-8 rounded-3xl border border-black/[0.06] flex flex-col items-center justify-center text-center gap-4 shadow-xl"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            {business?.logo ? (
              <img
                src={business.logo}
                alt={business.businessName}
                className="h-20 w-auto object-contain rounded-2xl shadow-xs p-2 bg-white"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-black text-2xl shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {business?.businessName?.charAt(0).toUpperCase() || "S"}
              </div>
            )}

            <div className="space-y-1">
              <h2 className="font-black text-base capitalize tracking-tight">
                {business?.businessName || "Storefront"}
              </h2>
              {business?.tradeName && (
                <p className="text-[10px] opacity-60 font-bold">
                  T/A {business.tradeName}
                </p>
              )}
              <span
                className="inline-block mt-2 font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                {business?.businessCategory || "Premium Store"}
              </span>
            </div>
          </div>

          {/* Story Narrative */}
          <div
            className="md:col-span-2 p-6 sm:p-8 rounded-3xl border border-black/[0.06] space-y-6 shadow-xl"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight">
                Our Journey & Heritage
              </h3>
              <p className="text-xs opacity-80 leading-relaxed font-medium whitespace-pre-line">
                {business?.description ||
                  `Welcome to ${business?.businessName || "our store"}. We are dedicated to providing our community with high-quality, authentic products and exceptional customer experiences. Every item in our catalogue is thoughtfully selected to meet our exacting standards of craftsmanship.`}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-black/[0.06]">
              <h4 className="text-xs font-black uppercase tracking-wider opacity-70">
                Storefront Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="opacity-50 block font-bold text-[10px] uppercase">
                    Business Domain
                  </span>
                  <span className="capitalize">{business?.businessType || "E-Commerce"}</span>
                </div>
                <div>
                  <span className="opacity-50 block font-bold text-[10px] uppercase">
                    Verification
                  </span>
                  <span className="text-emerald-600 font-bold capitalize">
                    {business?.status || "Active & Verified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div
            className="p-6 rounded-3xl border border-black/[0.06] space-y-2.5 shadow-sm transition hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
            >
              <Shield size={22} />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider">
              Trusted Vendor
            </h4>
            <p className="text-[11px] opacity-70 leading-relaxed">
              Certified authentic merchant operating under strict quality control standards.
            </p>
          </div>

          <div
            className="p-6 rounded-3xl border border-black/[0.06] space-y-2.5 shadow-sm transition hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
            >
              <Award size={22} />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider">
              Curated Quality
            </h4>
            <p className="text-[11px] opacity-70 leading-relaxed">
              Every product is vetted for durability, craftsmanship, and customer satisfaction.
            </p>
          </div>

          <div
            className="p-6 rounded-3xl border border-black/[0.06] space-y-2.5 shadow-sm transition hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
            >
              <Users size={22} />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider">
              Customer First
            </h4>
            <p className="text-[11px] opacity-70 leading-relaxed">
              Dedicated assistance, prompt order dispatch, and hassle-free return support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
