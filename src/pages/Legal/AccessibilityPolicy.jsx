import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Keyboard,
  Volume2,
  Monitor,
  MousePointer,
  HelpCircle,
  Mail,
  Phone,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  Type,
  Sun,
  AlertCircle,
} from "lucide-react";

export default function AccessibilityPolicy() {
  // Interactive Accessibility Demonstration Controls
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const sections = [
    { id: "commitment", title: "1. Statement of Commitment" },
    { id: "standards", title: "2. Standards & Conformance (WCAG 2.1 AA)" },
    { id: "features", title: "3. Built-In Accessibility Features" },
    { id: "assistive-tech", title: "4. Assistive Technology Compatibility" },
    { id: "testing", title: "5. Ongoing Audits & Testing Methodology" },
    { id: "feedback", title: "6. Accessibility Grievance & Feedback" },
  ];

  const accessibilityFeaturesList = [
    {
      icon: Keyboard,
      title: "Full Keyboard Navigation",
      desc: "All interactive marketplace components, search inputs, filters, and checkout forms are fully navigable without a mouse via Tab, Shift+Tab, and Enter/Space.",
    },
    {
      icon: Volume2,
      title: "Screen Reader Support",
      desc: "Comprehensive ARIA landmarks, roles, live regions for cart updates, and descriptive alt attributes ensure screen readers convey context accurately.",
    },
    {
      icon: Eye,
      title: "Optimized Color Contrast",
      desc: "Text and interactive visual elements strictly maintain a minimum contrast ratio of 4.5:1 against their backgrounds in compliance with WCAG Level AA.",
    },
    {
      icon: Type,
      title: "Scalable Typography",
      desc: "Text can be resized up to 200% using standard browser zoom controls without clipping content or breaking checkout flows.",
    },
    {
      icon: Monitor,
      title: "Reduced Motion Support",
      desc: "Transitions and decorative animations respect user operating system preferences for reduced motion (prefers-reduced-motion: reduce).",
    },
    {
      icon: MousePointer,
      title: "Generous Click Targets",
      desc: "Buttons, links, and touch-sensitive elements adhere to minimum touch target boundaries (44x44px) to assist motor-impaired individuals.",
    },
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText("");
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div
      className={`bg-[#f8fafc] min-h-screen py-6 sm:py-10 font-sans text-slate-800 antialiased pb-20 ${
        highContrast ? "contrast-125" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/policies" className="hover:text-blue-600 transition-colors">
            Policies
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">
            Accessibility Statement
          </span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Eye size={13} />
            Digital Inclusion & Universal Accessibility
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Accessibility Statement & Policy
          </h1>
          <p
            className={`text-slate-500 max-w-3xl leading-relaxed ${
              largeText ? "text-base sm:text-lg" : "text-xs sm:text-sm"
            }`}
          >
            ILumaaStudio is committed to making our digital storefronts,
            services, and marketplace accessible to everyone, regardless of
            ability or assistive technology. We continuously measure and refine our
            user experience against global digital accessibility standards.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
            <span>Standard: WCAG 2.1 Level AA</span>
            <span>•</span>
            <span>Section 508 & EN 301 549 Aligned</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-sans font-semibold">
              <ShieldCheck size={12} />
              Verified Accessibility Standards
            </span>
          </div>
        </div>

        {/* 3 Key Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Keyboard size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Keyboard Friendly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every checkout milestone and category filter can be operated
              completely without a mouse or pointer device.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Volume2 size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Screen Reader Audited</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tested against leading screen readers with semantic landmarks,
              ARIA attributes, and descriptive product titles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Adaptive Viewing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Flexible layouts supporting up to 200% zoom without truncation,
              horizontal scrolling, or loss of clarity.
            </p>
          </div>
        </div>

        {/* 12-Column Two-Column Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Sticky Navigation & Quick Actions */}
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

            {/* Interactive Accessibility Display Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#2563eb]" />
                <span>Reading Assistance Preview</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test these client-side visual aids directly on this page:
              </p>

              <div className="space-y-2 pt-1">
                {/* Contrast Toggle */}
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    highContrast
                      ? "bg-blue-50 border-blue-300 text-[#2563eb]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun size={14} />
                    High Contrast Boost
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {highContrast ? "Active" : "Off"}
                  </span>
                </button>

                {/* Larger Text Toggle */}
                <button
                  onClick={() => setLargeText(!largeText)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    largeText
                      ? "bg-blue-50 border-blue-300 text-[#2563eb]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Type size={14} />
                    Enlarge Body Text (+20%)
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {largeText ? "Active" : "Off"}
                  </span>
                </button>

                {/* Highlight Links Toggle */}
                <button
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    highlightLinks
                      ? "bg-blue-50 border-blue-300 text-[#2563eb]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MousePointer size={14} />
                    Underline All Links
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {highlightLinks ? "Active" : "Off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Accessibility Officer Contact Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Accessibility Coordinator
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If you encounter any digital barrier on our website or wish to
                request assistive materials in an alternate format:
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#2563eb]" />
                  <a
                    href="mailto:accessibility@ilumaastudio.com"
                    className="hover:underline text-[#2563eb]"
                  >
                    accessibility@ilumaastudio.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#2563eb]" />
                  <span>+91 (800) 123-4567 (Toll-Free)</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Average Response SLA: Within 48 business hours
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Detailed Accessibility Statement */}
          <div
            className={`lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-10 leading-relaxed text-slate-600 ${
              largeText ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            } ${highlightLinks ? "[&_a]:underline [&_a]:text-[#2563eb]" : ""}`}
          >
            {/* Section 1 */}
            <section id="commitment" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#2563eb] shrink-0" />
                1. Statement of Commitment
              </h2>
              <p>
                At ILumaaStudio, digital inclusion is a fundamental principle.
                We believe that every customer, irrespective of visual, auditory,
                physical, cognitive, or neurological capabilities, should enjoy equal
                access to discovering, browsing, purchasing, and interacting with
                every storefront and merchant on our platform.
              </p>
              <p>
                Our engineering, product design, and content teams adhere to universal
                design methodologies to eliminate artificial barriers and ensure an
                inclusive digital marketplace.
              </p>
            </section>

            {/* Section 2 */}
            <section id="standards" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Layers size={20} className="text-[#2563eb] shrink-0" />
                2. Standards & Conformance (WCAG 2.1 AA)
              </h2>
              <p>
                Our digital interfaces are developed to conform with the Web Content
                Accessibility Guidelines (WCAG) 2.1 Level AA specifications published
                by the World Wide Web Consortium (W3C). These standards form the
                foundation of our compliance roadmap, encompassing the four core POUR
                principles:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Perceivable</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Information and user interface components must be presentable to
                    users in ways they can perceive, including text alternatives, high
                    contrast, and responsive layout.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Operable</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    User interface components and navigation must be operable. All
                    functionality is reachable via keyboard without trapped focus or
                    uncontrolled timeouts.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Understandable</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Information and the operation of user interface must be
                    understandable. Forms provide clear feedback, input errors are
                    explicitly surfaced, and navigation is uniform.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Robust</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Content must be robust enough to be interpreted reliably by a wide
                    variety of user agents, including modern assistive technologies and
                    screen readers.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="features" className="space-y-4 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Sliders size={20} className="text-[#2563eb] shrink-0" />
                3. Built-In Accessibility Features
              </h2>
              <p>
                We have embedded concrete accessibility enhancements across our code
                base:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {accessibilityFeaturesList.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563eb] flex items-center justify-center shrink-0">
                          <Icon size={14} />
                        </div>
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4 */}
            <section id="assistive-tech" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Monitor size={20} className="text-[#2563eb] shrink-0" />
                4. Assistive Technology Compatibility
              </h2>
              <p>
                ILumaaStudio is designed for broad compatibility with major modern
                operating systems, browsers, and assistive tools:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Screen Readers:</strong> Tested with NVDA and JAWS on Windows,
                  Apple VoiceOver on macOS & iOS, and Google TalkBack on Android.
                </li>
                <li>
                  <strong>Browsers:</strong> Officially optimized for Google Chrome,
                  Mozilla Firefox, Apple Safari, and Microsoft Edge.
                </li>
                <li>
                  <strong>Magnification Tools:</strong> Compatible with Windows Magnifier,
                  macOS Zoom, and browser-native scaling up to 200%.
                </li>
                <li>
                  <strong>Speech Recognition:</strong> Seamlessly responds to voice
                  navigation tools such as Dragon NaturallySpeaking and OS Voice Control.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="testing" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-[#2563eb] shrink-0" />
                5. Ongoing Audits & Testing Methodology
              </h2>
              <p>
                Accessibility is not a one-time project; it is an ongoing practice. We
                employ a multi-layered testing regimen:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Automated Scans:</strong> Continuous CI/CD pipelines run
                  axe-core, Lighthouse, and Pa11y automated checks to prevent regressions.
                </li>
                <li>
                  <strong>Manual Keyboard Audits:</strong> Comprehensive audits of modal
                  dialogs, cart slide-outs, dropdown menus, and checkout forms.
                </li>
                <li>
                  <strong>Design Review:</strong> Design tokens in Figma are pre-validated
                  for contrast standards and touch-target sizing before code implementation.
                </li>
              </ul>
            </section>

            {/* Section 6: Grievance & Feedback Form */}
            <section
              id="feedback"
              className="space-y-4 scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80"
            >
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Mail size={20} className="text-[#2563eb]" />
                  6. Accessibility Grievance & User Feedback
                </h2>
                <p className="text-xs text-slate-500">
                  We welcome your comments on the accessibility of ILumaaStudio. Please
                  let us know if you encounter accessibility barriers or need assistance.
                </p>
              </div>

              {feedbackSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Thank you! Your accessibility feedback has been submitted to our
                  dedicated coordinator team.
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label
                    htmlFor="accessibility-issue-input"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Describe the issue or barrier you experienced:
                  </label>
                  <textarea
                    id="accessibility-issue-input"
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. Difficulty navigating checkout with screen reader on mobile, missing form label in search bar, etc."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] bg-white transition"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-slate-400">
                    Direct inquiries:{" "}
                    <a
                      href="mailto:accessibility@ilumaastudio.com"
                      className="text-[#2563eb] hover:underline font-semibold"
                    >
                      accessibility@ilumaastudio.com
                    </a>
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    Submit Accessibility Report
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
