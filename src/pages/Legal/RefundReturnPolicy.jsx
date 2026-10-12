import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  PackageCheck,
  Truck,
  HelpCircle,
  Clock,
  Check,
} from "lucide-react";

export default function RefundReturnPolicy() {
  const [activeTab, setActiveTab] = useState("all");

  const policyTabs = [
    { id: "all", label: "All Policies", icon: ShieldCheck },
    { id: "return", label: "Return Policy", icon: RotateCcw },
    { id: "exchange", label: "Exchange Policy", icon: RefreshCw },
    { id: "refund", label: "Refund Policy", icon: CreditCard },
    { id: "cancellation", label: "Cancellation Policy", icon: PackageCheck },
  ];

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
            Customer Business Policies
          </span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <ShieldCheck size={13} />
            Consumer Rights & Fair Policies
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Return, Exchange & Refund Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            We operate with complete clarity and customer-first transparency.
            Review our distinct terms for returning products, requesting instant
            exchanges, processing bank refunds, and cancelling orders below.
          </p>
        </div>

        {/* 3-Step Hassle-Free Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Request Return or Exchange
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Initiate your return or exchange within 7 days directly from your
              order history or contact our 24/7 helpdesk.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Free Doorstep Pickup
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our verified courier partner arranges pickup at your doorstep.
              Simply keep original packaging and brand tags intact.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Instant Replacement or Refund
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Replacement item is dispatched immediately upon courier pickup, or
              full refund is credited within 3-5 business days.
            </p>
          </div>
        </div>

        {/* 12-Column Two-Column Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Sticky Policy Navigation & Support Widget */}
          <div className="lg:col-span-4 space-y-6 sticky top-24 self-start">
            {/* Policy Category Filter Navigation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Browse by Policy
              </h3>
              <div className="space-y-1.5">
                {policyTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                        isActive
                          ? "bg-[#2563eb] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Our Guarantee to You
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>7-Day Return Window for eligible orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Zero hidden restocking fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Free doorstep reverse courier pickups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Direct bank refunds or instant store credit</span>
                </li>
              </ul>
            </div>

            {/* Need Assistance CTA Box */}
            <div className="p-6 rounded-3xl bg-blue-50/80 border border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
                  <HelpCircle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Need Help with an Order?
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    24/7 dedicated support team
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions regarding return eligibility, tracking a pickup,
                or pending refunds? We're ready to assist.
              </p>
              <Link
                to="/contact"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Contact Support</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column (8 cols): Detailed Policy Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. RETURN POLICY */}
            {(activeTab === "all" || activeTab === "return") && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                      POLICY 01
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Return Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-700">
                    We offer a hassle-free <strong>7-Day Return Policy</strong> for
                    eligible retail items purchased across our platform.
                  </p>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-1">
                    Return Conditions & Requirements:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>
                      Return requests must be initiated within <strong>7 days</strong> of confirmed delivery.
                    </li>
                    <li>
                      Items must be unused, unwashed, unaltered, and in original condition.
                    </li>
                    <li>
                      All original tags, authenticity certificates, manufacturer boxes, and included accessories must remain intact.
                    </li>
                    <li>
                      Any free promotional gifts or bundled items included must be returned with the main product.
                    </li>
                  </ul>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs space-y-1">
                    <h5 className="font-bold flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-amber-600 shrink-0" />
                      Non-Returnable Items:
                    </h5>
                    <p className="text-amber-800 leading-relaxed">
                      Customized or personalized products, perishable food items, and hygiene/innerwear items cannot be returned unless received in a physically damaged or defective condition.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EXCHANGE POLICY */}
            {(activeTab === "all" || activeTab === "exchange") && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    <RefreshCw size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                      POLICY 02
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Exchange Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-700">
                    If your ordered product does not fit, or if you prefer a different color, size, or variant, our <strong>Exchange Policy</strong> ensures an effortless swap.
                  </p>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-1">
                    Exchange Guidelines:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>
                      Exchange requests can be submitted within <strong>7 days</strong> from package delivery.
                    </li>
                    <li>
                      Exchanges are subject to inventory availability. If the requested variant is out of stock, you may select an alternative item or receive a 100% refund.
                    </li>
                    <li>
                      Doorstep exchange: In select serviceable areas, our courier delivers your replacement product while picking up the returned item in a single visit.
                    </li>
                    <li>
                      Defective or transit-damaged items are replaced at <strong>zero extra delivery cost</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. REFUND POLICY */}
            {(activeTab === "all" || activeTab === "refund") && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#2563eb]">
                      POLICY 03
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Refund Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-700">
                    Once your returned item arrives at our fulfillment hub and passes verification (within 24-48 hours), your <strong>Refund</strong> is triggered immediately.
                  </p>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-1">
                    Refund Timelines & Payment Methods:
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>
                      <strong>Prepaid Orders (UPI / NetBanking / Debit & Credit Cards):</strong> Credited directly to your original payment bank account within <strong>3 to 5 business days</strong>.
                    </li>
                    <li>
                      <strong>Cash on Delivery (COD) Orders:</strong> Refunded via secure NEFT bank transfer to your provided account details or issued as instant Store Credit.
                    </li>
                    <li>
                      Full refund includes the product purchase price along with all applicable collected taxes.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. CANCELLATION POLICY */}
            {(activeTab === "all" || activeTab === "cancellation") && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                    <PackageCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                      POLICY 04
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      Order Cancellation Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                  <p className="font-medium text-slate-700">
                    Orders can be cancelled free of charge anytime prior to dispatch directly from your customer dashboard.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>
                      If cancelled before shipment handover, 100% of the paid transaction amount is refunded immediately.
                    </li>
                    <li>
                      If the package is already in transit, you may simply decline receipt upon delivery, and a complete refund will be processed once the parcel returns to our origin hub.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
