import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Headphones,
  AlertCircle,
  Copy,
  Check,
  LifeBuoy,
  Bug,
  ShoppingBag,
  CreditCard,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { createSupportTicket } from "../../api/supportService";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "general_enquiry",
    priority: "medium",
    referenceId: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    {
      id: "general_enquiry",
      label: "General Enquiry",
      icon: HelpCircle,
      desc: "Questions about products, platform or policies",
    },
    {
      id: "order_issue",
      label: "Order & Delivery",
      icon: ShoppingBag,
      desc: "Tracking, delayed parcel, or shipping damage",
    },
    {
      id: "billing_payment",
      label: "Billing & Refund",
      icon: CreditCard,
      desc: "Payment failure, duplicate charge, or refund request",
    },
    {
      id: "technical_issue",
      label: "Technical Bug / Issue",
      icon: Bug,
      desc: "App bug, login problem, or site error",
    },
    {
      id: "business_partnership",
      label: "Business & Talk",
      icon: Briefcase,
      desc: "Vendor onboarding, collaboration, or partnerships",
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquare,
      desc: "Share thoughts or suggest improvements",
    },
  ];

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.trim().length < 2)
        error = "Name must be at least 2 characters";
    }
    if (name === "email") {
      if (!value.trim()) error = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        error = "Please enter a valid email address";
    }
    if (name === "phone") {
      if (value.trim() && !/^[0-9+\-\s()]{7,15}$/.test(value.trim()))
        error = "Please enter a valid phone number (7-15 digits)";
    }
    if (name === "subject") {
      if (!value.trim()) error = "Subject is required";
      else if (value.trim().length < 3)
        error = "Subject must be at least 3 characters";
    }
    if (name === "message") {
      if (!value.trim()) error = "Message is required";
      else if (value.trim().length < 15)
        error = "Please describe in at least 15 characters";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createSupportTicket({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        category: formData.category,
        priority: formData.priority,
        referenceId: formData.referenceId.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        source: "studio_storefront",
      });

      const ticket = res.ticket || res.data || res;
      setSubmittedTicket(ticket);
      toast.success("Inquiry submitted successfully! Ticket created.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "general_enquiry",
        priority: "medium",
        referenceId: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Submission failed:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to submit your inquiry. Please check your connection.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (submittedTicket?.ticketId) {
      navigator.clipboard.writeText(submittedTicket.ticketId);
      setCopied(true);
      toast.success("Ticket ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Headphones size={13} />
            Customer Helpdesk & Issues Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Report an issue, make an inquiry, or talk partnerships with our
            executive team. Every request receives a tracked reference ticket
            with rapid resolution.
          </p>
        </div>

        {/* Main Grid: Contact Info Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 5 Cols: Contact Information */}
          <div className="lg:col-span-5 space-y-4">
            {/* Card 1: Email */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-[#2563eb]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs">
                <Mail size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Email Helpdesk
                </h3>
                <p className="text-xs text-slate-500">
                  Direct support response within 12-24 hours
                </p>
                <a
                  href="mailto:support@ilumaastudio.com"
                  className="text-xs font-bold text-[#2563eb] hover:underline block pt-1"
                >
                  support@ilumaastudio.com
                </a>
              </div>
            </div>

            {/* Card 2: Phone */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-[#2563eb]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Phone size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Priority Call Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Mon-Sat, 9:00 AM to 7:00 PM IST
                </p>
                <a
                  href="tel:+918001234567"
                  className="text-xs font-bold text-emerald-600 hover:underline block pt-1"
                >
                  +91 (800) 123-4567
                </a>
              </div>
            </div>

            {/* Card 3: Headquarters */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-[#2563eb]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Corporate Studio
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ILUMAA Studio Headquarters, Level 4, Tech Park Boulevard,
                  Jaipur, Rajasthan 302001, India
                </p>
              </div>
            </div>

            {/* Card 4: Operating Hours */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-[#2563eb]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Business Hours & SLAs
                </h3>
                <p className="text-xs text-slate-500">
                  Critical Issues: Handled 24/7
                </p>
                <p className="text-xs text-slate-500">
                  General Inquiries: Mon – Sat (9 AM – 7 PM)
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Contact Form / Ticket Success Confirmation */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            {submittedTicket ? (
              <div className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Ticket Logged & Dispatched
                  </span>
                  <h3 className="font-black text-emerald-950 text-xl mt-2">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
                    Your request has been routed to our specialized support
                    team. Please keep your reference ticket ID for
                    correspondence.
                  </p>
                </div>

                {/* Ticket ID Box */}
                <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 max-w-sm mx-auto flex items-center justify-between shadow-2xs">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ticket Reference ID
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {submittedTicket.ticketId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyTicketId}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                  >
                    Submit Another Inquiry or Issue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Send Us an Inquiry or Issue
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select the inquiry category below so we can direct your
                    ticket to the right department.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="category"
                    className="font-bold text-slate-700 block"
                  >
                    Inquiry / Issue Category *
                  </label>

                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition-all cursor-pointer hover:border-slate-300 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>

                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                          {cat.desc ? ` - ${cat.desc}` : ""}
                        </option>
                      ))}
                    </select>

                    {/* Dropdown Icon */}
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {formData.category && (
                    <p className="text-[11px] text-slate-500">
                      {
                        categories.find((cat) => cat.id === formData.category)
                          ?.desc
                      }
                    </p>
                  )}
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl outline-none text-slate-800 transition ${
                        errors.name
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-slate-200 focus:border-[#2563eb]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle size={11} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl outline-none text-slate-800 transition ${
                        errors.email
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-slate-200 focus:border-[#2563eb]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle size={11} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone and Reference / Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl outline-none text-slate-800 transition ${
                        errors.phone
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-slate-200 focus:border-[#2563eb]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle size={11} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    >
                      <option value="low">
                        Low - General query or non-urgent
                      </option>
                      <option value="medium">Normal / Standard Priority</option>
                      <option value="high">
                        High - Needs timely resolution
                      </option>
                      <option value="urgent">
                        Urgent - Critical issue / Order stuck
                      </option>
                    </select>
                  </div>
                </div>

                {/* Order / Reference ID (conditional emphasis) */}
                {(formData.category === "order_issue" ||
                  formData.category === "billing_payment" ||
                  formData.category === "technical_issue") && (
                  <div className="space-y-1.5 bg-blue-50/40 p-3 rounded-2xl border border-blue-100">
                    <label className="font-bold text-slate-700 block">
                      Order ID / Transaction Reference (Optional)
                    </label>
                    <input
                      type="text"
                      name="referenceId"
                      placeholder="e.g. ORD-2026-9812 or TXN-4482"
                      value={formData.referenceId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    />
                    <p className="text-[10px] text-slate-500">
                      Providing your Order or Reference ID helps us locate your
                      records faster.
                    </p>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Subject / Brief Summary *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Delayed package delivery for order #1042"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl outline-none text-slate-800 transition ${
                      errors.subject
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-slate-200 focus:border-[#2563eb]"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">
                      Detailed Message / Description *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your question or issue in detail. If reporting a problem, include what you experienced..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl outline-none text-slate-800 transition ${
                      errors.message
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-slate-200 focus:border-[#2563eb]"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertCircle size={11} />
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-xl font-black text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} />
                  <span>
                    {submitting
                      ? "Submitting Support Ticket..."
                      : "Submit Ticket & Start Inquiry"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
