import React from "react";
import { useStore } from "./StoreLayout";
import { Info, Shield, Award, Users, Target, CheckCircle2 } from "lucide-react";

export default function About() {
  const { business, template } = useStore();

  // If custom template is active, render dynamically
  if (template && template.aboutLayout && template.aboutLayout.length > 0) {
    const theme = template.selectedTheme || {
      colors: { primary: "#4F46E5", secondary: "#818CF8", background: "#F3F4F6", cardBg: "#FFFFFF", textColor: "#1F2937" }
    };

    return (
      <div 
        className="max-w-4xl mx-auto px-6 py-12 w-full transition-all duration-300 min-h-screen text-left space-y-10"
        style={{
          backgroundColor: theme.colors?.background,
          color: theme.colors?.textColor,
          fontFamily: template.selectedFont?.fontFamily || "inherit"
        }}
      >
        {/* Title */}
        <div className="border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2" style={{ color: theme.colors?.textColor }}>
            <Info size={24} style={{ color: theme.colors?.primary }} /> About Us
          </h1>
          <p className="text-xs mt-1 opacity-75">Get to know our values and company mission</p>
        </div>

        <div className="space-y-8">
          {template.aboutLayout.map((sec, idx) => {
            const { type, activeVariant } = sec;

            // 1. STORY BLOCK
            if (type === "company_story") {
              return (
                <div key={sec.id || idx} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-4">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-lg font-black tracking-tight" style={{ color: theme.colors?.textColor }}>Our Journey</h3>
                    <p className="text-xs opacity-80 leading-relaxed font-normal whitespace-pre-line">
                      {business.description ||
                        `Welcome to our store. We are committed to providing our customers with high-quality products and excellent customer service. We take pride in offering curated items across the e-commerce sector.`}
                    </p>
                  </div>
                  <div className="md:col-span-1 border rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 bg-white" style={{ borderColor: `${theme.colors?.primary}20` }}>
                    {business.logo ? (
                      <img src={business.logo} alt={business.businessName} className="h-16 w-auto object-contain rounded-xl" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: theme.colors?.primary }}>
                        {business.businessName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h4 className="font-extrabold text-xs capitalize">{business.businessName}</h4>
                  </div>
                </div>
              );
            }

            // 2. MISSION BLOCK
            if (type === "mission") {
              return (
                <div key={sec.id || idx} className="p-6 rounded-2xl border text-center space-y-3 bg-white" style={{ borderColor: `${theme.colors?.primary}20` }}>
                  <Target className="mx-auto" size={24} style={{ color: theme.colors?.primary }} />
                  <h3 className="text-sm font-black uppercase tracking-wider">Our Corporate Mission</h3>
                  <p className="text-xs opacity-75 max-w-md mx-auto leading-relaxed">
                    To deliver reliable services and high-quality inventory curated directly from certified local vendors.
                  </p>
                </div>
              );
            }

            // 3. WHY CHOOSE US
            if (type === "why_us") {
              return (
                <div key={sec.id || idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div className="p-4 border rounded-xl bg-white space-y-2" style={{ borderColor: `${theme.colors?.primary}10` }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} style={{ color: theme.colors?.primary }} />
                      <h4 className="font-bold text-xs uppercase tracking-wide">Secure Checkout</h4>
                    </div>
                    <p className="text-[11px] opacity-75 leading-relaxed">Safe payment gateways and verified client support protocols.</p>
                  </div>
                  <div className="p-4 border rounded-xl bg-white space-y-2" style={{ borderColor: `${theme.colors?.primary}10` }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} style={{ color: theme.colors?.primary }} />
                      <h4 className="font-bold text-xs uppercase tracking-wide">Direct Delivery</h4>
                    </div>
                    <p className="text-[11px] opacity-75 leading-relaxed">Direct vendor shipment coordination to ensure fast delivery speeds.</p>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  }

  // Classic fallback UI
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full text-left space-y-10">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Info size={24} className="text-indigo-650" /> About Us
        </h1>
        <p className="text-gray-500 text-xs mt-1">Get to know {business.businessName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 border border-gray-100 rounded-3xl p-6 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-4">
          {business.logo ? (
            <img src={business.logo} alt={business.businessName} className="h-20 w-auto object-contain rounded-2xl shadow-sm bg-white p-2" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
              {business.businessName?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-extrabold text-gray-900 capitalize text-base">{business.businessName}</h2>
            {business.tradeName && <p className="text-[10px] text-gray-400 font-bold mt-0.5">T/A {business.tradeName}</p>}
            <span className="inline-block mt-3 bg-indigo-50 border border-indigo-100 text-indigo-650 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
              {business.businessCategory || "Retail Store"}
            </span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Our Story</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal whitespace-pre-line">
              {business.description ||
                `Welcome to ${business.businessName}. We are committed to providing our customers with high-quality products and excellent customer service.`}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Company Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Business Type</span>
                <span className="text-gray-700 capitalize">{business.businessType || "SaaS Merchant"}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Status</span>
                <span className="text-green-600 font-bold capitalize">{business.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
        <div className="space-y-2 border border-gray-100 p-5 rounded-2xl">
          <Shield className="text-indigo-655" size={24} />
          <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Trusted Seller</h4>
          <p className="text-[11px] text-gray-500 leading-normal">
            Verified verification status and secure operations under ILumaa verification standards.
          </p>
        </div>
        <div className="space-y-2 border border-gray-100 p-5 rounded-2xl">
          <Award className="text-indigo-655" size={24} />
          <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Premium Quality</h4>
          <p className="text-[11px] text-gray-500 leading-normal">
            We list authentic merchandise and products verified directly from the vendors.
          </p>
        </div>
        <div className="space-y-2 border border-gray-100 p-5 rounded-2xl">
          <Users className="text-indigo-655" size={24} />
          <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">Customer Centric</h4>
          <p className="text-[11px] text-gray-500 leading-normal">
            Direct storefront communication and support handled with professionalism.
          </p>
        </div>
      </div>
    </div>
  );
}
