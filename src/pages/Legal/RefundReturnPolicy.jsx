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
} from "lucide-react";

export default function RefundReturnPolicy() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">
            Customer Business Policies
          </span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <ShieldCheck size={13} />
            Consumer Rights & Fair Policies
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Return, Exchange & Refund Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            We operate with complete transparency. Read our distinct policies for
            returning items, requesting product exchanges, and processing
            refunds below.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "all", label: "All Policies" },
            { id: "return", label: "Return Policy" },
            { id: "exchange", label: "Exchange Policy" },
            { id: "refund", label: "Refund Policy" },
            { id: "cancellation", label: "Cancellation Policy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3 Step Process Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-black text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              Request Return or Exchange
            </h3>
            <p className="text-xs text-slate-500">
              Initiate your return or exchange within 7 days from your order history.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              Free Doorstep Pickup
            </h3>
            <p className="text-xs text-slate-500">
              Our courier picks up the package in its original box and tags intact.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              Instant Replacement / Refund
            </h3>
            <p className="text-xs text-slate-500">
              Replacement item is dispatched or refund credited within 3-5 days.
            </p>
          </div>
        </div>

        {/* Policy Details Cards */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          {/* 1. RETURN POLICY */}
          {(activeTab === "all" || activeTab === "return") && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    POLICY 01
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Return Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-medium text-slate-700">
                  We offer a hassle-free <strong>7-Day Return Policy</strong> for
                  eligible items purchased on our platform.
                </p>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-2">
                  Return Conditions & Requirements:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>
                    Return requests must be placed within <strong>7 days</strong> of order delivery.
                  </li>
                  <li>
                    Items must be unused, unwashed, undamaged, and in original condition.
                  </li>
                  <li>
                    All original tags, labels, brand boxes, and accessories must remain attached.
                  </li>
                  <li>
                    Free promotional gifts or bundled items included must be returned with the main product.
                  </li>
                </ul>

                <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs space-y-1">
                  <h5 className="font-bold flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-600" />
                    Non-Returnable Items:
                  </h5>
                  <p className="text-amber-800">
                    Customized/personalized products, perishable food items, and hygiene/innerwear items cannot be returned unless received physically damaged or defective.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. EXCHANGE POLICY */}
          {(activeTab === "all" || activeTab === "exchange") && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                    POLICY 02
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Exchange Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-medium text-slate-700">
                  If your ordered product does not fit, or if you prefer a different color, size, or variant, our <strong>Exchange Policy</strong> ensures an effortless swap.
                </p>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-2">
                  Exchange Guidelines:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>
                    Exchange requests can be submitted within <strong>7 days</strong> from package delivery.
                  </li>
                  <li>
                    Exchanges are subject to inventory availability. If the requested variant is out of stock, you may select an alternative item or request a full refund.
                  </li>
                  <li>
                    Doorstep exchange: Our courier will deliver your replacement product while picking up the returned item in a single visit.
                  </li>
                  <li>
                    Defective or transit-damaged items are replaced at <strong>zero extra cost</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. REFUND POLICY */}
          {(activeTab === "all" || activeTab === "refund") && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
                  <CreditCard size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2563eb]">
                    POLICY 03
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Refund Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-medium text-slate-700">
                  Once your returned item arrives at our warehouse and passes quality verification (24-48 hours), your <strong>Refund</strong> is processed promptly.
                </p>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-2">
                  Refund Timelines & Payment Modes:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>
                    <strong>Prepaid Orders (UPI / NetBanking / Debit & Credit Cards):</strong> Refunded directly to your original payment bank account within <strong>3 to 5 business days</strong>.
                  </li>
                  <li>
                    <strong>Cash on Delivery (COD) Orders:</strong> Refunded via secure NEFT bank transfer to your bank account or issued as instant Store Credit.
                  </li>
                  <li>
                    Full refund includes the product purchase price along with taxes.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. CANCELLATION POLICY */}
          {(activeTab === "all" || activeTab === "cancellation") && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                    POLICY 04
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Order Cancellation Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-medium text-slate-700">
                  Orders can be cancelled free of charge anytime prior to dispatch directly from your account page.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>
                    If cancelled before shipment, 100% of the paid amount is refunded instantly.
                  </li>
                  <li>
                    If the shipment is already in transit, you may reject delivery upon courier arrival, and your refund will be processed as soon as the parcel returns to our warehouse.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Need help CTA */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">
                Need Help with a Return, Exchange, or Refund?
              </h4>
              <p className="text-xs text-slate-500">
                Our support team is available 24/7 to guide you through your request.
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow"
            >
              <span>Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

