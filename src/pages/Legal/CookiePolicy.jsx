import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Info,
  Lock,
  RefreshCw,
  FileText,
  Check,
  Mail,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  CheckCircle,
} from "lucide-react";

export default function CookiePolicy() {
  // Local state for interactive cookie preferences
  const [preferences, setPreferences] = useState({
    essential: true, // Always locked to true
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ilumaa_cookie_prefs");
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggle = (key) => {
    if (key === "essential") return; // cannot disable
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem("ilumaa_cookie_prefs", JSON.stringify(preferences));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleAcceptAll = () => {
    const allOn = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allOn);
    try {
      localStorage.setItem("ilumaa_cookie_prefs", JSON.stringify(allOn));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const sections = [
    { id: "what-are-cookies", title: "1. What Are Cookies & Tracking Tech" },
    { id: "categories", title: "2. Categories of Cookies We Use" },
    { id: "inventory", title: "3. Detailed Cookie Inventory & Lifespan" },
    { id: "preferences", title: "4. Managing Your Cookie Preferences" },
    { id: "browser-controls", title: "5. Browser & Device Control Methods" },
    { id: "third-party", title: "6. Third-Party Analytics & Partners" },
    { id: "updates-contact", title: "7. Policy Updates & Contact Details" },
  ];

  const cookieInventory = [
    {
      name: "ilumaa_session_id",
      category: "Essential",
      provider: "ILumaaStudio (First-party)",
      purpose: "Preserves secure encrypted session token and shopping session authentication.",
      retention: "Session (Browser close)",
    },
    {
      name: "ilumaa_cart_token",
      category: "Essential",
      provider: "ILumaaStudio (First-party)",
      purpose: "Retains basket items and checkout draft state while browsing products.",
      retention: "30 days",
    },
    {
      name: "ilumaa_csrf_token",
      category: "Essential",
      provider: "ILumaaStudio (First-party)",
      purpose: "Protects forms and API endpoints against Cross-Site Request Forgery (CSRF) exploits.",
      retention: "Session",
    },
    {
      name: "ilumaa_pref_currency",
      category: "Functional",
      provider: "ILumaaStudio (First-party)",
      purpose: "Stores user's selected regional currency and language localization options.",
      retention: "1 year",
    },
    {
      name: "ilumaa_recently_viewed",
      category: "Functional",
      provider: "ILumaaStudio (First-party)",
      purpose: "Remembers past viewed items to showcase quick-revisit product carousels.",
      retention: "60 days",
    },
    {
      name: "_ga, _gid (Analytics)",
      category: "Performance",
      provider: "Google Analytics 4",
      purpose: "Measures aggregate page views, bounce rate, load times, and performance diagnostics without personally identifying individuals.",
      retention: "24 months / 24 hours",
    },
    {
      name: "_ilumaa_perf_telemetry",
      category: "Performance",
      provider: "ILumaaStudio (First-party)",
      purpose: "Logs Core Web Vitals (LCP, FID, CLS) to help optimize page loading speed.",
      retention: "14 days",
    },
    {
      name: "_fbp, _ad_id",
      category: "Marketing",
      provider: "Meta / Google Ads",
      purpose: "Measures efficacy of conversion campaigns and displays relevant marketplace recommendations.",
      retention: "90 days",
    },
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
          <Link to="/policies" className="hover:text-blue-600 transition-colors">
            Policies
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Cookie Policy</span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Cookie size={13} />
            Data Transparency & Tracking Technologies
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            At ILumaaStudio, we believe in complete transparency regarding how
            data is collected and used. This policy explains what cookies, web
            beacons, and local storage technologies are, why we use them across
            our marketplace storefronts, and how you can exercise full control over
            your personal tracking preferences.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
            <span>Last Updated: August 2026</span>
            <span>•</span>
            <span>Version: 3.2</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-sans font-semibold">
              <ShieldCheck size={12} />
              ePrivacy & GDPR / DPDP Act Compliant
            </span>
          </div>
        </div>

        {/* 3 Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Essential Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strictly necessary cookies secure your checkout, authenticate accounts,
              and prevent fraud. These cannot be disabled.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <SlidersHorizontal size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Granular User Choice</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You maintain total control. Choose which analytics, preferences, or
              promotional cookies are permitted at any time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No Sale of Personal Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never sell your raw personal data or browsing identifiers to
              unauthorized brokers or advertisers.
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

            {/* Quick Preference Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sliders size={14} />
                <span>Instant Privacy Control</span>
              </div>
              <h4 className="text-sm font-black">Customize Cookie Permissions</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure your preference profile right on this page. Your choices
                will be applied instantly across your session.
              </p>
              <a
                href="#preferences"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs transition shadow-sm"
              >
                <span>Open Preferences Center</span>
                <ChevronRight size={14} />
              </a>
            </div>

            {/* Data Protection Help Desk */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Privacy & Compliance Officer
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have questions regarding our tracking technologies or automated processing?
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
                  <Lock size={14} className="text-[#2563eb]" />
                  <span>DPO Team • ILumaa Global</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Detailed Cookie Policy Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-10 text-xs sm:text-sm leading-relaxed text-slate-600">
            {/* Section 1 */}
            <section id="what-are-cookies" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Cookie size={20} className="text-[#2563eb] shrink-0" />
                1. What Are Cookies & Tracking Technologies?
              </h2>
              <p>
                A cookie is a small text file placed onto your computer, smartphone, or
                tablet when you visit an online service. Cookies allow websites to
                recognize your device, store preference parameters, facilitate fast
                navigation between pages, and secure user logins.
              </p>
              <p>
                In addition to standard HTTP cookies, ILumaaStudio may utilize related
                technologies such as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Local Storage & Session Storage:</strong> HTML5 storage
                  mechanisms that enable client-side applications to store information
                  (such as items in your shopping bag or theme settings) directly within
                  your web browser without sending repeated network overhead.
                </li>
                <li>
                  <strong>Pixel Tags & Web Beacons:</strong> Tiny graphic snippets
                  embedded in our emails and storefront banners to confirm message
                  delivery, open rates, and conversion health.
                </li>
                <li>
                  <strong>Software Development Kits (SDKs):</strong> Mobile-specific code
                  libraries used in our native mobile apps to monitor crash logs and
                  ensure reliable checkout flows.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="categories" className="space-y-4 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Sliders size={20} className="text-[#2563eb] shrink-0" />
                2. Categories of Cookies We Use
              </h2>
              <p>
                We categorize all cookies and digital identifiers used across ILumaaStudio
                into four distinct operational tiers:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Category 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Lock size={13} className="text-[#2563eb]" />
                      Strictly Necessary
                    </span>
                    <span className="text-[10px] uppercase font-black bg-blue-100 text-[#2563eb] px-2 py-0.5 rounded-full">
                      Always Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Essential for the core platform to function. They support user login,
                    shopping cart persistence, multi-factor authentication, and CSRF
                    mitigation. Without these, the marketplace cannot operate.
                  </p>
                </div>

                {/* Category 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <RefreshCw size={13} className="text-emerald-600" />
                      Performance & Analytics
                    </span>
                    <span className="text-[10px] uppercase font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Configurable
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Help us understand how visitors interact with storefronts, which
                    search queries produce results, and where checkout friction occurs.
                    All collected statistics are aggregated and pseudonymized.
                  </p>
                </div>

                {/* Category 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Eye size={13} className="text-amber-600" />
                      Functional & Preferences
                    </span>
                    <span className="text-[10px] uppercase font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Configurable
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Allow the website to remember choices you make, such as language,
                    preferred regional delivery pin code, currency denomination, and
                    recently viewed products.
                  </p>
                </div>

                {/* Category 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <FileText size={13} className="text-purple-600" />
                      Targeting & Marketing
                    </span>
                    <span className="text-[10px] uppercase font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Configurable
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Set through our site by marketing partners to build a profile of your
                    interests and show you relevant discounts, seasonal flash sales, and
                    personalized brand suggestions on other networks.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Interactive Preference Manager */}
            <section
              id="preferences"
              className="space-y-4 scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-blue-200/80 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-[#2563eb]" />
                    Interactive Cookie Preferences Center
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your permissions below. Your settings are saved immediately
                    to this browser.
                  </p>
                </div>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
                >
                  Accept All Cookies
                </button>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Your cookie preferences have been successfully recorded!
                </div>
              )}

              <div className="space-y-3 pt-2">
                {/* Essential Toggle */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Strictly Necessary Cookies
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Essential for authentication, shopping bag persistence, and secure checkouts.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      disabled
                      className="w-12 h-6 bg-[#2563eb] rounded-full p-1 opacity-75 cursor-not-allowed flex items-center justify-end"
                      title="Required for platform functionality"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                    </button>
                  </div>
                </div>

                {/* Functional Toggle */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Functional & Preferences Cookies
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Remembers your preferred currency, language, and recently viewed store items.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => handleToggle("functional")}
                      className={`w-12 h-6 rounded-full p-1 transition cursor-pointer flex items-center ${
                        preferences.functional
                          ? "bg-[#2563eb] justify-end"
                          : "bg-slate-300 justify-start"
                      }`}
                      aria-label="Toggle Functional Cookies"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                    </button>
                  </div>
                </div>

                {/* Analytics Toggle */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Performance & Analytics Cookies
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Enables aggregated visit metrics and speed improvements without identifying you personally.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => handleToggle("analytics")}
                      className={`w-12 h-6 rounded-full p-1 transition cursor-pointer flex items-center ${
                        preferences.analytics
                          ? "bg-[#2563eb] justify-end"
                          : "bg-slate-300 justify-start"
                      }`}
                      aria-label="Toggle Analytics Cookies"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                    </button>
                  </div>
                </div>

                {/* Marketing Toggle */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Targeting & Advertising Cookies
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allows partner networks to deliver relevant discounts and tailored marketplace promotions.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => handleToggle("marketing")}
                      className={`w-12 h-6 rounded-full p-1 transition cursor-pointer flex items-center ${
                        preferences.marketing
                          ? "bg-[#2563eb] justify-end"
                          : "bg-slate-300 justify-start"
                      }`}
                      aria-label="Toggle Marketing Cookies"
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Save My Preferences
                </button>
              </div>
            </section>

            {/* Section 4: Inventory Table */}
            <section id="inventory" className="space-y-4 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <FileText size={20} className="text-[#2563eb] shrink-0" />
                3. Detailed Cookie Inventory & Lifespan
              </h2>
              <p>
                The following table outlines representative cookies utilized across the
                ILumaaStudio platform and storefront networks:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Cookie Name</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Provider</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {cookieInventory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 text-[11px]">
                          {item.name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.category === "Essential"
                                ? "bg-blue-100 text-[#2563eb]"
                                : item.category === "Performance"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.category === "Functional"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px]">{item.provider}</td>
                        <td className="py-3 px-4 text-[11px] leading-relaxed max-w-xs">
                          {item.purpose}
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-slate-500 whitespace-nowrap">
                          {item.retention}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5 */}
            <section id="browser-controls" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Info size={20} className="text-[#2563eb] shrink-0" />
                5. Browser & Device Control Methods
              </h2>
              <p>
                In addition to our on-page Preferences Center, most modern web browsers
                allow you to inspect, manage, and delete stored cookies directly through
                their security settings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs">Google Chrome</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Settings → Privacy and security → Cookies and other site data.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs">Apple Safari</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Settings → Safari → Privacy & Security → Block All Cookies / Clear History.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs">Mozilla Firefox</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Options → Privacy & Security → Cookies and Site Data.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs">Microsoft Edge</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Settings → Cookies and Site Permissions → Manage and delete cookies.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                <em>Note:</em> Disabling essential cookies via browser settings may
                degrade platform functionality, including preserving your shopping bag
                and logging into registered accounts.
              </p>
            </section>

            {/* Section 6 */}
            <section id="third-party" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <HelpCircle size={20} className="text-[#2563eb] shrink-0" />
                6. Third-Party Analytics & Partner Integrations
              </h2>
              <p>
                When you visit ILumaaStudio, certain third-party providers (such as
                payment processors, analytics providers, or social platform widgets)
                may place cookies on your device to facilitate transaction processing
                and fraud deterrence.
              </p>
              <p>
                We do not allow third-party partners to collect personal identifying
                information from our storefronts for secondary promotional purposes
                without explicit consumer opt-in.
              </p>
            </section>

            {/* Section 7 */}
            <section id="updates-contact" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Mail size={20} className="text-[#2563eb] shrink-0" />
                7. Policy Updates & Contact Details
              </h2>
              <p>
                We may periodically amend this Cookie Policy to reflect changes in
                statutory guidelines, technological advancements, or marketplace
                features. Any updates will be published on this page with a revised
                effective date.
              </p>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 mt-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  Questions or Data Subject Rights Inquiries?
                </h4>
                <p className="text-xs text-slate-500">
                  Please direct all compliance correspondence to our Data Privacy Desk:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                  <span>
                    Email:{" "}
                    <a
                      href="mailto:privacy@ilumaastudio.com"
                      className="text-[#2563eb] hover:underline"
                    >
                      privacy@ilumaastudio.com
                    </a>
                  </span>
                  <span>•</span>
                  <span>Direct: +91 (800) 123-4567</span>
                  <span>•</span>
                  <span>Grievance Desk: Bangalore, India</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
