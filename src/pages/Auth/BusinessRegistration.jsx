import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Lock,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Linkedin,
  Globe,
  Users,
  Check,
  BriefcaseBusiness,
  ShieldCheck,
  Zap,
  HelpCircle,
  Award,
  ExternalLink,
  X,
  AlertCircle,
  KeyRound,
  Boxes,
  CalendarCheck,
  ShoppingBag,
} from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerBusiness, sendOTP, verifyOTP } from "../../api/authService";
import baseApi from "../../api/baseApi";
import { registerOnBkonnect } from "../../api/bkonnect";

const BUSINESS_TYPES = [
  { value: "PRIVATE_LIMITED", label: "Private Limited Company" },
  { value: "PUBLIC_LIMITED", label: "Public Limited Company" },
  { value: "PARTNERSHIP", label: "Partnership Firm" },
  { value: "LLP", label: "Limited Liability Partnership (LLP)" },
  { value: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" },
  { value: "NON_PROFIT", label: "Non-Profit / NGO" },
];

const BUSINESS_CATEGORIES = [
  "Retail & E-commerce",
  "Fashion & Apparel",
  "Health & Wellness",
  "Beauty & Personal Care",
  "Electronics & Tech",
  "Food & Beverage",
  "Home & Lifestyle",
  "Services & Consulting",
  "Manufacturing",
  "Other",
];

const BUSINESS_SIZES = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "500+ Employees",
];

const getCategoryScope = (categoryVal, businessCategoriesList = []) => {
  if (!categoryVal) return "ECOMMERCE";

  const found = businessCategoriesList.find(
    (c) =>
      c._id === categoryVal || c.code === categoryVal || c.name === categoryVal,
  );
  if (found) {
    const code = (found.code || "").toUpperCase();
    const name = (found.name || "").toLowerCase();
    if (code === "SERVICE" || name.includes("service")) return "SERVICE";
    if (
      code === "BUSINESS" ||
      code === "OTHER" ||
      name.includes("both") ||
      name.includes("brand") ||
      name.includes("busi")
    )
      return "BOTH";
    return "ECOMMERCE";
  }

  const str = String(categoryVal).toUpperCase();
  if (str.includes("SERV")) return "SERVICE";
  if (
    str.includes("BOTH") ||
    str.includes("BUSI") ||
    str.includes("BRAND") ||
    str === "OTHER"
  )
    return "BOTH";
  return "ECOMMERCE";
};

const getPlanScope = (plan) => {
  const scope = (plan?.businessCategoryScope || "").toUpperCase();
  if (scope === "SERVICE") return "SERVICE";
  if (scope === "ECOMMERCE" || scope === "GIFTING") return "ECOMMERCE";
  if (scope === "BOTH" || scope === "BUSINESS") return "BOTH";

  const catCode = (
    plan?.businessCategory?.code ||
    plan?.businessCategory?.name ||
    ""
  ).toUpperCase();
  if (catCode.includes("SERVICE")) return "SERVICE";
  if (
    catCode.includes("ECOMMERCE") ||
    catCode.includes("RETAIL") ||
    catCode.includes("PRODUCT")
  )
    return "ECOMMERCE";
  if (
    catCode.includes("BOTH") ||
    catCode.includes("BRAND") ||
    catCode.includes("BUSINESS")
  )
    return "BOTH";

  const nameUpper = String(plan?.name || "").toUpperCase();
  if (nameUpper.includes("BOTH")) return "BOTH";
  if (nameUpper.includes("SERVICE")) return "SERVICE";

  return "ECOMMERCE";
};

const formatLimit = (val, suffix = "") => {
  if (val === undefined || val === null || val === "") return "Unlimited";
  if (typeof val === "string") return val;
  if (typeof val === "number") {
    if (val < 0) return "Unlimited";
    return suffix
      ? `${val.toLocaleString("en-IN")} ${suffix}`
      : val.toLocaleString("en-IN");
  }
  return String(val);
};

