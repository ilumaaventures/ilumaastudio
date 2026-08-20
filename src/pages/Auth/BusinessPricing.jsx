import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Store,
  Users,
  BarChart3,
  ChevronDown,
  Crown,
  Search,
  Building2,
  Boxes,
  RefreshCw,
  MessageSquare,
  Layers,
  ArrowDown,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import baseApi from "../../api/baseApi";

// Default 3 standard plans + 1 Enterprise Plan (Total = 4 cards strictly)
const DEFAULT_4_PLANS = [
  {
    _id: "starter",
    name: "Starter",
    description: "For small businesses & startups launching online store",
    billingModel: "FIXED",
    pricing: { monthly: 499, yearly: 399 },
    popular: false,
    badgeText: "BASIC STORE",
    limits: {
      maxProducts: 500,
      maxEmployees: 3,
      maxVendors: 2,
      maxWarehouses: 1,
      maxTemplates: 3,
      recycleBinDays: 14,
    },
    modules: [
      { module: { label: "Dashboard", key: "dashboard" }, enabled: true },
      { module: { label: "Products", key: "products" }, enabled: true },
      { module: { label: "Orders", key: "orders" }, enabled: true },
      { module: { label: "Customers", key: "customers" }, enabled: true },
      { module: { label: "Inventory", key: "inventory" }, enabled: true },
    ],
  },
  {
    _id: "growth",
    name: "Growth",
    description: "For growing brands and scaling online businesses",
    billingModel: "FIXED",
    pricing: { monthly: 999, yearly: 799 },
    popular: true,
    badgeText: "MOST POPULAR",
    limits: {
      maxProducts: 5000,
      maxEmployees: 10,
      maxVendors: 5,
      maxWarehouses: 3,
      maxTemplates: 10,
      recycleBinDays: 30,
    },
    modules: [
      { module: { label: "Dashboard", key: "dashboard" }, enabled: true },
      { module: { label: "Products", key: "products" }, enabled: true },
      { module: { label: "Orders", key: "orders" }, enabled: true },
      { module: { label: "Customers", key: "customers" }, enabled: true },
      { module: { label: "Inventory", key: "inventory" }, enabled: true },
      { module: { label: "Warehouse", key: "warehouse" }, enabled: true },
      { module: { label: "Reports", key: "reports" }, enabled: true },
    ],
  },
  {
    _id: "business",
    name: "Business",
    description: "For established multi-store & multi-vendor operations",
    billingModel: "HYBRID",
    pricing: { monthly: 1999, yearly: 1599 },
    commission: { type: "PERCENTAGE", value: 2 },
    popular: false,
    badgeText: "SCALE UP",
    limits: {
      maxProducts: 25000,
      maxEmployees: 25,
      maxVendors: 10,
      maxWarehouses: 5,
      maxTemplates: 20,
      recycleBinDays: 60,
    },
    modules: [
      { module: { label: "All Core Modules", key: "all" }, enabled: true },
      { module: { label: "Multi-Store POS", key: "pos" }, enabled: true },
      { module: { label: "Role Permissions", key: "roles" }, enabled: true },
      { module: { label: "Audit Logs", key: "logs" }, enabled: true },
    ],
  },
  {
    _id: "custom-enterprise",
    name: "Enterprise",
    description: "Let's talk! We build anything according to your wishes",
    billingModel: "CUSTOM",
    isCustomTalk: true,
    popular: false,
    badgeText: "CUSTOM DEPLOYMENT",
    limits: {
      maxProducts: "Unlimited",
      maxEmployees: "Unlimited",
      maxVendors: "Unlimited",
      maxWarehouses: "Custom SLA",
      maxTemplates: "Unlimited",
      recycleBinDays: "Custom Retention",
    },
    modules: [
      { module: { label: "All 190+ Platform Modules" }, enabled: true },
      { module: { label: "Custom Modules Built to Order" }, enabled: true },
      { module: { label: "Dedicated Server Infrastructure" }, enabled: true },
      { module: { label: "Bespoke SLA & Custom Workflows" }, enabled: true },
    ],
  },
];

