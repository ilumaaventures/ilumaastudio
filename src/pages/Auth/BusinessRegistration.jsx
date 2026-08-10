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
  Briefcase,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerBusiness } from "../../api/authService";
import baseApi from "../../api/baseApi";

const BUSINESS_TYPES = [
  { value: "PRIVATE_LIMITED", label: "PRIVATE_LIMITED (Private Limited)" },
  { value: "PUBLIC_LIMITED", label: "PUBLIC_LIMITED (Public Limited)" },
  { value: "LLP", label: "LLP (Limited Liability Partnership)" },
  { value: "PARTNERSHIP", label: "PARTNERSHIP (Partnership Firm)" },
  { value: "SOLE_PROPRIETORSHIP", label: "SOLE_PROPRIETORSHIP (Sole Proprietorship)" },
  { value: "ONE_PERSON_COMPANY", label: "ONE_PERSON_COMPANY (One Person Company)" },
  { value: "NGO", label: "NGO (Non-Governmental Org)" },
  { value: "TRUST", label: "TRUST (Trust)" },
  { value: "SOCIETY", label: "SOCIETY (Society)" },
  { value: "INDIVIDUAL", label: "INDIVIDUAL (Individual)" },
  { value: "OTHER", label: "OTHER (Other Structure)" },
];

const BUSINESS_CATEGORIES = [
  { value: "ECOMMERCE", label: "ECOMMERCE (E-Commerce Store)" },
  { value: "GIFTING", label: "GIFTING (Gifting & Vouchers)" },
  { value: "SERVICE", label: "SERVICE (Service Provider)" },
  { value: "OTHER", label: "OTHER (Other Operations)" },
];

