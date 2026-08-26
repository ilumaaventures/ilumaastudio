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
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#2563eb]">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Contact Us</span>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-wider">
            <Headphones size={13} />
            Customer Care & Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Have questions about an order, seller partnership, or product
            inquiries? Reach out and our team will get back to you promptly.
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
                  Email Support
                </h3>
                <p className="text-xs text-slate-500">
                  Fast response within 24 hours
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
                  Call Center
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
                  Business Hours
                </h3>
                <p className="text-xs text-slate-500">
                  Monday – Saturday: 9:00 AM – 7:00 PM
                </p>
                <p className="text-xs text-slate-500">
                  Sunday: Closed (Online orders open 24/7)
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details below and our customer success
                representatives will get in touch.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-black text-emerald-900 text-base">
                  Message Received!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out. We have logged your ticket and our
                  representative will reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Subject / Inquiry Type
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                    >
                      <option value="">Select an option</option>
                      <option value="Order Status">
                        Order Status & Tracking
                      </option>
                      <option value="Returns & Refunds">
                        Returns & Refunds
                      </option>
                      <option value="Seller Inquiry">
                        Become a Seller / Vendor
                      </option>
                      <option value="Product Question">
                        Product & Quality Details
                      </option>
                      <option value="Other">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we assist you today? Please include order number if applicable..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-xl font-black text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} />
                  <span>
                    {submitting ? "Sending Message..." : "Submit Inquiry"}
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