const getFallbackPlans = (categoryScope) => {
  const isService = categoryScope === "SERVICE";
  const isBoth = categoryScope === "BOTH";

  return [
    {
      _id: "launch",
      name: "Launch",
      description: isService
        ? "Essential appointment booking & client desk for independent providers."
        : isBoth
          ? "Essential multi-channel setup with online storefront & booking desk."
          : "Essential online shop setup with product catalog, cart & checkout.",
      pricing: { monthly: 0, yearly: 0 },
      popular: false,
      businessCategoryScope: isService
        ? "SERVICE"
        : isBoth
          ? "BUSINESS"
          : "ECOMMERCE",
      limits: {
        maxProducts: isService ? 0 : 50,
        maxWarehouses: isService ? 0 : 1,
        maxServices: isService || isBoth ? 10 : 0,
        maxBookings: isService || isBoth ? 50 : 0,
        maxEnquiries: 100,
        maxEmployees: 1,
        maxVendors: 1,
        maxTemplates: 1,
        recycleBinDays: 7,
      },
      features: isService
        ? [
            "Online appointment booking",
            "Service catalog & pricing",
            "Client inquiry desk",
            "Email notifications",
            "1 staff account",
          ]
        : isBoth
          ? [
              "Unified product & service catalog",
              "Basic storefront & bookings",
              "Inventory & order tracking",
              "Customer inquiries",
              "1 staff account",
            ]
          : [
              "Up to 50 product listings",
              "Standard checkout & cart",
              "Order management",
              "1 warehouse location",
              "1 staff account",
            ],
    },
    {
      _id: "growth",
      name: isBoth ? "Growth Both" : "Growth",
      description: isService
        ? "Advanced scheduling, staff allocation & client CRM for growing clinics & agencies."
        : isBoth
          ? "Scale hybrid operations powering retail storefront and appointment booking."
          : "Scale sales with coupon engine, multi-warehouse shipping and advanced analytics.",
      pricing: { monthly: 199, yearly: 1990, comparisonMonthly: 349, comparisonYearly: 3490 },
      popular: true,
      businessCategoryScope: isService
        ? "SERVICE"
        : isBoth
          ? "BUSINESS"
          : "ECOMMERCE",
      limits: {
        maxProducts: isService ? 0 : 500,
        maxWarehouses: isService ? 0 : 2,
        maxServices: isService || isBoth ? 50 : 0,
        maxBookings: isService || isBoth ? 500 : 0,
        maxEnquiries: 1000,
        maxEmployees: 5,
        maxVendors: 3,
        maxTemplates: 5,
        recycleBinDays: 30,
      },
      features: isService
        ? [
            "Up to 50 active services",
            "500 monthly bookings",
            "Automated booking reminders",
            "Multi-staff calendar assignment",
            "Customer review collection",
            "Advanced service analytics",
          ]
        : isBoth
          ? [
            "500 products & 50 active services",
            "Unified checkout & booking calendar",
            "POS integration & barcode support",
            "Multi-staff & vendor coordination",
            "Storefront builder with 5 themes",
            "Comprehensive business analytics",
          ]
        : [
            "Up to 500 product catalog",
            "2 warehouse hubs & dispatch",
            "Promotions & coupon engine",
            "Inventory low-stock alerts",
            "Storefront builder with 5 themes",
            "Sales reports & revenue analytics",
          ],
    },
    {
      _id: "scale",
      name: isBoth ? "Scale Both" : isService ? "Scale 123" : "Scale",
      description: isService
        ? "Enterprise-grade booking infrastructure for multi-location healthcare and consulting firms."
        : isBoth
          ? "Full-scale commerce and booking powerhouse with dedicated POS, APIs & multi-location."
          : "Maximum capacity enterprise ecommerce with multi-warehouse and high-volume order routing.",
      pricing: { monthly: 499, yearly: 5400, comparisonMonthly: 799, comparisonYearly: 7990 },
      popular: false,
      businessCategoryScope: isService
        ? "SERVICE"
        : isBoth
          ? "BUSINESS"
          : "ECOMMERCE",
      limits: {
        maxProducts: isService ? 0 : 5000,
        maxWarehouses: isService ? 0 : 5,
        maxServices: isService || isBoth ? 250 : 0,
        maxBookings: isService || isBoth ? 2500 : 0,
        maxEnquiries: 5000,
        maxEmployees: 15,
        maxVendors: 10,
        maxTemplates: 15,
        recycleBinDays: 60,
      },
      features: isService
        ? [
            "Unlimited active services & custom pricing",
            "2,500 monthly bookings",
            "Dedicated booking desk & scheduling",
            "Multi-location agency support",
            "Priority SLA support & onboarding",
          ]
        : isBoth
          ? [
              "5,000 products & 250 services",
              "High-volume catalog & multi-location",
              "Dedicated POS & booking desk",
              "Role-based permissions & audit logs",
              "Priority 24/7 technical support",
            ]
          : [
              "5,000 product catalog",
              "5 regional warehouse fulfillment hubs",
              "Bulk order import & export",
              "Automated courier dispatch APIs",
              "Priority SLA support & onboarding",
            ],
    },
  ];
};