export default function BusinessRegistration() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [plansList, setPlansList] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const [formData, setFormData] = useState({
    legal_business_name: "",
    business_type: "SOLE_PROPRIETORSHIP",
    business_category: "ECOMMERCE",
    business_email: "",
    business_phone: "",
    ownerPassword: "",
    plan: "",
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await baseApi.get("/business-subscriptions/plans");
        if (res.data?.plans && res.data.plans.length > 0) {
          setPlansList(res.data.plans);
          setFormData((prev) => ({ ...prev, plan: res.data.plans[0]._id }));
        }
      } catch (err) {
        console.warn("Could not fetch subscription plans:", err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordQuality = (password) => {
    if (!password) return null;
    if (password.length < 6) return { text: "Too short (min 6 chars)", color: "text-red-500" };
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (hasLetter && (hasNumber || hasSymbol) && password.length >= 8) {
      return { text: "High Quality (Strong)", color: "text-emerald-600" };
    } else if (hasLetter && (hasNumber || hasSymbol)) {
      return { text: "High Quality (Good)", color: "text-blue-600" };
    } else {
      return { text: "Add numbers or special characters", color: "text-amber-500" };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextTab = () => {
    if (!formData.legal_business_name.trim()) {
      toast.error("Please enter your Business Name.");
      return;
    }
    if (!isValidEmail(formData.business_email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.business_phone.trim()) {
      toast.error("Please enter your Phone Number.");
      return;
    }
    if (formData.ownerPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(formData.ownerPassword);
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.ownerPassword);
    if (!hasLetter || !hasNumberOrSymbol) {
      toast.error("High quality password required: please include letters and numbers/symbols.");
      return;
    }

    setActiveTab(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.legal_business_name || !formData.business_email || !formData.business_phone) {
      toast.error("Please complete basic information.");
      setActiveTab(1);
      return;
    }

    if (!isValidEmail(formData.business_email)) {
      toast.error("Please enter a valid email address.");
      setActiveTab(1);
      return;
    }

    if (formData.ownerPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setActiveTab(1);
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(formData.ownerPassword);
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.ownerPassword);
    if (!hasLetter || !hasNumberOrSymbol) {
      toast.error("High quality password required: please include letters and numbers/symbols.");
      setActiveTab(1);
      return;
    }

    setLoading(true);

    try {
      const postData = {
        legal_business_name: formData.legal_business_name,
        businessName: formData.legal_business_name,
        business_type: formData.business_type,
        businessType: formData.business_type,
        business_category: formData.business_category,
        businessCategory: formData.business_category,
        business_email: formData.business_email,
        ownerEmail: formData.business_email,
        business_phone: formData.business_phone,
        ownerPhone: formData.business_phone,
        ownerPassword: formData.ownerPassword,
        plan: formData.plan,
        ownerName: formData.legal_business_name,
      };

      await registerBusiness(postData);
      toast.success("Business Registration Request Submitted!");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans py-24">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={42} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Registration Request Sent!</h1>
            <p className="text-slate-600 text-sm">
              Registration request submitted for <strong className="text-slate-900">{formData.legal_business_name}</strong> ({formData.business_type} • {formData.business_category}).
            </p>
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            Confirmation email sent to <strong>{formData.business_email}</strong>. Once approved, complete your KYC.
          </p>
          <button onClick={() => navigate("/")} className="w-full py-3.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow hover:bg-emerald-700 transition">
            Back to Studio Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-3">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest inline-block">
            ILumaa Studio Onboarding
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Register Studio Business</h1>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          <button type="button" onClick={() => setActiveTab(1)} className={`p-4 rounded-2xl border flex items-center gap-3 ${activeTab === 1 ? "bg-white border-emerald-600 shadow-md" : "bg-white/60 border-slate-200 text-slate-500"}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${activeTab === 1 ? "bg-emerald-600 text-white" : "bg-slate-100"}`}>1</div>
            <span className="text-xs font-bold">1. Basic Info & Category</span>
          </button>
          <button type="button" onClick={handleNextTab} className={`p-4 rounded-2xl border flex items-center gap-3 ${activeTab === 2 ? "bg-white border-emerald-600 shadow-md" : "bg-white/60 border-slate-200 text-slate-500"}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${activeTab === 2 ? "bg-emerald-600 text-white" : "bg-slate-100"}`}>2</div>
            <span className="text-xs font-bold">2. Subscription Plan</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-slate-800 border-b pb-2 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-600" /> Basic Details & Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Business Name *</label>
                    <input type="text" name="legal_business_name" value={formData.legal_business_name} onChange={handleInputChange} required placeholder="Business Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Business Type *</label>
                    <select name="business_type" value={formData.business_type} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30">
                      {BUSINESS_TYPES.map((bt) => (<option key={bt.value} value={bt.value}>{bt.label}</option>))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Business Category *</label>
                    <select name="business_category" value={formData.business_category} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30">
                      {BUSINESS_CATEGORIES.map((bc) => (<option key={bc.value} value={bc.value}>{bc.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Business Email *</label>
                    <input type="email" name="business_email" value={formData.business_email} onChange={handleInputChange} required placeholder="email@domain.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Phone Number *</label>
                    <input type="tel" name="business_phone" value={formData.business_phone} onChange={handleInputChange} required placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="ownerPassword" value={formData.ownerPassword} onChange={handleInputChange} required placeholder="••••••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formData.ownerPassword && (
                      <p className={`text-[10px] font-bold mt-1 ${getPasswordQuality(formData.ownerPassword)?.color}`}>
                        Quality: {getPasswordQuality(formData.ownerPassword)?.text}
                      </p>
                    )}
                  </div>
                </div>
                <button type="button" onClick={handleNextTab} className="w-full py-3.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <span>Next: Select Plan</span> <ArrowRight size={16} />
                </button>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase text-slate-800 border-b pb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" /> Select Subscription Plan & Module Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plansList.map((plan) => (
                    <div key={plan._id} onClick={() => setFormData((prev) => ({ ...prev, plan: plan._id }))} className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${formData.plan === plan._id ? "border-emerald-600 bg-emerald-50/20 shadow-md" : "border-slate-200"}`}>
                      <div>
                        <h4 className="font-extrabold text-xs">{plan.name}</h4>
                        <p className="text-lg font-black text-slate-900 mt-1">₹{plan.pricing?.monthly || 0}<span className="text-xs text-slate-400">/mo</span></p>
                        
                        {/* Enabled Module Access */}
                        <div className="mt-3 pt-2 border-t text-[10px] space-y-1">
                          <p className="font-bold text-slate-400 uppercase">Enabled Modules:</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">✓ Marketplace</span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">✓ Service Engine</span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">✓ Orders & Payouts</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" className={`w-full mt-4 py-2 rounded-xl text-xs font-bold ${formData.plan === plan._id ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                        {formData.plan === plan._id ? "Selected" : "Choose Plan"}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setActiveTab(1)} className="px-6 py-3 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-700">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Submit Business Registration</span>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