// Comprehensive 190+ Features Comparison Matrix Dataset
const COMPARISON_GROUPS = [
  {
    title: "Account, Security & Authentication",
    rows: [
      ["Customer/vendor/admin/bussiness registration", true, true, true, true],
      ["RBAC", true, true, true, true],
      ["OTP & email verification", true, true, true, true],
      ["vendor KYC", true, true, true, true],
      ["bussiness KYC", true, true, true, true],
      ["social login", true, true, true, true],
      ["two-factor auth", false, true, true, true],
      ["password recovery", true, true, true, true],
      ["saved payment methods", true, true, true, true],
      ["saved searches", false, true, true, true],
      ["notification preferences", false, false, true, true],
      ["rate limiting", true, true, true, true],
      ["encryption", true, true, true, true],
      ["API security", true, true, true, true],
      ["bot protection", true, true, true, true],
      ["GDPR compliance.", true, true, true, true],
    ],
  },
  {
    title: "Catalog, Products & Discovery",
    rows: [
      ["Categories", true, true, true, true],
      ["vendors", true, true, true, true],
      ["products", true, true, true, true],
      ["variants", true, true, true, true],
      ["images", true, true, true, true],
      ["specifications", true, true, true, true],
      ["inventory", true, true, true, true],
      ["approval by super admin", true, true, true, true],
      ["Search", true, true, true, true],
      ["filters", true, true, true, true],
      ["wishlist", true, true, true, true],
      ["cart", true, true, true, true],
      ["basic recommendations", true, true, true, true],
    ],
  },
  {
    title: "Orders, Checkout & Invoicing",
    rows: [
      ["Address management", true, true, true, true],
      ["coupons", true, true, true, true],
      ["taxes", false, true, true, true],
      ["order placement", true, true, true, true],
      ["payment gateway", false, true, true, true],
      ["invoice", false, true, true, true],
      ["Orders", false, true, true, true],
      ["tracking", false, true, true, true],
      ["cancellation", false, true, true, true],
      ["returns", false, true, true, true],
      ["refunds", false, true, true, true],
      ["notifications", true, true, true, true],
      ["purchase orders", false, true, true, true],
    ],
  },
  {
    title: "Admin & Content Management (CMS)",
    rows: [
      ["User management", true, true, true, true],
      ["seller approval", true, true, true, true],
      ["category management", true, true, true, true],
      ["order monitoring", false, true, true, true],
      ["reports", true, true, true, true],
      ["CMS", true, true, true, true],
      ["dashboard", true, true, true, true],
      ["Recyle bin", true, true, true, true],
    ],
  },
  {
    title: "Sales Analytics & Performance Reports",
    rows: [
      ["Sales dashboard", true, true, true, true],
      ["revenue reports", false, true, true, true],
      ["product analytics", true, true, true, true],
      ["inventory alerts", true, true, true, true],
      ["performance score", false, true, true, true],
      ["tax & settlement reports", true, true, true, true],
      ["Executive dashboards", false, false, false, true],
      ["sales analytics", false, false, false, true],
      ["customer analytics", false, false, false, true],
      ["data warehouse", false, false, false, true],
    ],
  },
  {
    title: "Warehouse & Multi-location Management",
    rows: [
      ["Warehouses", false, true, true, true],
      ["multi-location warehouses", false, false, true, true],
      ["stock transfers", false, false, true, true],
      ["low stock alerts", false, true, true, true],
      ["Inventory", true, true, true, true],
      ["purchase orders", false, true, true, true],
      ["warehouse management", false, true, true, true],
      ["multi-warehouse", false, true, true, true],
    ],
  },
  {
    title: "Accounting, Finance & CRM",
    rows: [
      ["accounting", true, true, true, true],
      ["GST", true, true, true, true],
      ["staff management", false, true, true, true],
      ["CRM", false, true, true, true],
      ["vendor management", false, true, true, true],
      ["P&L dashboard", false, true, true, true],
      [
        "Finance only covers seller-side payouts/settlement",
        true,
        true,
        true,
        true,
      ],
      ["not buyer payment methods.", false, true, true, true],
    ],
  },
  {
    title: "Loyalty, Rewards & Marketing Engine",
    rows: [
      ["Wishlist", true, true, true, true],
      ["loyalty points", false, true, true, true],
      ["referrals", false, true, true, true],
      ["rewards", false, true, true, true],
      ["Coupons", false, true, true, true],
      ["flash sales", false, true, true, true],
      ["campaigns", false, true, true, true],
      ["email/push/SMS marketing", false, true, true, true],
      ["abandoned cart recovery", false, true, true, true],
    ],
  },
  {
    title: "Reviews, Ratings & Community",
    rows: [
      ["Product & seller reviews", true, true, true, true],
      ["image/video reviews", true, true, true, true],
      ["Q&A", false, false, true, true],
      ["verified purchase badge", true, true, true, true],
      ["helpful vote", true, true, true, true],
      ["report abuse.", true, true, true, true],
      ["Product discussions", true, true, true, true],
      ["expert Q&A", false, true, true, true],
      ["live shopping", false, true, true, true],
      ["vendor storefronts", false, true, true, true],
      ["product curation", false, true, true, true],
      ["shoppable videos", false, true, true, true],
    ],
  },
  {
    title: "Recommendations & Artificial Intelligence (AI)",
    rows: [
      ["Related products", true, true, true, true],
      ["frequently bought together", true, true, true, true],
      ["recently viewed", true, true, true, true],
      ["AI recommendations", false, true, true, true],
      ["Natural language/voice/image search", false, false, true, true],
      ["shopping assistant", false, false, true, true],
      ["product comparison", false, false, true, true],
      ["AI-generated descriptions", false, false, true, true],
      ["SEO optimisation", false, false, true, true],
      ["price recommendations", false, false, true, true],
      ["demand forecasting", false, false, true, true],
      ["Fraud detection", false, false, true, true],
      ["fake review detection", false, false, true, true],
      ["inventory forecasting", false, false, true, true],
      ["AI customer support chatbot", false, false, true, true],
    ],
  },
  {
    title: "Payment Gateway Methods",
    rows: [
      ["credit/debit cards", false, true, true, true],
      ["UPI", false, true, true, true],
      ["Net Banking", false, true, true, true],
      ["wallets", false, true, true, true],
      ["COD", false, true, true, true],
      ["EMI", false, true, true, true],
      ["payment retry", false, true, true, true],
    ],
  },
  {
    title: "Storefront & Custom Themes",
    rows: [
      ["Custom themes", false, true, true, true],
      ["branded stores", false, true, true, true],
      ["landing pages", false, true, true, true],
      ["featured collections", false, true, true, true],
      ["inventory sync with marketplace", false, true, true, true],
      ["role-based access", false, true, true, true],
      ["audit logs", false, true, true, true],
    ],
  },
  {
    title: "Commission & Vendor Earnings Engine",
    rows: [
      ["commission-based earning", false, false, true, true],
      ["approval workflow", false, true, true, true],
      ["commission settings", false, true, true, true],
      ["Commission engine", false, false, true, true],
      ["seller payouts", false, false, true, true],
      ["wallet", false, false, true, true],
      ["settlement", false, false, true, true],
      ["refund accounting", false, false, true, true],
      ["MLM", false, false, true, true],
    ],
  },
  {
    title: "Advanced Search & Navigation",
    rows: [
      ["keyword/AI/voice search", false, false, false, true],
      ["autosuggestions", false, false, false, true],
      ["spell correction", false, false, false, true],
      ["synonyms", false, false, false, true],
      [
        "filters (brand/price/rating/availability/seller/discount)",
        false,
        true,
        true,
        true,
      ],
      ["sorting options", false, true, true, true],
    ],
  },
  {
    title: "Courier, Shipping & Logistics",
    rows: [
      ["Courier integrations", false, true, true, true],
      ["shipping labels", false, true, true, true],
      ["pickup scheduling", false, true, true, true],
      ["delivery management", false, true, true, true],
      ["reverse logistics", false, true, true, true],
    ],
  },
  {
    title: "Ad Campaigns & Sponsorships",
    rows: [
      ["Sponsored products/brands", false, true, true, true],
      ["homepage & category banners", false, true, true, true],
      ["CPC campaigns", false, false, true, true],
      ["keyword bidding", false, true, true, true],
      ["budget management", false, true, true, true],
      ["performance reports", false, true, true, true],
    ],
  },
  {
    title: "Scale Tiers & Developer APIs",
    rows: [
      ["Starter / Growth / Professional tiers", false, true, true, true],
      [
        "inventory and reporting APIs for third parties",
        false,
        true,
        true,
        true,
      ],
      ["API access", false, true, true, true],
      ["premium support", false, true, true, true],
      ["lower commission", false, true, true, true],
      ["bulk operations", false, true, true, true],
    ],
  },
  {
    title: "Market Intelligence & Competitor Analytics",
    rows: [
      ["Best-selling products", false, true, true, true],
      ["customer demographics", false, true, true, true],
      ["competitor pricing", false, true, true, true],
      ["demand forecasts", false, true, true, true],
      ["trending keywords", false, false, true, true],
      ["product comparison", false, true, true, true],
    ],
  },
  {
    title: "Financial Services & Credit Solutions",
    rows: [
      ["Seller loans", false, false, true, true],
      ["invoice financing", false, false, false, true],
      ["buy-now-pay-later", false, false, false, true],
      ["customer credit", false, false, false, true],
      ["working capital", false, false, true, true],
      ["insurance", false, false, true, true],
    ],
  },
  {
    title: "B2B Commerce Capabilities",
    rows: [
      ["MOQ", false, false, true, true],
      ["RFQs", false, false, true, true],
      ["bulk pricing", false, false, true, true],
      ["credit terms", false, false, true, true],
      ["purchase approvals", false, false, true, true],
      ["company accounts", false, false, true, true],
      ["GST invoices", false, false, true, true],
    ],
  },
  {
    title: "Global Enterprise & Multi-Store",
    rows: [
      ["Multi-country", false, false, true, true],
      ["multi-currency", false, false, true, true],
      ["multi-language", false, false, true, true],
      ["multi-tax", false, false, true, true],
      ["multi-vendor", false, true, true, true],
      ["multi-store", false, false, true, true],
    ],
  },
  {
    title: "Support Desk & Operations",
    rows: [
      ["live chat", false, false, false, true],
      ["AI chatbot", false, false, false, true],
      ["tickets", false, false, false, true],
      ["email/call support", false, false, false, true],
      ["returns support", false, false, false, true],
      ["complaint management.", false, false, false, true],
    ],
  },
];