export default function BusinessRegistration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlanParam = searchParams.get("plan") || "";
  const initialCategoryParam = searchParams.get("category") || "";

  const resolveInitialCategory = (fetchedCats = []) => {
    const lower = (initialCategoryParam || "").toLowerCase();
    if (fetchedCats.length > 0) {
      if (lower.includes("service")) {
        const found = fetchedCats.find(
          (c) =>
            (c.code || "").toUpperCase() === "SERVICE" ||
            (c.name || "").toLowerCase().includes("service"),
        );
        if (found) return found._id;
      }
      if (
        lower.includes("both") ||
        lower.includes("busin") ||
        lower.includes("brand")
      ) {
        const found = fetchedCats.find(
          (c) =>
            (c.code || "").toUpperCase() === "BUSINESS" ||
            (c.name || "").toLowerCase().includes("both") ||
            (c.name || "").toLowerCase().includes("brand") ||
            (c.name || "").toLowerCase().includes("busin"),
        );
        if (found) return found._id;
      }
      const ecom = fetchedCats.find(
        (c) =>
          (c.code || "").toUpperCase() === "ECOMMERCE" ||
          (c.name || "").toLowerCase().includes("e-com") ||
          (c.name || "").toLowerCase().includes("market"),
      );
      if (ecom) return ecom._id;
      return fetchedCats[0]._id;
    }
    return "ECOMMERCE";
  };

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [businessTypes, setBusinessTypes] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const [formData, setFormData] = useState({
    legal_business_name: "",
    business_type: "",
    business_category: resolveInitialCategory(),
    business_size: "1-10 Employees",
    business_email: "",
    business_phone: "",
    linkedin_url: "",
    website_url: "",
    ownerPassword: "",
    plan: initialPlanParam || "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // OTP Verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "business_email" && isEmailVerified) {
      setIsEmailVerified(false);
      setVerifiedEmail("");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateStep1 = () => {
    if (!formData.legal_business_name.trim()) {
      toast.error("Legal Business Name is required.");
      return false;
    }
    if (!formData.business_email.trim()) {
      toast.error("Business Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.business_email.trim())) {
      toast.error("Please enter a valid business email address.");
      return false;
    }
    if (!formData.ownerPassword || formData.ownerPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.business_phone.trim()) {
      toast.error("Contact phone number is required.");
      return false;
    }

    const digitsOnly = formData.business_phone
      .trim()
      .replace(/[\s\-\(\)\+]/g, "");
    if (
      !/^\d+$/.test(digitsOnly) ||
      (digitsOnly.length !== 10 && digitsOnly.length !== 12)
    ) {
      toast.error("Please enter a valid 10 or 12 digit mobile number.");
      return false;
    }
    return true;
  };

  const handleInitiateOtp = async () => {
    if (!validateStep1()) return;

    try {
      setOtpSending(true);
      setOtpError("");
      setOtpCode(["", "", "", "", "", ""]);
      await sendOTP(
        formData.legal_business_name,
        formData.business_email,
        "business_registration",
      );
      toast.success(`Verification code sent to ${formData.business_email}`);
      setOtpTimer(60);
      setShowOtpModal(true);
    } catch (err) {
      console.error("Failed to send OTP:", err);
      const msg =
        err.response?.data?.message || "Failed to send verification OTP.";
      toast.error(msg);
      setOtpError(msg);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpCode.join("").trim();
    if (fullOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setOtpVerifying(true);
      setOtpError("");
      await verifyOTP(formData.business_email, fullOtp);
      toast.success("Email verified successfully! Proceeding to Step 2.");
      setIsEmailVerified(true);
      setVerifiedEmail(formData.business_email.trim().toLowerCase());
      setShowOtpModal(false);
      setStep(2);
    } catch (err) {
      console.error("OTP verification failed:", err);
      const msg = err.response?.data?.message || "Invalid or expired OTP code.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleStep1Proceed = () => {
    if (!validateStep1()) return;

    if (
      isEmailVerified &&
      verifiedEmail === formData.business_email.trim().toLowerCase()
    ) {
      setStep(2);
    } else {
      handleInitiateOtp();
    }
  };

  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal && value !== "") return;

    const newOtp = [...otpCode];
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split("");
      pastedDigits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextIdx = Math.min(pastedDigits.length, 5);
      const nextInput = document.getElementById(`studio-otp-input-${nextIdx}`);
      if (nextInput) nextInput.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtpCode(newOtp);
    setOtpError("");

    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(
        `studio-otp-input-${index + 1}`,
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(
        `studio-otp-input-${index - 1}`,
      );
      if (prevInput) prevInput.focus();
    }
  };

  // Fetch Business Types & Categories dynamically from Backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setMetaLoading(true);

        const [typesRes, catsRes] = await Promise.allSettled([
          baseApi.get("/business-types"),
          baseApi.get("/business-categories"),
        ]);

        let fetchedTypes = [];
        if (typesRes.status === "fulfilled") {
          const rawData =
            typesRes.value?.data?.data || typesRes.value?.data || [];
          fetchedTypes = Array.isArray(rawData) ? rawData : [];
          setBusinessTypes(fetchedTypes);
        }

        let fetchedCats = [];
        if (catsRes.status === "fulfilled") {
          const rawData =
            catsRes.value?.data?.data || catsRes.value?.data || [];
          fetchedCats = Array.isArray(rawData) ? rawData : [];
          setBusinessCategories(fetchedCats);
        }

        const resolvedCatId = resolveInitialCategory(fetchedCats);

        setFormData((prev) => {
          const currentCat = prev.business_category;
          const isValidId = fetchedCats.some((c) => c._id === currentCat);
          return {
            ...prev,
            business_type:
              fetchedTypes.length > 0
                ? prev.business_type || fetchedTypes[0]._id
                : "",
            business_category: isValidId ? currentCat : resolvedCatId,
            plan: initialPlanParam || prev.plan,
          };
        });
      } catch (err) {
        console.error("Failed to load business metadata:", err);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();
  }, [initialCategoryParam, initialPlanParam]);

  // Fetch Subscription Plans dynamically
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await baseApi.get("business-subscriptions/plans");
        const data =
          res.data?.plans ||
          res.data?.data ||
          (Array.isArray(res.data) ? res.data : []);
        if (Array.isArray(data) && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(getFallbackPlans("ECOMMERCE"));
        }
      } catch (err) {
        console.error("Error fetching subscription plans:", err);
        setPlans(getFallbackPlans("ECOMMERCE"));
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Derive active category scope (ECOMMERCE, SERVICE, BOTH)
  const activeCategoryScope = getCategoryScope(
    formData.business_category,
    businessCategories,
  );

  // Filter plans strictly by selected category
  const filteredPlans = plans.filter((plan) => {
    const pScope = getPlanScope(plan);
    if (activeCategoryScope === "SERVICE") {
      return pScope === "SERVICE";
    }
    if (activeCategoryScope === "BOTH") {
      return pScope === "BOTH";
    }
    return pScope === "ECOMMERCE";
  });

  // Ensure formData.plan points to a valid plan within filteredPlans
  useEffect(() => {
    if (filteredPlans.length > 0) {
      const isCurrentInFiltered = filteredPlans.some(
        (p) => p._id === formData.plan,
      );
      if (!isCurrentInFiltered) {
        const defaultPlan =
          (initialPlanParam &&
            filteredPlans.find((p) => p._id === initialPlanParam)) ||
          filteredPlans.find(
            (p) =>
              p.isPopular ||
              p.popular ||
              p.name?.toLowerCase().includes("growth"),
          ) ||
          filteredPlans[1] ||
          filteredPlans[0];
        if (defaultPlan) {
          setFormData((prev) => ({ ...prev, plan: defaultPlan._id }));
        }
      }
    }
  }, [formData.business_category, activeCategoryScope, plans]);

  // Tab switch in Step 3
  const handleCategoryTabChange = (targetScope) => {
    const targetCat = businessCategories.find((c) => {
      const code = (c.code || "").toUpperCase();
      const name = (c.name || "").toLowerCase();
      if (targetScope === "SERVICE") {
        return code === "SERVICE" || name.includes("service");
      }
      if (targetScope === "BOTH") {
        return (
          code === "BUSINESS" ||
          code === "OTHER" ||
          name.includes("both") ||
          name.includes("brand") ||
          name.includes("busi")
        );
      }
      return (
        code === "ECOMMERCE" ||
        name.includes("e-com") ||
        name.includes("market")
      );
    });

    if (targetCat) {
      setFormData((prev) => ({
        ...prev,
        business_category: targetCat._id,
      }));
    }
  };

  const uniqueUserName =
    formData.legal_business_name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") +
    "_" +
    Math.floor(Math.random() * 10000);
  const registerBkonnect = async () => {
    try {
      const postData = {
        displayName: formData.legal_business_name,
        username: uniqueUserName,
        email: formData.business_email,
        password: formData.ownerPassword,
        source: "ILumaaStudio",
      };
      await registerOnBkonnect(postData);
    } catch (error) {
      console.error("Error registering on Bkonnect:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;
    if (!formData.plan) {
      toast.error("Please select a subscription plan.");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        legal_business_name: formData.legal_business_name,
        businessName: formData.legal_business_name,
        business_type: formData.business_type,
        businessType: formData.business_type,
        business_category: formData.business_category,
        businessCategory: formData.business_category,
        business_size: formData.business_size,
        businessSize: formData.business_size,
        business_email: formData.business_email,
        ownerEmail: formData.business_email,
        business_phone: formData.business_phone,
        ownerPhone: formData.business_phone,
        linkedin_url: formData.linkedin_url,
        linkedinUrl: formData.linkedin_url,
        website_url: formData.website_url,
        websiteUrl: formData.website_url,
        ownerPassword: formData.ownerPassword,
        ownerName: formData.legal_business_name,
        plan: formData.plan,
      };

      await registerBusiness(postData);
      await registerBkonnect(); // Register on Bkonnect after successful business registration
      toast.success("Business registration submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit registration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 size={42} />
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Registration Submitted!
          </h2>

          {/* Description */}
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your business account for{" "}
            <strong className="text-slate-900">
              {formData.legal_business_name}
            </strong>{" "}
            has been registered successfully.
          </p>

          {/* Email Information */}
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-left">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Mail size={16} />
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-900">
                  Check your email
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  Your onboarding information has been sent to{" "}
                  <strong>{formData.business_email}</strong>.
                </p>
              </div>
            </div>

            {/* Email Details */}
            <div className="mt-4 space-y-2 rounded-xl border border-emerald-100 bg-white/70 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span>KYC onboarding details</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span>Account login credentials</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span>Login instructions and dashboard URL</span>
              </div>
            </div>
          </div>

          {/* Login URL */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Business Dashboard Login
            </p>

            <a
              href={`${import.meta.env.VITE_DASHBOARD_URL}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block break-all text-xs font-semibold text-violet-600 hover:text-violet-700"
            >
              {`${import.meta.env.VITE_DASHBOARD_URL}/login`}
            </a>
          </div>

          {/* Review Notice */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left">
            <p className="text-xs leading-5 text-blue-800">
              <strong>What's next?</strong>
              <br />
              Please check your email for the KYC onboarding details and login
              credentials. Our SuperAdmin team will review your business
              information and KYC details before completing the approval
              process.
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_DASHBOARD_URL}/login`,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            Proceed to Business Login
            <ArrowRight size={16} />
          </button>

          {/* Small Note */}
          <p className="mt-4 text-[10px] leading-4 text-slate-400">
            Please keep your login credentials secure and do not share them with
            anyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-slate-800 selection:bg-[#C9956C] selection:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Value Prop & Trust Features */}
          <div className="hidden lg:col-span-4 lg:flex flex-col justify-between space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
                <Sparkles size={14} className="text-[#C9956C]" /> Register Your
                Commerce Portal
              </div>

              {/* Feature Cards */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mt-0.5 rounded-lg bg-amber-50 p-2 text-[#C9956C]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Executive Control & Security
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Module-wise permission assignments for employee roles &
                      vendor desks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Automated Settlements
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Streamlined vendor KYC, payouts, and automated tax
                      reporting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Multi-Channel Commerce
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seamless POS offline sales, storefront, and dashboard
                      synchronization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <HelpCircle size={16} className="text-[#C9956C]" />
                <span>
                  Questions about business setup? Contact support at{" "}
                  <strong className="text-slate-900">support@ilumaa.com</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Registration Form */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
              {/* Stepper Progress Bar */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
                  <span className={step >= 1 ? "text-[#C9956C] font-bold" : ""}>
                    1. Credentials
                  </span>
                  <span className={step >= 2 ? "text-[#C9956C] font-bold" : ""}>
                    2. Business Scale
                  </span>
                  <span className={step >= 3 ? "text-[#C9956C] font-bold" : ""}>
                    3. Choose Plan
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C9956C] to-amber-500 transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 text-xs font-medium"
              >
                {/* STEP 1: Profile & Password */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Building2 size={16} className="text-[#C9956C]" /> Step 1:
                      Account Credentials & Identity
                    </h3>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Legal Business Name *
                      </label>
                      <div className="relative">
                        <Building2
                          size={16}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          type="text"
                          name="legal_business_name"
                          value={formData.legal_business_name}
                          onChange={handleChange}
                          placeholder="e.g. Acme Enterprise Pvt Ltd"
                          required
                          maxLength={80}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-slate-700 font-semibold">
                          Business Email Address *
                        </label>
                        {isEmailVerified &&
                        verifiedEmail ===
                          formData.business_email.trim().toLowerCase() ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Email Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            Verification Required
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          type="email"
                          name="business_email"
                          value={formData.business_email}
                          onChange={handleChange}
                          placeholder="owner@company.com"
                          required
                          className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition ${
                            isEmailVerified &&
                            verifiedEmail ===
                              formData.business_email.trim().toLowerCase()
                              ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                              : "border-slate-300 focus:border-[#C9956C]"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Owner Password *
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-3 text-slate-400"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="ownerPassword"
                          value={formData.ownerPassword}
                          onChange={handleChange}
                          placeholder="Create strong login password"
                          required
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={otpSending}
                      onClick={handleStep1Proceed}
                      className="w-full py-3.5 rounded-xl bg-slate-900 font-bold text-white text-sm hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-2 shadow-md mt-4 disabled:opacity-50"
                    >
                      {otpSending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending
                          Verification Code...
                        </>
                      ) : isEmailVerified &&
                        verifiedEmail ===
                          formData.business_email.trim().toLowerCase() ? (
                        <>
                          Continue to Business Scale <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          Verify Email & Continue <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <div className="mt-3 text-[11px] text-slate-500 text-center">
                      {" "}
                      Business Account?{" "}
                      <Link
                        to={import.meta.env.VITE_DASHBOARD_URL}
                        className="font-semibold text-[#2563eb] hover:underline"
                      >
                        {" "}
                        Login Here{" "}
                      </Link>{" "}
                    </div>
                  </div>
                )}

                {/* STEP 2: Business Category & Contact */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BriefcaseBusiness size={16} className="text-[#C9956C]" />{" "}
                      Step 2: Scale & Operations
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Legal Structure
                        </label>
                        <select
                          name="business_type"
                          value={formData.business_type}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        >
                          {businessTypes.length > 0
                            ? businessTypes.map((bt) => (
                                <option key={bt._id} value={bt._id}>
                                  {bt.name} ({bt.code || "Type"})
                                </option>
                              ))
                            : BUSINESS_TYPES.map((bt) => (
                                <option key={bt.value} value={bt.value}>
                                  {bt.label}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Business Category / Industry *
                        </label>
                        <select
                          name="business_category"
                          value={formData.business_category}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        >
                          {businessCategories.length > 0 ? (
                            businessCategories.map((cat) => {
                              const code = (cat.code || "").toUpperCase();
                              const name = (cat.name || "").toLowerCase();
                              let label = cat.name;
                              if (
                                code === "ECOMMERCE" ||
                                name.includes("market") ||
                                name.includes("e-com")
                              ) {
                                label =
                                  "E-Commerce (Product Marketplace & Online Retail)";
                              } else if (
                                code === "SERVICE" ||
                                name.includes("service")
                              ) {
                                label =
                                  "Services (Service Provider & Appointments)";
                              } else if (
                                code === "BUSINESS" ||
                                code === "OTHER" ||
                                name.includes("both") ||
                                name.includes("brand") ||
                                name.includes("busi")
                              ) {
                                label = "Both (E-Commerce Products & Services)";
                              }
                              return (
                                <option key={cat._id} value={cat._id}>
                                  {label}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              Loading categories...
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Employee Scale
                        </label>
                        <select
                          name="business_size"
                          value={formData.business_size}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        >
                          {BUSINESS_SIZES.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Contact Phone *
                        </label>
                        <div className="relative">
                          <Phone
                            size={16}
                            className="absolute left-3.5 top-3 text-slate-400"
                          />
                          <input
                            type="text"
                            name="business_phone"
                            value={formData.business_phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            required
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#C9956C] focus:bg-white outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5">
                          Website URL (Optional)
                        </label>
                        <div className="relative">
                          <Globe
                            size={16}
                            className="absolute left-3.5 top-3 text-slate-400"
                          />
                          <input
                            type="url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            placeholder="https://company.com"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#C9956C] focus:bg-white outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          LinkedIn Profile (Optional)
                        </label>
                        <div className="relative">
                          <Linkedin
                            size={16}
                            className="absolute left-3.5 top-3 text-slate-400"
                          />
                          <input
                            type="url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/company/acme"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#C9956C] focus:bg-white outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-3 px-5 rounded-xl border border-slate-300 font-bold text-slate-700 text-sm hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (validateStep2()) setStep(3);
                        }}
                        className="flex-1 py-3.5 rounded-xl bg-slate-900 font-bold text-white text-sm hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        Select Platform Plan <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Plan Selection & Submit */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* =====================================================
        HEADER
    ====================================================== */}

                    {/* =====================================================
                        BILLING CYCLE TOGGLE
                    ====================================================== */}
                    {!plansLoading && filteredPlans.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-1">
                        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              billingCycle === "monthly"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Monthly Billing
                          </button>
                          <button
                            type="button"
                            onClick={() => setBillingCycle("yearly")}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              billingCycle === "yearly"
                                ? "bg-[#C9956C] text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <span>Yearly Billing</span>
                            <span className="rounded-full bg-emerald-500/20 text-emerald-800 text-[10px] font-black px-2 py-0.5 border border-emerald-400/30">
                              SAVE 20%
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* =====================================================
                        LOADING STATE
                    ====================================================== */}
                    {plansLoading ? (
                      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
                        <div className="text-center p-8">
                          <Loader2
                            size={32}
                            className="mx-auto animate-spin text-[#C9956C]"
                          />
                          <p className="mt-3 text-xs font-bold text-slate-600">
                            Loading subscription plans...
                          </p>
                        </div>
                      </div>
                    ) : filteredPlans.length === 0 ? (
                      /* ===================================================
                          EMPTY STATE
                      ==================================================== */
                      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-8 sm:p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-[#C9956C]">
                          <Sparkles size={24} />
                        </div>
                        <h4 className="mt-4 text-base font-extrabold text-slate-900">
                          No active plans found for this category
                        </h4>
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                          Try switching to another category tab above to explore
                          available plans.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCategoryTabChange("ECOMMERCE")}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            View E-Commerce Plans
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCategoryTabChange("SERVICE")}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            View Service Plans
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ===================================================
                          FILTERED PRICING CARDS (MOBILE & DESKTOP OPTIMIZED)
                      ==================================================== */
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                        {filteredPlans.map((plan) => {
                          const isSelected = formData.plan === plan._id;
                          const planScope = getPlanScope(plan);

                          const monthlyPrice = Number(
                            plan.pricing?.monthly ?? plan.price ?? 0,
                          );

                          const yearlyPrice = Number(
                            plan.pricing?.yearly ??
                              plan.pricing?.annual ??
                              plan.yearlyPrice ??
                              0,
                          );

                          const calculatedYearlyPrice =
                            yearlyPrice > 0
                              ? yearlyPrice
                              : Math.round(monthlyPrice * 12 * 0.8);

                          const currentPrice =
                            billingCycle === "yearly"
                              ? calculatedYearlyPrice
                              : monthlyPrice;

                          const monthlyEquivalent =
                            billingCycle === "yearly"
                              ? Math.round(calculatedYearlyPrice / 12)
                              : monthlyPrice;

                          const yearlySavings =
                            monthlyPrice > 0
                              ? Math.max(
                                  0,
                                  monthlyPrice * 12 - calculatedYearlyPrice,
                                )
                              : 0;

                          const compMonthlyPrice = Number(
                            plan.pricing?.comparisonMonthly ??
                              plan.pricing?.comparisonPriceMonthly ??
                              plan.pricing?.comparisonMonthlyPrice ??
                              0,
                          );

                          const compYearlyPrice = Number(
                            plan.pricing?.comparisonYearly ??
                              plan.pricing?.comparisonPriceYearly ??
                              plan.pricing?.comparisonYearlyPrice ??
                              0,
                          );

                          const currentComparisonPrice =
                            billingCycle === "yearly"
                              ? compYearlyPrice
                              : compMonthlyPrice;

                          const hasComparisonDiscount =
                            currentComparisonPrice > currentPrice &&
                            currentComparisonPrice > 0;

                          const comparisonDiscountPercent =
                            hasComparisonDiscount
                              ? Math.round(
                                  ((currentComparisonPrice - currentPrice) /
                                    currentComparisonPrice) *
                                    100,
                                )
                              : 0;

                          const isPopular =
                            plan.isPopular ||
                            plan.is_popular ||
                            plan.popular ||
                            plan.name?.toLowerCase().includes("growth");

                          const features =
                            plan.features ||
                            plan.includedFeatures ||
                            plan.included_features ||
                            plan.benefits ||
                            [];

                          return (
                            <div
                              key={plan._id}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  plan: plan._id,
                                }))
                              }
                              className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border-2 bg-white transition-all duration-300 ${
                                isSelected
                                  ? "border-[#C9956C] shadow-xl shadow-[#C9956C]/15 ring-2 ring-[#C9956C]/20"
                                  : isPopular
                                    ? "border-amber-400/70 shadow-md hover:border-[#C9956C] hover:shadow-xl"
                                    : "border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-lg"
                              }`}
                            >
                              {/* Popular Badge */}
                              {isPopular && (
                                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                                  <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#C9956C] to-amber-600 px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                                    Most Popular
                                  </span>
                                </div>
                              )}

                              {/* Selected Badge */}
                              {isSelected && (
                                <div className="absolute right-3.5 top-3.5 z-10">
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 shadow-2xs">
                                    <CheckCircle2 size={12} />
                                    Selected
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-1 flex-col p-5 sm:p-6">
                                {/* Header / Title */}
                                <div className="pt-2">
                                  <div className="flex items-center justify-between gap-2 pr-16 sm:pr-20">
                                    <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                      {plan.name}
                                    </h4>
                                    <span
                                      className={`rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                                        planScope === "SERVICE"
                                          ? "bg-violet-50 text-violet-700 border border-violet-200"
                                          : planScope === "ECOMMERCE"
                                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                      }`}
                                    >
                                      {planScope === "SERVICE"
                                        ? "Service Plan"
                                        : planScope === "ECOMMERCE"
                                          ? "E-Commerce"
                                          : "Both (Unified)"}
                                    </span>
                                  </div>

                                  <p className="mt-1.5 min-h-[36px] text-xs leading-relaxed text-slate-500">
                                    {plan.description ||
                                      `Everything you need to launch and scale with ${plan.name}.`}
                                  </p>
                                </div>

                                {/* Price Container */}
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                  {hasComparisonDiscount && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm sm:text-base font-bold text-slate-400 line-through">
                                        ₹{currentComparisonPrice.toLocaleString("en-IN")}
                                      </span>
                                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                                        {comparisonDiscountPercent}% OFF
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                                      ₹{currentPrice.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">
                                      /
                                      {billingCycle === "yearly"
                                        ? "year"
                                        : "month"}
                                    </span>
                                  </div>

                                  {/* Yearly equivalent or free label */}
                                  {billingCycle === "yearly" &&
                                    monthlyPrice > 0 && (
                                      <p className="mt-1 text-[11px] font-medium text-slate-400">
                                        Equivalent to ₹
                                        {monthlyEquivalent.toLocaleString(
                                          "en-IN",
                                        )}
                                        /month
                                      </p>
                                    )}

                                  {billingCycle === "yearly" &&
                                    yearlySavings > 0 && (
                                      <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
                                        <span className="text-[10px] font-extrabold text-emerald-700">
                                          Save ₹
                                          {yearlySavings.toLocaleString(
                                            "en-IN",
                                          )}
                                          /year
                                        </span>
                                      </div>
                                    )}
                                </div>

                                {/* Capacity Limits Box */}
                                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-left">
                                  <div className="mb-2.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9956C]" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                                      Included Capacity Limits
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {/* E-Commerce limits */}
                                    {(planScope === "ECOMMERCE" ||
                                      planScope === "BOTH") && (
                                      <div className="space-y-1 border-b border-slate-200/60 pb-2">
                                        <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-800">
                                          <Boxes
                                            size={11}
                                            className="text-amber-600"
                                          />
                                          <span>E-Commerce Limits</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-500">
                                            Product Catalog
                                          </span>
                                          <strong className="font-extrabold text-slate-900">
                                            {formatLimit(
                                              plan.limits?.maxProducts,
                                            )}
                                          </strong>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-500">
                                            Warehouses
                                          </span>
                                          <strong className="font-extrabold text-slate-900">
                                            {formatLimit(
                                              plan.limits?.maxWarehouses,
                                              typeof plan.limits
                                                ?.maxWarehouses === "number"
                                                ? "Hubs"
                                                : "",
                                            )}
                                          </strong>
                                        </div>
                                      </div>
                                    )}

                                    {/* Service limits */}
                                    {(planScope === "SERVICE" ||
                                      planScope === "BOTH") && (
                                      <div className="space-y-1 border-b border-slate-200/60 pb-2">
                                        <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-violet-800">
                                          <CalendarCheck
                                            size={11}
                                            className="text-violet-600"
                                          />
                                          <span>Service & Booking Limits</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-500">
                                            Active Services
                                          </span>
                                          <strong className="font-extrabold text-slate-900">
                                            {formatLimit(
                                              plan.limits?.maxServices,
                                            )}
                                          </strong>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-500">
                                            Monthly Bookings
                                          </span>
                                          <strong className="font-extrabold text-slate-900">
                                            {formatLimit(
                                              plan.limits?.maxBookings,
                                            )}
                                          </strong>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-slate-500">
                                            Client Inquiries
                                          </span>
                                          <strong className="font-extrabold text-slate-900">
                                            {formatLimit(
                                              plan.limits?.maxEnquiries,
                                            )}
                                          </strong>
                                        </div>
                                      </div>
                                    )}

                                    {/* Operational limits */}
                                    <div className="space-y-1 pt-0.5">
                                      <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                                        <Users
                                          size={11}
                                          className="text-emerald-600"
                                        />
                                        <span>Team & Operations</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-500">
                                          Staff Accounts
                                        </span>
                                        <strong className="font-extrabold text-slate-900">
                                          {formatLimit(
                                            plan.limits?.maxEmployees,
                                          )}
                                        </strong>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-500">
                                          Vendor Stores
                                        </span>
                                        <strong className="font-extrabold text-indigo-700">
                                          {formatLimit(
                                            plan.limits?.maxVendors,
                                            typeof plan.limits?.maxVendors ===
                                              "number"
                                              ? "Stores"
                                              : "",
                                          )}
                                        </strong>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-500">
                                          Storefront Themes
                                        </span>
                                        <strong className="font-extrabold text-indigo-700">
                                          {formatLimit(
                                            plan.limits?.maxTemplates,
                                            typeof plan.limits?.maxTemplates ===
                                              "number"
                                              ? "Themes"
                                              : "",
                                          )}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Features List */}
                                <div className="mt-5 flex-1 border-t border-slate-100 pt-4">
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                      Features Included
                                    </p>
                                    {features.length > 0 && (
                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-600">
                                        {features.length} features
                                      </span>
                                    )}
                                  </div>

                                  <div className="space-y-2.5">
                                    {features.length > 0 ? (
                                      features
                                        .slice(0, 5)
                                        .map((feature, idx) => {
                                          const featureName =
                                            typeof feature === "string"
                                              ? feature
                                              : feature?.name ||
                                                feature?.label ||
                                                feature?.title;
                                          return (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-2 text-xs text-slate-600 leading-tight"
                                            >
                                              <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <Check
                                                  size={9}
                                                  strokeWidth={3}
                                                />
                                              </span>
                                              <span>{featureName}</span>
                                            </div>
                                          );
                                        })
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={13}
                                            className="text-emerald-500 shrink-0"
                                          />
                                          <span>Dashboard & Inventory</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={13}
                                            className="text-emerald-500 shrink-0"
                                          />
                                          <span>
                                            Order & Customer Management
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={13}
                                            className="text-emerald-500 shrink-0"
                                          />
                                          <span>Reporting & Insights</span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {features.length > 5 && (
                                    <p className="mt-2.5 text-[10px] font-bold text-slate-400">
                                      + {features.length - 5} more features
                                    </p>
                                  )}
                                </div>

                                {/* Full Plan Details Link */}
                                <a
                                  href={`${import.meta.env.VITE_STUDIO_URL}/business-pricing`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 flex w-full items-center justify-center gap-1 border-t border-slate-100 pt-3 text-xs font-bold text-[#C9956C] hover:text-[#a8744b] transition"
                                >
                                  <span>View detailed breakdown</span>
                                  <ExternalLink size={12} />
                                </a>

                                {/* Select Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      plan: plan._id,
                                    }));
                                  }}
                                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 sm:py-3.5 text-xs font-black transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#C9956C] text-white shadow-md shadow-[#C9956C]/25"
                                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <CheckCircle2 size={15} />
                                      Plan Selected
                                    </>
                                  ) : (
                                    <>
                                      Choose Plan
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

                    {/* =====================================================
        TRUST / INFO
    ====================================================== */}
                    {!plansLoading && plans.length > 0 && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#C9956C] shadow-sm">
                            <Sparkles size={15} />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Not sure which plan to choose?
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              Start with a plan that matches your current
                              business size. You can upgrade as your business
                              grows.
                            </p>

                            <a
                              href={`${import.meta.env.VITE_STUDIO_URL}/business-pricing`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <button
                                type="button"
                                className="mt-2 text-[11px] font-bold text-[#C9956C] hover:underline"
                              >
                                Compare all features →
                              </button>{" "}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* =====================================================
        FOOTER ACTIONS
    ====================================================== */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={
                          loading || (!formData.plan && plans.length > 0)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C9956C] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#C9956C]/20 transition hover:bg-[#b07d54] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Submitting Registration...
                          </>
                        ) : (
                          <>
                            Complete Business Registration
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Selection Warning */}
                    {!formData.plan && plans.length > 0 && (
                      <p className="text-center text-[11px] font-medium text-amber-600">
                        Please select a plan before completing your
                        registration.
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 relative">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C9956C] flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
              <Mail size={28} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C9956C] bg-amber-50 px-3 py-1 rounded-full">
                Email Ownership Verification
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Verify Business Email
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                We've sent a 6-digit verification code to{" "}
                <strong className="text-slate-800">
                  {formData.business_email}
                </strong>
                . Enter the code below to confirm and proceed to the next step.
              </p>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`studio-otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border border-slate-300 bg-slate-50 text-slate-900 outline-none focus:border-[#C9956C] focus:bg-white focus:ring-2 focus:ring-[#C9956C]/20 transition"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-rose-500 font-bold flex items-center justify-center gap-1">
                <AlertCircle size={13} />
                {otpError}
              </p>
            )}

            {/* Verify Button */}
            <button
              type="button"
              disabled={otpVerifying || otpCode.join("").length !== 6}
              onClick={handleVerifyOtpSubmit}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
            >
              {otpVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying
                  Code...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Verify & Proceed to Step 2
                </>
              )}
            </button>

            {/* Resend Timer & Change Email */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Change Email
              </button>

              <div>
                {otpTimer > 0 ? (
                  <span className="text-slate-400 font-medium">
                    Resend code in{" "}
                    <strong className="text-slate-700">{otpTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={otpSending}
                    onClick={handleInitiateOtp}
                    className="text-[#C9956C] hover:underline font-bold cursor-pointer"
                  >
                    {otpSending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
