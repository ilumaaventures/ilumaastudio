import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Your Data" },
    { id: "security", title: "3. Data Security & Storage" },
    { id: "cookies", title: "4. Cookies and Tracking" },
    { id: "rights", title: "5. Your Rights and Choices" },
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
          <span className="text-slate-900 font-bold">Privacy Policy</span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Lock size={13} />
            Data Protection & Consumer Privacy
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            At ILumaaStudio, we take your trust and personal privacy seriously.
            This Privacy Policy details how we collect, safeguard, and use your
            personal information when you browse our storefronts or make
            purchases across our platform.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Last Updated: August 2026 • Version 2.1
          </p>
        </div>

        {/* 12-Column Two-Column Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Sticky Navigation & Data Protection Contacts */}
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

            {/* Privacy Grievance Officer */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Privacy Grievance Officer
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                For questions concerning data storage, access requests, or
                erasure:
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#2563eb]" />
                  <a
                    href="mailto:privacy@ilumaastudio.com"
                    className="hover:underline text-[#2563eb]"
                  >
                    privacy@ilumaastudio.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#2563eb]" />
                  <span>+91 (800) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h4 className="font-bold text-emerald-950 text-xs">
                  Enterprise Data Security
                </h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                256-bit SSL encryption and RBI-compliant PCI-DSS payment gateways.
                We never store raw credit card numbers or banking PINs.
              </p>
            </div>
          </div>

          {/* Right Column (8 cols): Detailed Privacy Policy Sections */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-600">
            {/* Section 1 */}
            <section id="collection" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Eye size={20} className="text-[#2563eb] shrink-0" />
                1. Information We Collect
              </h2>
              <p>
                When you interact with ILumaaStudio, we may collect the following
                categories of personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Personal Identifiers:</strong> Name, email address,
                  contact phone number, billing address, and recipient delivery
                  locations.
                </li>
                <li>
                  <strong>Payment Details:</strong> Encrypted transaction
                  identifiers and payment gateway tokens. We never hold or store
                  raw CVV codes, net banking passwords, or card PINs.
                </li>
                <li>
                  <strong>Device & Usage Data:</strong> IP address, browser
                  type, network approximation, pages visited, and interaction
                  logs to improve shopping experiences and speed.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="usage" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#2563eb] shrink-0" />
                2. How We Use Your Data
              </h2>
              <p>
                We utilize your personal information strictly to deliver a
                seamless e-commerce experience:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Fulfilling product orders, tracking consignments, delivering
                  packages, and managing returns or customer support inquiries.
                </li>
                <li>
                  Personalizing product suggestions, curated collections, and
                  promotional flash deals tailored to your preferences.
                </li>
                <li>
                  Detecting fraudulent activities, preventing unauthorized
                  access, and maintaining marketplace security.
                </li>
                <li>
                  Sending transactional SMS, WhatsApp, and email alerts
                  regarding dispatch schedules and status milestones.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="security" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Lock size={20} className="text-[#2563eb] shrink-0" />
                3. Data Security & Storage
              </h2>
              <p>
                We implement industry-standard 256-bit SSL encryption and strict
                role-based access protocols to protect your personal information
                against unauthorized disclosure, alteration, or loss. Payments
                are executed through RBI-licensed PCI-DSS Level 1 payment
                gateways.
              </p>
            </section>

            {/* Section 4 */}
            <section id="cookies" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <FileText size={20} className="text-[#2563eb] shrink-0" />
                4. Cookies and Tracking
              </h2>
              <p>
                We use first-party and essential session cookies to remember items
                in your shopping cart, preserve active logins, and optimize page
                load velocity. You can configure your browser to decline cookies,
                though certain interactive cart features may experience
                limitations. For full details on our cookie inventory and to adjust
                your live tracking preferences, view our dedicated{" "}
                <Link
                  to="/cookie-policy"
                  className="text-[#2563eb] font-bold hover:underline"
                >
                  Cookie Policy & Preferences Center
                </Link>
                .
              </p>
            </section>

            {/* Section 5 */}
            <section id="rights" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <HelpCircle size={20} className="text-[#2563eb] shrink-0" />
                5. Your Rights and Choices
              </h2>
              <p>
                You have the right to access, rectify, or request deletion of your
                account data at any time through your profile settings or by
                contacting our designated privacy grievance desk.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
