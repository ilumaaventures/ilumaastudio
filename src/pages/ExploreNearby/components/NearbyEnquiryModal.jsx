import React, { useState } from "react";
import { X, Send, Phone, CheckCircle2, MessageCircle, Calendar, Clock, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyEnquiryModal({
  isOpen,
  onClose,
  title = "Quick Enquiry",
  subtitle = "Directly connect with verified neighbourhood specialists",
  targetName = "Local Provider",
  targetCategory = "Service",
  whatsappNumber = "919876543210",
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    timeSlot: "Morning (9 AM - 12 PM)",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setSubmitted(true);
    toast.success(`Enquiry submitted to ${targetName}! They will contact you shortly.`);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello ${targetName}, I found your listing on ILumaa Nearby for ${targetCategory}. I would like to inquire about availability and pricing.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-2">
            <ShieldCheck size={14} className="text-emerald-300" />
            <span>Verified Local Enquiry</span>
          </div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="text-xs text-blue-100 mt-1">{subtitle}</p>
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-bold flex items-center justify-between">
            <span className="text-white/80">Connecting with:</span>
            <span className="text-amber-300 font-extrabold">{targetName}</span>
          </div>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-black text-slate-900">Enquiry Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {targetName} has received your request and will call or message you within 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <User size={13} className="text-blue-600" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Verma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-slate-900 transition outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Phone size={13} className="text-blue-600" />
                <span>Phone / WhatsApp Number *</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-slate-900 transition outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Calendar size={13} className="text-blue-600" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={13} className="text-blue-600" />
                  <span>Time Preference</span>
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 font-bold text-slate-800 transition outline-none"
                >
                  <option>Morning (9 AM - 12 PM)</option>
                  <option>Afternoon (12 PM - 4 PM)</option>
                  <option>Evening (4 PM - 8 PM)</option>
                  <option>Anytime</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Requirement / Message</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe what service or product you are looking for..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-slate-900 transition outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Quick Enquiry</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
