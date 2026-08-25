import React, { useState } from "react";
import { useStore } from "./StoreContext";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const { business, template, theme: layoutTheme } = useStore();

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for reaching out! We'll get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div
      className="w-full min-h-screen py-12 px-6 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-10 text-left">
        {/* Header Title Section */}
        <div className="pb-6 border-b border-black/[0.06] space-y-1">
          <span
            className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
            style={{ color: primaryColor }}
          >
            <Sparkles size={12} /> Direct Contact Channel
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{ color: theme.colors?.textColor }}
          >
            Contact {business?.businessName || "Our Support"}
          </h1>
          <p className="text-xs opacity-75 font-medium">
            Have questions regarding products, orders, or custom requests? We're here to assist.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Left Column: Direct Store Info Cards */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-lg font-black tracking-tight">
                Store Communication
              </h2>
              <p className="text-xs opacity-75 font-normal leading-relaxed">
                Connect with our customer care desk using any of the direct contact channels below.
              </p>
            </div>

            <div className="space-y-3.5">
              {business?.businessEmail && (
                <div
                  className="flex items-center gap-3.5 p-4 rounded-3xl border border-black/[0.06] shadow-xs"
                  style={{
                    backgroundColor: theme.colors?.cardBg || "#FFFFFF",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: `${primaryColor}12`,
                      color: primaryColor,
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase block tracking-wider opacity-50">
                      Email Address
                    </span>
                    <span className="text-xs font-bold truncate block">
                      {business.businessEmail}
                    </span>
                  </div>
                </div>
              )}

              {business?.businessPhone && (
                <div
                  className="flex items-center gap-3.5 p-4 rounded-3xl border border-black/[0.06] shadow-xs"
                  style={{
                    backgroundColor: theme.colors?.cardBg || "#FFFFFF",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: `${primaryColor}12`,
                      color: primaryColor,
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase block tracking-wider opacity-50">
                      Phone Support
                    </span>
                    <span className="text-xs font-bold block">
                      {business.businessPhone}
                    </span>
                  </div>
                </div>
              )}

              {business?.address && (
                <div
                  className="flex items-start gap-3.5 p-4 rounded-3xl border border-black/[0.06] shadow-xs"
                  style={{
                    backgroundColor: theme.colors?.cardBg || "#FFFFFF",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                    style={{
                      backgroundColor: `${primaryColor}12`,
                      color: primaryColor,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase block tracking-wider opacity-50">
                      Location
                    </span>
                    <span className="text-xs font-bold block leading-relaxed opacity-90">
                      {business.address.street ? (
                        <>
                          {business.address.street}, {business.address.city},<br />
                          {business.address.state} {business.address.postalCode}
                        </>
                      ) : (
                        "Official Storefront Address"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div
            className="md:col-span-3 p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xl"
            style={{
              backgroundColor: theme.colors?.cardBg || "#FFFFFF",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider mb-2 opacity-90">
                Send Us A Direct Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-60">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-60">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-60">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Order inquiry, Product question, etc."
                  className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-60">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message details here..."
                  className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white font-black text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send size={13} />
                  <span>{submitting ? "Sending message..." : "Submit Inquiry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
