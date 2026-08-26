import React from "react";
import { Link } from "react-router-dom";
import { Scale, CheckCircle2, AlertTriangle, FileText, ChevronRight, HelpCircle, Mail } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Terms of Service</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Scale size={13} />
            Legal Agreement
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Please review these terms carefully before accessing or shopping on ILumaaStudio. By using our website and services, you agree to be bound by these provisions.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Effective Date: August 2026 • Version 1.8
          </p>
        </div>

        {/* Terms Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2563eb]" />
              1. Account Eligibility & Responsibilities
            </h2>
            <p>
              To create an account and place orders on ILumaaStudio, you must be at least 18 years of age or possess legal parental consent. You agree to maintain accurate account details and keep your login credentials confidential.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#2563eb]" />
              2. Product Listings, Pricing & Orders
            </h2>
            <p>
              We strive to display accurate pricing, stock availability, and color representations. However, technical or typographical discrepancies may occasionally occur.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>All prices are listed in Indian Rupees (INR) inclusive of applicable GST unless explicitly noted.</li>
              <li>We reserve the right to refuse or cancel orders placed with erroneous pricing or fraudulent suspicion.</li>
              <li>Order confirmation emails serve as an acknowledgement of purchase request and do not constitute contract completion until dispatch.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Scale size={18} className="text-[#2563eb]" />
              3. Marketplace Vendors & Intellectual Property
            </h2>
            <p>
              ILumaaStudio acts as a curated retail and multi-vendor platform. Product trademarks, artisan photographs, descriptions, and proprietary studio layouts belong to ILumaa and respective verified brand partners. Unauthorized reproduction or scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#2563eb]" />
              4. Limitation of Liability
            </h2>
            <p>
              ILumaaStudio will not be liable for indirect, incidental, or consequential damages resulting from platform downtime, unforeseen courier transit disruptions, or third-party payment gateway latency.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#2563eb]" />
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any legal disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Legal & Compliance Inquiries</h3>
            <p className="text-xs text-slate-500">
              If you have any questions regarding these Terms of Service, please reach out to our legal department:
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Mail size={14} className="text-[#2563eb]" />
              <span>legal@ilumaastudio.com</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
