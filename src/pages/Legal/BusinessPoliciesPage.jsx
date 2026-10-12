import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  RefreshCw,
  Lock,
  FileText,
  ChevronRight,
  CheckCircle2,
  Building2,
  Scale,
  CreditCard,
  UserCheck,
  ArrowRight,
  HelpCircle,
  Cookie,
  Eye,
} from "lucide-react";

export default function BusinessPoliciesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const policiesList = [
    {
      id: "returns",
      category: "returns",
      title: "Return Policy",
      icon: <RotateCcw size={20} className="text-emerald-600" />,
      scope: "BUSINESS POLICY",
      version: "2.1",
      content:
        "Eligible retail products can be returned within 7 days of delivery. Items must be unused, unwashed, and in original packaging with tags intact. Doorstep pickup is scheduled at zero cost for defective or mismatched items.",
    },
    {
      id: "exchanges",
      category: "exchanges",
      title: "Exchange Policy",
      icon: <RefreshCw size={20} className="text-indigo-600" />,
      scope: "BUSINESS POLICY",
      version: "2.1",
      content:
        "If you need a different size, color, or variant, or if your item arrived damaged, you can request an instant product exchange within 7 days. Once requested, a fresh replacement item is dispatched immediately upon pickup.",
    },
    {
      id: "refunds",
      category: "refunds",
      title: "Refund Policy",
      icon: <CreditCard size={20} className="text-[#2563eb]" />,
      scope: "BUSINESS POLICY",
      version: "2.1",
      content:
        "Refunds are initiated within 24 hours of package quality verification at our hub. Prepaid orders (UPI/Card) are credited back to source within 3-5 banking days. Cash on Delivery orders are refunded via NEFT or Store Credit.",
    },
    {
      id: "shipping",
      category: "shipping",
      title: "Shipping & Fulfillment Standards Policy",
      icon: <Truck size={20} className="text-[#2563eb]" />,
      scope: "BUSINESS POLICY",
      version: "2.0",
      content:
        "All verified sellers and warehouses operate under strict SLA benchmarks ensuring order dispatch within 24 to 48 hours. Real-time API courier tracking is integrated across all orders. Standard delivery is completed within 3-5 business days across India.",
    },
    {
      id: "quality",
      category: "quality",
      title: "100% Quality & Authenticity Assurance Policy",
      icon: <ShieldCheck size={20} className="text-amber-500" />,
      scope: "BUSINESS POLICY",
      version: "1.5",
      content:
        "All products and artisanal craft collections listed on ILumaaStudio undergo rigorous multi-tier authenticity screening. Sellers must maintain documented verification of material purity, hallmarking, and brand provenance.",
    },
    {
      id: "vendor_agreement",
      category: "seller",
      title: "Vendor Code of Conduct & Merchant Standards",
      icon: <Building2 size={20} className="text-purple-600" />,
      scope: "VENDOR & STORE POLICY",
      version: "3.0",
      content:
        "Merchants agree to transparent inventory synchronization, fair customer communication, prompt resolution of buyer disputes within 24 hours, and absolute prohibition of counterfeit or substandard items.",
    },
    {
      id: "payment_security",
      category: "payment",
      title: "Secure Transactions & Payment Protection Policy",
      icon: <Lock size={20} className="text-[#2563eb]" />,
      scope: "BUSINESS POLICY",
      version: "2.0",
      content:
        "Transactions are safeguarded with RBI-compliant PCI-DSS Level 1 256-bit encryption. We support all leading payment modes including UPI, Credit/Debit Cards, NetBanking, and Cash on Delivery with full escrow protection.",
    },
    {
      id: "cancellation",
      category: "returns",
      title: "Order Cancellation & Modification Guidelines",
      icon: <Scale size={20} className="text-rose-500" />,
      scope: "BUSINESS POLICY",
      version: "1.4",
      link: "/cancellation",
      content:
        "Orders can be cancelled with immediate full refund prior to shipment handover. Address and recipient phone modifications can be updated via customer support before parcel pickup.",
    },
    {
      id: "cookies",
      category: "privacy",
      title: "Cookie & Tracking Technologies Policy",
      icon: <Cookie size={20} className="text-amber-600" />,
      scope: "PRIVACY POLICY",
      version: "3.2",
      link: "/cookie-policy",
      content:
        "Comprehensive transparency on first-party session cookies, analytics telemetry, preference retention, and marketing beacons with full client-side preference controls.",
    },
    {
      id: "accessibility",
      category: "compliance",
      title: "Universal Digital Accessibility Statement",
      icon: <Eye size={20} className="text-[#2563eb]" />,
      scope: "INCLUSION POLICY",
      version: "2.1",
      link: "/accessibility",
      content:
        "Commitment to digital inclusion conforming to WCAG 2.1 Level AA standards, full keyboard navigability, screen reader semantics, and high contrast reading support.",
    },
  ];

  const filteredPolicies =
    activeTab === "all"
      ? policiesList
      : policiesList.filter((p) => p.category === activeTab);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-10 font-sans text-slate-800 antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Business Policies</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <ShieldCheck size={13} />
            Governance & Consumer Protection
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ILUMAA Studio Business Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Explore our comprehensive operating standards, merchant agreements,
            buyer protection frameworks, quality assurance criteria, and
            customer service commitments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "all", label: "All Policies" },
            { id: "returns", label: "Return & Cancellation" },
            { id: "exchanges", label: "Exchange Policy" },
            { id: "refunds", label: "Refund Policy" },
            { id: "shipping", label: "Shipping & Delivery" },
            { id: "quality", label: "Authenticity & Quality" },
            { id: "seller", label: "Seller & Vendor Rules" },
            { id: "payment", label: "Payments & Security" },
            { id: "privacy", label: "Cookie & Tracking" },
            { id: "compliance", label: "Accessibility & WCAG" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((pol) => (
            <div
              key={pol.id}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5 hover:border-[#2563eb]/40 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {pol.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md bg-blue-50 text-[#2563eb] tracking-wider">
                      {pol.scope}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      v{pol.version}
                    </span>
                  </div>
                </div>

                <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                  {pol.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {pol.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Enforced & Active</span>
                </div>
                <Link
                  to={pol.link || "/contact"}
                  className="text-[#2563eb] hover:underline text-xs flex items-center gap-1 font-bold"
                >
                  <span>{pol.link ? "View Policy" : "Inquire"}</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact Help */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Have a Question About Our Policies?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Our compliance and merchant operations team can clarify any policy
              questions, seller terms, or consumer requirements.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold text-xs transition-colors shrink-0 shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <span>Contact Compliance Team</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