const FAQS = [
  {
    question: "How are subscription plans activated for my business?",
    answer:
      "When you choose a plan during business registration or upgrade from your dashboard, your business is instantly provisioned with access permissions, capacity quotas, and module capabilities.",
  },
  {
    question: "Can I change or upgrade my plan at any time?",
    answer:
      "Yes. You can seamlessly upgrade or adjust your plan whenever your business expands. Your store data, product catalog, and history remain untouched.",
  },
  {
    question: "What billing models are supported on ILumaa Studio?",
    answer:
      "We support Fixed SaaS pricing (monthly/yearly), Commission-only models, Hybrid structures, and bespoke Custom Enterprise solutions.",
  },
  {
    question: "How does the Custom Enterprise plan work?",
    answer:
      "With Custom Enterprise ('Let's Talk'), our team collaborates with you to build custom modules, dedicated servers, tailored integrations, and specific SLA requirements according to your wishes.",
  },
];

function BusinessPricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("yearly");
  const [openFaq, setOpenFaq] = useState(null);
  const [plans, setPlans] = useState(DEFAULT_4_PLANS);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [searchFeature, setSearchFeature] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default active card index (Growth)

  // Fetch Business Categories & Subscription Plans from Backend API
  const loadBackendPlans = async () => {
    try {
      setLoading(true);

      const [planRes, catRes] = await Promise.allSettled([
        baseApi.get("/business-subscriptions/plans"),
        baseApi.get("/business-categories"),
      ]);

      if (catRes.status === "fulfilled") {
        const catList = catRes.value?.data?.data || catRes.value?.data || [];
        setCategories(Array.isArray(catList) ? catList : []);
      }

      if (planRes.status === "fulfilled") {
        const fetched = planRes.value?.data?.plans || planRes.value?.data?.data || planRes.value?.data || [];
        if (Array.isArray(fetched) && fetched.length > 0) {
          const top3 = fetched.slice(0, 3);
          const enterprisePlan = DEFAULT_4_PLANS[3];
          setPlans([...top3, enterprisePlan]);
        } else {
          setPlans(DEFAULT_4_PLANS);
        }
      } else {
        setPlans(DEFAULT_4_PLANS);
      }
    } catch (err) {
      console.warn("Using default 4 pricing plan cards:", err.message);
      setPlans(DEFAULT_4_PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendPlans();
  }, []);

  // Filter Plans based on selected Business Category
  const displayedPlans = useMemo(() => {
    if (selectedCategory === "ALL") return plans.slice(0, 4);

    const filtered = plans.filter((p) => {
      if (p.isCustomTalk) return true; // Enterprise plan is always included as 4th card
      const pScope = p.businessCategoryScope || "";
      const pCat = typeof p.businessCategory === "object" ? p.businessCategory?._id : p.businessCategory;
      return (
        pScope.toLowerCase() === selectedCategory.toLowerCase() ||
        pCat === selectedCategory ||
        pScope === "ECOMMERCE" ||
        !pScope
      );
    });

    return filtered.slice(0, 4);
  }, [plans, selectedCategory]);

  const getMonthlyPrice = (plan) => {
    if (plan.pricing?.monthly !== undefined) return plan.pricing.monthly;
    if (plan.monthly !== undefined) return plan.monthly;
    return 0;
  };

  const getYearlyPrice = (plan) => {
    if (plan.pricing?.yearly !== undefined) return plan.pricing.yearly;
    if (plan.yearly !== undefined) return plan.yearly;
    return 0;
  };

  const getDisplayPrice = (plan) => {
    const m = getMonthlyPrice(plan);
    const y = getYearlyPrice(plan);
    return billing === "yearly" ? y : m;
  };

  const handleSelectPlan = (plan) => {
    if (plan.isCustomTalk) {
      navigate("/help");
      return;
    }
    navigate(`/businessRegistration?plan=${plan._id}`);
  };

  const handleCardInteraction = (idx) => {
    setActiveCardIndex(idx);
  };

  const scrollToFeatureMatrix = (idx) => {
    setActiveCardIndex(idx);
    const element = document.getElementById("feature-matrix-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter feature comparison rows based on search input
  const filteredGroups = useMemo(() => {
    if (!searchFeature.trim()) return COMPARISON_GROUPS;

    const term = searchFeature.toLowerCase().trim();
    return COMPARISON_GROUPS.map((group) => {
      const matchingRows = group.rows.filter(([featureName]) =>
        featureName.toLowerCase().includes(term),
      );
      return {
        ...group,
        rows: matchingRows,
      };
    }).filter((group) => group.rows.length > 0);
  }, [searchFeature]);

  // Dynamic header titles for the 4 comparison columns matching active cards
  const columnHeaderNames = useMemo(() => {
    return plans.map((p) => p.name || "Plan");
  }, [plans]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Dukaan Style Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute top-12 left-12 h-44 w-44 rounded-full bg-violet-100/40 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600 animate-pulse" />
            Simple, Transparent & Scalable Pricing
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Choose the plan that fits
            <span className="block text-indigo-600">your business growth</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base font-medium">
            Start small, scale at your own pace, and unlock powerful e-commerce
            & multi-vendor capabilities.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100/90 p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-xl px-6 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                  billing === "monthly"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                  billing === "yearly"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Yearly Billing
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Business Category Filter Bar */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
              Filter by Industry:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                selectedCategory === "ALL"
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Categories
            </button>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat._id || cat.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    selectedCategory === (cat._id || cat.code)
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ECOMMERCE")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    selectedCategory === "ECOMMERCE"
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  E-Commerce
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("GIFTING")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    selectedCategory === "GIFTING"
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Gifting & Crafts
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("SERVICE")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                    selectedCategory === "SERVICE"
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Services
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Exactly 4 Dukaan-Style Interactive Plan Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-white border border-slate-200 p-6 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <div className="h-6 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {displayedPlans.map((plan, idx) => {
              const price = getDisplayPrice(plan);
              const isSelected = activeCardIndex === idx;
              const isEnterprise = plan.isCustomTalk;
              const isPopular = plan.popular;

              const moduleItems = Array.isArray(plan.modules)
                ? plan.modules
                    .filter((m) => m.enabled !== false)
                    .map((m) => {
                      if (typeof m.module === "object" && m.module !== null) {
                        return m.module.label || m.module.key || "Module";
                      }

                      return String(m.module || m);
                    })
                : [];

              return (
                <div
                  key={plan._id || idx}
                  onMouseEnter={() => handleCardInteraction(idx)}
                  onClick={() => handleCardInteraction(idx)}
                  className={`relative flex h-full min-w-0 cursor-pointer flex-col overflow-visible rounded-3xl bg-white p-5 sm:p-6 transition-all duration-300 ${
                    isSelected
                      ? "border-2 border-indigo-600 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-xl shadow-indigo-100/60 ring-4 ring-indigo-500/10"
                      : "border border-slate-200 shadow-sm hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                  }`}
                >
                  {/* ================= BADGE ================= */}
                  {(isPopular || isEnterprise) && (
                    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md ${
                          isEnterprise
                            ? "bg-gradient-to-r from-amber-500 to-orange-600"
                            : "bg-indigo-600"
                        }`}
                      >
                        {isEnterprise ? "Custom Solution" : "Most Popular"}
                      </span>
                    </div>
                  )}

                  {/* ================= HEADER ================= */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : isEnterprise
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isEnterprise ? (
                        <MessageSquare size={19} />
                      ) : idx === 0 ? (
                        <Store size={19} />
                      ) : idx === 1 ? (
                        <Zap size={19} />
                      ) : (
                        <Crown size={19} />
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${
                        isSelected
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : isEnterprise
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {plan.billingModel || "FIXED"}
                    </span>
                  </div>

                  {/* ================= PLAN INFO ================= */}
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">
                      {plan.name}
                    </h3>

                    <p className="mt-1.5 min-h-[38px] text-xs font-medium leading-relaxed text-slate-500">
                      {plan.description ||
                        "Everything you need to grow your business."}
                    </p>
                  </div>

                  {/* ================= PRICE ================= */}
                  <div className="my-5 border-b border-slate-100 pb-5">
                    <div className="flex min-h-[42px] items-end gap-1">
                      {isEnterprise ? (
                        <span className="text-3xl font-black tracking-tight text-amber-600">
                          Let's Talk!
                        </span>
                      ) : plan.billingModel === "COMMISSION" ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black tracking-tight text-slate-900">
                            {plan.commission?.value || 0}
                          </span>

                          <span className="text-xs font-bold text-slate-500">
                            {plan.commission?.type === "PERCENTAGE"
                              ? "% Commission"
                              : "₹ Commission"}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-3xl font-black tracking-tight text-slate-900">
                            ₹{price.toLocaleString("en-IN")}
                          </span>

                          <span className="mb-1 text-[11px] font-semibold text-slate-400">
                            /{billing === "yearly" ? "month" : "month"}
                          </span>
                        </>
                      )}
                    </div>

                    {isEnterprise && (
                      <p className="mt-1.5 text-[10px] font-semibold leading-4 text-amber-700">
                        Bespoke pricing built around your exact requirements.
                      </p>
                    )}
                  </div>

                  {/* ================= LIMITS ================= */}
                  <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <div className="mb-2.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                        Platform Limits
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Products */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Products Catalog
                        </span>

                        <strong className="text-[10px] font-black text-slate-900">
                          {typeof plan.limits?.maxProducts === "number"
                            ? plan.limits.maxProducts.toLocaleString("en-IN")
                            : plan.limits?.maxProducts || "Unlimited"}
                        </strong>
                      </div>

                      {/* Employees */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Staff Accounts
                        </span>

                        <strong className="text-[10px] font-black text-slate-900">
                          {plan.limits?.maxEmployees || "Unlimited"}
                        </strong>
                      </div>

                      {/* Vendors */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Vendor Stores
                        </span>

                        <strong className="text-[10px] font-black text-indigo-700">
                          {plan.limits?.maxVendors !== undefined
                            ? `${plan.limits.maxVendors} Stores`
                            : "Unlimited"}
                        </strong>
                      </div>

                      {/* Warehouses */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Warehouses
                        </span>

                        <strong className="text-[10px] font-black text-slate-900">
                          {plan.limits?.maxWarehouses || "Custom SLA"}
                        </strong>
                      </div>

                      {/* Templates */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Template Builder
                        </span>

                        <strong className="text-[10px] font-black text-indigo-700">
                          {plan.limits?.maxTemplates !== undefined &&
                          plan.limits?.maxTemplates !== "Unlimited"
                            ? `${plan.limits.maxTemplates} Templates`
                            : "Unlimited"}
                        </strong>
                      </div>

                      {/* Recycle Bin */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-slate-500">
                          Recycle Bin
                        </span>

                        <strong className="text-[10px] font-black text-emerald-700">
                          {plan.limits?.recycleBinDays !== undefined &&
                          plan.limits?.recycleBinDays !== "Custom"
                            ? `${plan.limits.recycleBinDays} Days`
                            : "Custom"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ================= MODULES ================= */}
                  <div className="mb-5 flex-1">
                    <div className="mb-2.5 flex items-center gap-1.5">
                      <Layers size={12} className="text-indigo-600" />

                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Included Modules
                      </span>
                    </div>

                    <div className="flex min-h-[54px] flex-wrap content-start gap-1.5">
                      {moduleItems.length > 0 ? (
                        moduleItems.map((modLabel, i) => (
                          <span
                            key={`${modLabel}-${i}`}
                            className="rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-1.5 text-[8px] font-extrabold leading-none text-indigo-800"
                          >
                            {modLabel}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[9px] font-bold text-slate-400">
                          All Core Modules Enabled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ================= ACTIONS ================= */}
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToFeatureMatrix(idx);
                      }}
                      className="mb-3 flex w-full items-center justify-center gap-1 text-[10px] font-black text-indigo-600 transition hover:text-indigo-800 hover:underline"
                    >
                      <ArrowDown size={11} />
                      See Details in Feature Matrix
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan);
                      }}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[11px] font-black transition-all ${
                        isEnterprise
                          ? "bg-amber-600 text-white shadow-sm shadow-amber-200 hover:bg-amber-700 hover:shadow-md"
                          : isSelected || isPopular
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow-md"
                            : "border border-slate-300 bg-white text-slate-800 hover:border-indigo-600 hover:bg-indigo-50/30 hover:text-indigo-600"
                      }`}
                    >
                      {isEnterprise ? (
                        <>
                          <MessageSquare size={14} />
                          Talk to Sales
                        </>
                      ) : (
                        <>
                          Get Started with {plan.name}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Comparison Table (Highlights Selected Active Column) */}
      <section
        id="feature-matrix-section"
        className="bg-white py-16 border-t border-slate-200/80 scroll-mt-6"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              COMPLETE PLATFORM FEATURE MATRIX
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Compare Features Across All 4 Tiers
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 font-medium">
              Hover or select any card above to highlight its feature column in
              real-time.
            </p>

            {/* Feature Search Box */}
            <div className="mt-6 max-w-md mx-auto relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchFeature}
                onChange={(e) => setSearchFeature(e.target.value)}
                placeholder="Search 190+ features (e.g. AI, KYC, Tax, GST, Chatbot)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition shadow-2xs font-semibold"
              />
            </div>
          </div>

          {/* Comparison Table with Column Highlighting */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[880px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 text-xs font-black text-slate-700 uppercase tracking-wider w-2/5">
                      Platform Capability / Module Feature
                    </th>
                    {columnHeaderNames.map((colName, index) => {
                      const isColSelected = activeCardIndex === index;
                      return (
                        <th
                          key={colName + index}
                          onClick={() => setActiveCardIndex(index)}
                          className={`p-4 text-center text-xs font-black uppercase tracking-wider w-1/6 cursor-pointer transition ${
                            isColSelected
                              ? "text-indigo-700 bg-indigo-100/70 border-x-2 border-indigo-500"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {colName}
                          {isColSelected && (
                            <span className="block text-[9px] font-bold text-indigo-600 normal-case mt-0.5">
                              (Active Selection)
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-400"
                      >
                        No features matched your search term "{searchFeature}".
                      </td>
                    </tr>
                  ) : (
                    filteredGroups.map((group) => (
                      <React.Fragment key={group.title}>
                        <tr className="bg-slate-100/80 border-y border-slate-200">
                          <td
                            colSpan={5}
                            className="px-4 py-2.5 font-black uppercase tracking-wider text-[11px] text-slate-800 bg-slate-100"
                          >
                            {group.title} ({group.rows.length} Features)
                          </td>
                        </tr>

                        {group.rows.map(([featureName, c1, c2, c3, c4]) => (
                          <tr
                            key={featureName}
                            className="hover:bg-slate-50/80 transition border-b border-slate-100"
                          >
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {featureName}
                            </td>

                            {[c1, c2, c3, c4].map((val, idx) => {
                              const isColActive = activeCardIndex === idx;
                              return (
                                <td
                                  key={idx}
                                  className={`text-center px-4 py-3 ${
                                    isColActive
                                      ? "bg-indigo-50/60 font-bold border-x border-indigo-200"
                                      : ""
                                  }`}
                                >
                                  {val === true ? (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold mx-auto">
                                      <Check size={12} strokeWidth={3} />
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 font-bold">
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#F8FAFC] py-16 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900">
              Subscription & Platform FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-xs text-slate-800 hover:text-indigo-600 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-4 pt-3 text-xs leading-relaxed text-slate-500 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BusinessPricing;
