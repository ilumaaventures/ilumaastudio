import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import formatAddress from "../../utils/formatAddress";

export default function ContactPage({
  business = {},
  themeColors = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const primaryColor = themeColors.primary || "#4F46E5";

  const faqs = [
    {
      q: "What are your standard delivery timeframes?",
      a: "Orders placed by 2:00 PM are processed the same business day. Standard ground delivery arrives within 2-4 business days. Priority expedited options are available at checkout.",
    },
    {
      q: "How does appointment and service booking work?",
      a: "Simply click the 'Book Appointment' button on any service. Choose your desired date and time slot, enter your contact details, and you will receive an instant confirmation via SMS and email.",
    },
    {
      q: "What is your return and cancellation policy?",
      a: "We offer a 30-day no-hassle return window on products. Service appointments can be rescheduled or cancelled up to 24 hours in advance with zero penalty.",
    },
    {
      q: "Do you offer international shipping or remote consultations?",
      a: "Yes! We support cross-border express shipping and secure HD video consultations for our advisory and coaching services.",
    },
    {
      q: "How can I get immediate assistance with an ongoing order?",
      a: "Our customer concierge is available 7 days a week via direct phone, WhatsApp chat, or the contact form below.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 font-sans">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white inline-block shadow-2xs"
          style={{ backgroundColor: primaryColor }}
        >
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          We're Here to Help You.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Have an inquiry, bulk order request, or need advice on our catalog? Send us a message and our team will get back to you within 2 hours.
        </p>
      </div>

      {/* Grid: Contact Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-900">Direct Contact Details</h3>

            <div className="space-y-4">
              {business.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200/80">
                    <Phone size={18} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Hotline</span>
                    <p className="text-sm font-bold text-slate-800">{business.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200/80">
                  <Mail size={18} style={{ color: primaryColor }} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Inquiries</span>
                  <p className="text-sm font-bold text-slate-800">{business.email || "support@ilumaa.com"}</p>
                </div>
              </div>

              {formatAddress(business.address) && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200/80">
                    <MapPin size={18} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Physical Address</span>
                    <p className="text-sm font-bold text-slate-800">{formatAddress(business.address)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200/80">
                  <Clock size={18} style={{ color: primaryColor }} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hours of Operation</span>
                  <p className="text-sm font-bold text-slate-800">Mon - Sat: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Message Dispatched!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out, <strong>{formData.name}</strong>. Our concierge team has received your inquiry and will follow up shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Send an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Order Inquiry / Service Question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you today?..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <Send size={14} />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
