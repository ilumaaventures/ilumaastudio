import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, PackageCheck, AlertCircle, ChevronRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Shipping Info & Policies</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Truck size={13} />
            Nationwide Logistics
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Shipping & Delivery Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            We are dedicated to delivering your orders swiftly, securely, and seamlessly across India. Find complete details about dispatch timelines, shipping rates, courier partners, and tracking.
          </p>
        </div>

        {/* Highlight Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Fast 24-48h Dispatch</h3>
            <p className="text-xs text-slate-500">Items are packed and verified within 1-2 business days.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">3-5 Days Delivery</h3>
            <p className="text-xs text-slate-500">Standard ground and air transit across 25,000+ PIN codes.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PackageCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Live SMS & Courier Tracking</h3>
            <p className="text-xs text-slate-500">Real-time status notifications at every delivery milestone.</p>
          </div>
        </div>

        {/* Shipping Policies & FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#2563eb]" />
              1. Delivery Coverage & Serviceable PIN Codes
            </h2>
            <p>
              ILumaaStudio delivers to most urban and regional locations throughout India. Before placing an order, you can check delivery eligibility and expected timelines for your specific PIN code directly on any product details page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Truck size={18} className="text-[#2563eb]" />
              2. Shipping Charges & Free Delivery Threshold
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Standard Orders over ₹999:</strong> Free Delivery on eligible retail items.</li>
              <li><strong>Orders under ₹999:</strong> Flat nominal shipping fee of ₹49 – ₹99 based on package weight and distance.</li>
              <li><strong>Express Delivery (Metros):</strong> Expedited next-day or 2-day delivery available for select serviceable hubs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <PackageCheck size={18} className="text-[#2563eb]" />
              3. Courier Partners & Tracking
            </h2>
            <p>
              We partner with India's premier logistics carriers (including Blue Dart, Delhivery, DTDC, and Shadowfax). Once dispatched, you will receive a tracking link via SMS and email. You can also monitor your live package status anytime via our <Link to="/track-order" className="text-[#2563eb] font-bold hover:underline">Track Order page</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-[#2563eb]" />
              4. Damaged Packages or Delivery Discrepancies
            </h2>
            <p>
              If your package appears visibly tampered with or damaged upon arrival, we advise taking photos before unboxing and refusing receipt or reporting the issue to our customer support within 48 hours for immediate replacement.
            </p>
          </section>

          {/* Track order CTA */}
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">Already Have an Order Number?</h4>
              <p className="text-xs text-slate-500">Track your ongoing shipment status with one click.</p>
            </div>
            <Link
              to="/track-order"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0"
            >
              Track Your Shipment
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
