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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerBusiness, sendOTP, verifyOTP } from "../../api/authService";
import baseApi from "../../api/baseApi";

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

export default function BusinessRegistration() {
  const navigate = useNavigate();
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
    business_category: "",
    business_size: "1-10 Employees",
    business_email: "",
    business_phone: "",
    linkedin_url: "",
    website_url: "",
    ownerPassword: "",
    plan: "",
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
        "business_registration"
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
      const nextInput = document.getElementById(`studio-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`studio-otp-input-${index - 1}`);
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

        setFormData((prev) => ({
          ...prev,
          business_type: fetchedTypes.length > 0 ? fetchedTypes[0]._id : "",
          business_category: fetchedCats.length > 0 ? fetchedCats[0]._id : "",
        }));
      } catch (err) {
        console.error("Failed to load business metadata:", err);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Fetch Subscription Plans dynamically based on selected Category & Type
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const queryParams = new URLSearchParams();
        if (formData.business_category)
          queryParams.append("businessCategory", formData.business_category);
        // if (formData.business_type)
        //   queryParams.append("businessType", formData.business_type);

        const res = await baseApi.get(
          `business-subscriptions/plans?${queryParams.toString()}`,
        );
        const data =
          res.data?.plans ||
          res.data?.data ||
          (Array.isArray(res.data) ? res.data : []);
        setPlans(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          const defaultPlan = data.find((p) => p.isPopular) || data[0];
          setFormData((prev) => ({ ...prev, plan: defaultPlan._id }));
        }
      } catch (err) {
        console.error("Error fetching subscription plans:", err);
      } finally {
        setPlansLoading(false);
      }
    };

    if (formData.business_category || formData.business_type) {
      fetchPlans();
    }
  }, [formData.business_category, formData.business_type]);

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

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Join thousands of leading brands using ILumaa to manage
                multi-channel commerce, inventory, staff permissions, and vendor
                payouts in one unified platform.
              </p>

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
                          <Loader2 size={16} className="animate-spin" /> Sending Verification Code...
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
                          Industry Category
                        </label>
                        <select
                          name="business_category"
                          value={formData.business_category}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-[#C9956C] focus:bg-white outline-none transition"
                        >
                          {businessCategories.length > 0
                            ? businessCategories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name} ({cat.code || "Scope"})
                                </option>
                              ))
                            : BUSINESS_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
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
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Sparkles size={17} className="text-[#C9956C]" />
                          Step 3: Choose Your Plan
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          Select the plan that best fits your business. You can
                          upgrade or change your plan later.
                        </p>
                      </div>

                      {/* Full Pricing Page */}
                      <a
                        href={`${import.meta.env.VITE_STUDIO_URL}/business-pricing`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <button
                          type="button"
                          className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#C9956C] hover:text-[#C9956C] sm:flex"
                        >
                          Compare Plans
                          <ExternalLink size={13} />
                        </button>
                      </a>
                    </div>

                    {/* Mobile Pricing Link */}
                    <a
                      href={`${import.meta.env.VITE_STUDIO_URL}/business-pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#C9956C] sm:hidden"
                      >
                        Compare all plans
                        <ExternalLink size={13} />
                      </button>
                    </a>

                    {/* =====================================================
        BILLING TOGGLE
    ====================================================== */}
                    {!plansLoading && plans.length > 0 && (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                        <span className="text-xs font-semibold text-slate-600">
                          Choose billing cycle
                        </span>

                        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => setBillingCycle("monthly")}
                            className={`rounded-lg px-5 py-2 text-xs font-bold transition ${
                              billingCycle === "monthly"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Monthly
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillingCycle("yearly")}
                            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition ${
                              billingCycle === "yearly"
                                ? "bg-[#C9956C] text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Yearly
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                                billingCycle === "yearly"
                                  ? "bg-white/20 text-white"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              SAVE
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* =====================================================
        LOADING
    ====================================================== */}
                    {plansLoading ? (
                      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                        <div className="text-center">
                          <Loader2
                            size={28}
                            className="mx-auto animate-spin text-[#C9956C]"
                          />

                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Loading available plans...
                          </p>
                        </div>
                      </div>
                    ) : plans.length === 0 ? (
                      /* ===================================================
          NO PLANS
      ==================================================== */
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Sparkles size={20} />
                        </div>

                        <h4 className="mt-4 text-sm font-bold text-slate-800">
                          No active plans available
                        </h4>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                          You can continue with the default trial plan. Our team
                          can help you choose a plan after registration.
                        </p>
                      </div>
                    ) : (
                      /* ===================================================
          PRICING CARDS
      ==================================================== */
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {plans.map((plan) => {
                          const isSelected = formData.plan === plan._id;

                          /* -----------------------------------------------
             PRICE
          ------------------------------------------------ */

                          const monthlyPrice = Number(
                            plan.pricing?.monthly ?? plan.price ?? 0,
                          );

                          const yearlyPrice = Number(
                            plan.pricing?.yearly ??
                              plan.pricing?.annual ??
                              plan.yearlyPrice ??
                              0,
                          );

                          /*
                           * If backend does not provide yearly pricing,
                           * calculate it using 20% annual discount.
                           */
                          const calculatedYearlyPrice =
                            yearlyPrice > 0
                              ? yearlyPrice
                              : Math.round(monthlyPrice * 12 * 0.8);

                          const currentPrice =
                            billingCycle === "yearly"
                              ? calculatedYearlyPrice
                              : monthlyPrice;

                          /* -----------------------------------------------
             MONTHLY EQUIVALENT FOR YEARLY
          ------------------------------------------------ */

                          const monthlyEquivalent =
                            billingCycle === "yearly"
                              ? Math.round(calculatedYearlyPrice / 12)
                              : monthlyPrice;

                          /* -----------------------------------------------
             SAVINGS
          ------------------------------------------------ */

                          const yearlySavings =
                            monthlyPrice > 0
                              ? Math.max(
                                  0,
                                  monthlyPrice * 12 - calculatedYearlyPrice,
                                )
                              : 0;

                          /* -----------------------------------------------
             POPULAR
          ------------------------------------------------ */

                          const isPopular =
                            plan.isPopular ||
                            plan.is_popular ||
                            plan.popular ||
                            plan.name?.toLowerCase().includes("growth");

                          /* -----------------------------------------------
             FEATURES
          ------------------------------------------------ */

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
                              className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
                                isSelected
                                  ? "border-[#C9956C] shadow-xl shadow-[#C9956C]/10"
                                  : isPopular
                                    ? "border-[#DDBA9B] shadow-md"
                                    : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                              }`}
                            >
                              {/* =========================================
                  POPULAR BADGE
              ========================================== */}
                              {isPopular && (
                                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                                  <span className="whitespace-nowrap rounded-full bg-[#C9956C] px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
                                    Most Popular
                                  </span>
                                </div>
                              )}

                              {/* =========================================
                  SELECTED BADGE
              ========================================== */}
                              {isSelected && (
                                <div className="absolute right-4 top-4">
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                                    <CheckCircle2 size={11} />
                                    Selected
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-1 flex-col p-6">
                                {/* =======================================
                    PLAN NAME
                ======================================== */}
                                <div className="pt-4">
                                  <h4 className="text-lg font-extrabold text-slate-900">
                                    {plan.name}
                                  </h4>

                                  <p className="mt-1.5 min-h-[38px] text-xs leading-5 text-slate-500">
                                    {plan.description ||
                                      `Everything you need to grow with ${plan.name}.`}
                                  </p>
                                </div>

                                {/* =======================================
                    PRICE
                ======================================== */}
                                <div className="mt-6">
                                  <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black tracking-tight text-slate-900">
                                      ₹{currentPrice.toLocaleString("en-IN")}
                                    </span>

                                    <span className="mb-1 text-xs text-slate-400">
                                      /
                                      {billingCycle === "yearly"
                                        ? "year"
                                        : "month"}
                                    </span>
                                  </div>

                                  {/* Yearly equivalent */}
                                  {billingCycle === "yearly" &&
                                    monthlyPrice > 0 && (
                                      <p className="mt-1 text-[10px] text-slate-400">
                                        Equivalent to ₹
                                        {monthlyEquivalent.toLocaleString(
                                          "en-IN",
                                        )}
                                        /month
                                      </p>
                                    )}

                                  {/* Savings */}
                                  {billingCycle === "yearly" &&
                                    yearlySavings > 0 && (
                                      <div className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1">
                                        <span className="text-[10px] font-bold text-emerald-700">
                                          Save ₹
                                          {yearlySavings.toLocaleString(
                                            "en-IN",
                                          )}
                                          /year
                                        </span>
                                      </div>
                                    )}
                                </div>

                                {/* =======================================
                    FEATURES
                ======================================== */}
                                <div className="mt-6 flex-1 border-t border-slate-100 pt-5">
                                  <div className="mb-4 flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                      What's included
                                    </p>

                                    {features.length > 0 && (
                                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                                        {features.length} FEATURES
                                      </span>
                                    )}
                                  </div>

                                  <div className="space-y-3">
                                    {features.length > 0 ? (
                                      features
                                        .slice(0, 6)
                                        .map((feature, index) => {
                                          const featureName =
                                            typeof feature === "string"
                                              ? feature
                                              : feature?.name ||
                                                feature?.label ||
                                                feature?.title;

                                          return (
                                            <div
                                              key={index}
                                              className="flex items-start gap-2.5 text-xs text-slate-600"
                                            >
                                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <Check
                                                  size={10}
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
                                            size={14}
                                            className="text-emerald-500"
                                          />
                                          Store management
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={14}
                                            className="text-emerald-500"
                                          />
                                          Product management
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={14}
                                            className="text-emerald-500"
                                          />
                                          Order management
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                          <Check
                                            size={14}
                                            className="text-emerald-500"
                                          />
                                          Customer management
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {/* More features */}
                                  {features.length > 6 && (
                                    <p className="mt-4 text-[10px] font-semibold text-slate-400">
                                      + {features.length - 6} more features
                                      included
                                    </p>
                                  )}
                                </div>

                                {/* =======================================
                    FULL DETAILS
                ======================================== */}
                                <a
                                  href={`${import.meta.env.VITE_STUDIO_URL}/business-pricing`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <button
                                    type="button"
                                    className="mt-6 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-bold text-[#C9956C] transition hover:text-[#b07d54]"
                                  >
                                    See full plan details
                                    <ExternalLink size={13} />
                                  </button>{" "}
                                </a>

                                {/* =======================================
                    SELECT BUTTON
                ======================================== */}
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    setFormData((prev) => ({
                                      ...prev,
                                      plan: plan._id,
                                    }));
                                  }}
                                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-extrabold transition ${
                                    isSelected
                                      ? "bg-[#C9956C] text-white shadow-md shadow-[#C9956C]/20"
                                      : "bg-slate-900 text-white hover:bg-slate-800"
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
                <strong className="text-slate-800">{formData.business_email}</strong>.
                Enter the code below to confirm and proceed to the next step.
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
                  <Loader2 size={16} className="animate-spin" /> Verifying Code...
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
                    Resend code in <strong className="text-slate-700">{otpTimer}s</strong>
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
