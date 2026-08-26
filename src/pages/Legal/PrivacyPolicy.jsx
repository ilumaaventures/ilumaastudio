import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, HelpCircle, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Privacy Policy</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Lock size={13} />
            Data Protection & Security
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            At ILumaaStudio, we take your trust and privacy seriously. This Privacy Policy details how we collect, safeguard, and use your personal information when you browse or make purchases across our platforms.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Last Updated: August 2026 • Version 2.1
          </p>
        </div>

        {/* Policy Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Eye size={18} className="text-[#2563eb]" />
              1. Information We Collect
            </h2>
            <p>
              When you interact with ILumaaStudio, we may collect information including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Personal Identifiers:</strong> Name, email address, contact phone number, billing and shipping addresses.</li>
              <li><strong>Payment Details:</strong> Encrypted transaction identifiers, payment gateway tokens (we never store raw CVV or card PINs).</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, location approximations, pages visited, and interaction logs to improve shopping recommendations.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2563eb]" />
              2. How We Use Your Data
            </h2>
            <p>
              We utilize your information strictly to provide a seamless e-commerce experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Fulfilling and tracking product orders, delivery confirmations, and customer support inquiries.</li>
              <li>Personalizing recommendations, relevant deals, and curated collections tailored to your preferences.</li>
              <li>Detecting fraudulent activities, preventing unauthorized access, and maintaining security compliance.</li>
              <li>Sending transactional SMS and email notifications regarding delivery schedules and dispatch updates.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-[#2563eb]" />
              3. Data Security & Storage
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption and strict access protocols to protect your personal data against unauthorized disclosure, alteration, or theft. Payments are processed through RBI-approved PCI-DSS compliant payment aggregators.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#2563eb]" />
              4. Cookies and Tracking
            </h2>
            <p>
              We use first-party and essential session cookies to remember items in your cart, retain login sessions, and optimize website load speeds. You can configure your browser to disable cookies, though some interactive features may experience limitations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-[#2563eb]" />
              5. Your Rights and Choices
            </h2>
            <p>
              You have the right to access, rectify, or request deletion of your account data at any time through your profile settings or by contacting our data privacy officer.
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Have Questions Regarding Privacy?</h3>
            <p className="text-xs text-slate-500">
              For any questions or requests concerning your data, our privacy grievance team is here to assist:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#2563eb]" />
                <span>privacy@ilumaastudio.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#2563eb]" />
                <span>+91 (800) 123-4567</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
