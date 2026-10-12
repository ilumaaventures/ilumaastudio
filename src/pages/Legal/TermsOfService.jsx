import React from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  HelpCircle,
  Mail,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function TermsOfService() {
  const sections = [
    { id: "account", title: "1. Account Eligibility & Responsibilities" },
    { id: "orders", title: "2. Product Listings, Pricing & Orders" },
    { id: "ip", title: "3. Marketplace Vendors & Intellectual Property" },
    { id: "liability", title: "4. Limitation of Liability" },
    { id: "governing", title: "5. Governing Law & Dispute Resolution" },
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
          <span className="text-slate-900 font-bold">Terms of Service</span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Scale size={13} />
            Legal Agreement & Operating Standards
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Please review these terms carefully before accessing or shopping on
            ILumaaStudio. By using our website and digital services, you agree to
            be bound by these statutory provisions and commercial policies.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Effective Date: August 2026 • Version 1.8
          </p>
        </div>

        {/* 12-Column Two-Column Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Sticky Table of Contents & Legal Contacts */}
          <div className="lg:col-span-4 space-y-6 sticky top-24 self-start">
            {/* Table of Contents */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Table of Contents
              </h3>
              <div className="space-y-1.5 text-xs font-bold text-slate-600">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#2563eb] transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Support Box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Legal & Compliance Inquiries
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you have questions regarding these terms, merchant contracts,
                or regulatory compliance, reach out to our legal department:
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
                <Mail size={14} className="text-[#2563eb]" />
                <a
                  href="mailto:legal@ilumaastudio.com"
                  className="hover:underline text-[#2563eb]"
                >
                  legal@ilumaastudio.com
                </a>
              </div>
            </div>

            {/* Need Consumer Assistance */}
            <div className="p-6 rounded-3xl bg-blue-50/80 border border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
                  <HelpCircle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Customer Support
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    24/7 client helpdesk
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need help with an order, return request, or delivery rather than
                legal terms? Visit our Help Center.
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

          {/* Right Column (8 cols): Detailed Legal Terms */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
            {/* Section 1 */}
            <section id="account" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-[#2563eb] shrink-0" />
                1. Account Eligibility & Responsibilities
              </h2>
              <p>
                To create an account and place orders on ILumaaStudio, you must be
                at least 18 years of age or possess legal parental consent. You
                agree to maintain accurate account details, provide valid contact
                information, and keep your login credentials strictly
                confidential.
              </p>
              <p>
                You are responsible for all actions taken under your account. If
                you suspect any unauthorized use, notify our security team
                immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section id="orders" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <FileText size={20} className="text-[#2563eb] shrink-0" />
                2. Product Listings, Pricing & Orders
              </h2>
              <p>
                We strive to display accurate pricing, stock availability, and
                color representations across all artisan and verified merchant
                catalog items. However, technical or typographical discrepancies
                may occasionally occur.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  All prices are listed in Indian Rupees (INR) inclusive of
                  applicable GST unless explicitly noted.
                </li>
                <li>
                  We reserve the right to refuse or cancel orders placed with
                  erroneous pricing or flagged for fraudulent suspicion.
                </li>
                <li>
                  Order confirmation emails serve as an acknowledgement of your
                  purchase request and do not constitute contract completion until
                  handover to the logistics courier.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="ip" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Scale size={20} className="text-[#2563eb] shrink-0" />
                3. Marketplace Vendors & Intellectual Property
              </h2>
              <p>
                ILUMAAStudio operates as a curated retail and multi-vendor
                ecosystem. Product trademarks, artisan photographs, descriptions,
                multimedia assets, and proprietary studio layouts belong to
                ILUMAA and respective verified brand partners. Unauthorized
                scraping, replication, or commercial redistribution is strictly
                prohibited.
              </p>
            </section>

            {/* Section 4 */}
            <section id="liability" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-[#2563eb] shrink-0" />
                4. Limitation of Liability
              </h2>
              <p>
                ILUMAAStudio will not be liable for indirect, incidental, or
                consequential damages resulting from platform downtime,
                unforeseen courier transit delays, third-party payment gateway
                latency, or force majeure events beyond our reasonable control.
              </p>
            </section>

            {/* Section 5 */}
            <section id="governing" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#2563eb] shrink-0" />
                5. Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms are governed by and construed in accordance with the
                laws of India. Any legal disputes arising out of these terms shall
                be subject to the exclusive jurisdiction of the competent courts
                in India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
