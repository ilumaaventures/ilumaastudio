import React from "react";
import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";

export default function RefundReturnPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Returns & Refunds Policy</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <RotateCcw size={13} />
            Buyer Protection Guarantee
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Return, Replacement & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            We aim for 100% satisfaction with every order. If you receive an item that is defective, damaged, or not as described, our straightforward return and replacement process ensures you are fully covered.
          </p>
        </div>

        {/* 3 Step Return Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center font-black text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Initiate Request</h3>
            <p className="text-xs text-slate-500">Submit a return request within 7 days of delivery from your order history.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Free Doorstep Pickup</h3>
            <p className="text-xs text-slate-500">Our courier agent picks up the package in its original box and tags.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Instant Refund / Swap</h3>
            <p className="text-xs text-slate-500">Replacement dispatched or refund credited to original method in 3-5 days.</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2563eb]" />
              1. 7-Day Return Eligibility Window
            </h2>
            <p>
              Eligible retail products can be returned or exchanged within <strong>7 days</strong> from the date of package delivery. To qualify for a full refund or replacement:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Item must be unused, unwashed, and without signs of wear.</li>
              <li>Original tags, barcodes, certificates of authenticity, and packaging must be intact.</li>
              <li>Free promotional gifts or bundled items included with the product must also be returned.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-[#2563eb]" />
              2. Non-Returnable & Final Sale Items
            </h2>
            <p>
              For hygiene, customization, and safety reasons, certain categories are non-returnable unless received in a damaged or defective condition:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Personalized, bespoke, or custom-engraved merchandise.</li>
              <li>Perishable grocery, food hampers, and consumable goods.</li>
              <li>Personal hygiene items, innerwear, and unsealed beauty cosmetics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <RotateCcw size={18} className="text-[#2563eb]" />
              3. Refund Timelines & Payment Mode
            </h2>
            <p>
              Once your returned package arrives at our verification fulfillment center and passes standard quality inspection (usually within 24-48 hours), the refund will be credited as follows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Prepaid Orders (UPI / NetBanking / Cards):</strong> Refunded to original payment method within 3 to 5 banking days.</li>
              <li><strong>Cash on Delivery (COD):</strong> Refunded via secure NEFT bank transfer or ILumaa Store Credit wallet upon providing bank details.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2563eb]" />
              4. Order Cancellation Policy
            </h2>
            <p>
              You can cancel your order free of charge at any moment prior to dispatch directly from your account page. If the order has already dispatched, you can decline delivery upon courier arrival, and a full refund will be processed upon package return.
            </p>
          </section>

          {/* Need help CTA */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-sm">Need Help with an Ongoing Return?</h4>
              <p className="text-xs text-slate-500">Our customer care representatives are ready to assist you.</p>
            </div>
            <Link
              to="/contact"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
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
