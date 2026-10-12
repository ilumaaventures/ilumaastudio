import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Clock,
  MapPin,
  PackageCheck,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-10 font-sans text-slate-800 antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">
            Shipping Info & Delivery Policy
          </span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Truck size={13} />
            Nationwide Logistics & 3PL Standards
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Shipping & Delivery Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            We are dedicated to delivering your orders swiftly, securely, and
            seamlessly across India. Find complete details about dispatch SLAs,
            real-time courier rates, verified logistics partners, and tracking.
          </p>
        </div>

        {/* Highlight Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
              <Clock size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Fast 24-48h Dispatch
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Items are carefully verified, packed in tamper-proof mailers, and
              dispatched within 1-2 business days.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              3-5 Days Nationwide Delivery
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Optimized ground and air transit coverage servicing 25,000+ PIN
              codes across metro and regional India.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <PackageCheck size={22} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Live Courier Tracking
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated SMS, WhatsApp, and email alerts updated in real time at
              every parcel transit milestone.
            </p>
          </div>
        </div>

        {/* 12-Column Two-Column Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Quick Track & Courier Partners */}
          <div className="lg:col-span-4 space-y-6 sticky top-24 self-start">
            {/* Track Shipment Launchpad */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
                  <Search size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Track Existing Shipment
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live transit telemetry
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Already placed an order? Enter your order or airway bill (AWB)
                number to check real-time courier coordinates.
              </p>
              <Link
                to="/track-order"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Track Your Package</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Courier Network Box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Certified Logistics Partners
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We fulfill packages through India's premier logistics backbones:
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>Blue Dart Express</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Air Priority</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>Delhivery Surface & Express</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">25K+ PINs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>Shadowfax Hyperlocal & 3PL</span>
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">Smart Routing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>DTDC Courier Network</span>
                  <span className="text-[10px] text-slate-600 font-bold bg-slate-200/60 px-2 py-0.5 rounded">Regional Hubs</span>
                </div>
              </div>
            </div>

            {/* Shipping Support Card */}
            <div className="p-6 rounded-3xl bg-blue-50/80 border border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
                  <HelpCircle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Shipping Support
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Delivery questions or delays?
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contact our customer support if your delivery is delayed or if
                you need to modify recipient instructions.
              </p>
              <Link
                to="/contact"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Contact Logistics Desk</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column (8 cols): Detailed Shipping Policies Section */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <MapPin size={20} className="text-[#2563eb] shrink-0" />
                1. Delivery Coverage & Serviceable PIN Codes
              </h2>
              <p>
                ILumaaStudio delivers to most urban and regional locations
                throughout India. Before placing an order, you can check delivery
                eligibility and expected arrival timelines for your specific PIN
                code directly on any product details page using our live pincode
                checker.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Truck size={20} className="text-[#2563eb] shrink-0" />
                2. Shipping Charges & Real-Time Logistics Rates
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Dynamic Real-Time Rates:</strong> Shipping charges are
                  computed dynamically via automated logistics engines based on
                  package dead weight, volumetric dimensions, and destination
                  PIN code zones.
                </li>
                <li>
                  <strong>Local & Regional Express:</strong> Nominal rates
                  starting from ₹49 for local delivery and ₹69 for regional
                  express transit.
                </li>
                <li>
                  <strong>Free Shipping Thresholds:</strong> Select collections
                  qualify for zero shipping fees on orders exceeding ₹999 or
                  during platform promotional flash events.
                </li>
                <li>
                  <strong>Transparent Invoicing:</strong> Courier fees are
                  clearly itemized during cart checkout without hidden handling
                  or fuel surcharges.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <PackageCheck size={20} className="text-[#2563eb]" />
                3. Courier Partners & Tracking Telemetry
              </h2>
              <p>
                We partner with India's premier logistics carriers including Blue
                Dart, Delhivery, DTDC, and Shadowfax. Once your parcel departs our
                fulfillment center, you receive an automated tracking link via
                SMS, WhatsApp, and email. You can also monitor your live package
                status anytime via our{" "}
                <Link
                  to="/track-order"
                  className="text-[#2563eb] font-bold hover:underline"
                >
                  Track Order page
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <AlertCircle size={20} className="text-[#2563eb]" />
                4. Damaged Packages or Delivery Discrepancies
              </h2>
              <p>
                If your package appears visibly tampered with, damaged, or unsealed
                upon courier arrival, we advise taking photographs before unboxing
                and either refusing receipt or reporting the issue to our customer
                support within 48 hours for immediate replacement under our buyer
                protection policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
