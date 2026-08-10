import React, { useState } from "react";
import { useStore } from "./StoreLayout";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const { business } = useStore();
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
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 w-full text-left space-y-10">
      {/* Title */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <HelpCircle size={24} className="text-indigo-600" /> Contact Us
        </h1>
        <p className="text-gray-500 text-xs mt-1">Get in touch with {business.businessName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left Side: Contact details */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Store Details</h2>
            <p className="text-gray-500 text-xs font-normal">
              Have questions about your order or general queries? Use the contact details below or send a message.
            </p>
          </div>

          <div className="space-y-4">
            {business.businessEmail && (
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Email Address</span>
                  <span className="text-xs font-bold text-gray-800 truncate block">{business.businessEmail}</span>
                </div>
              </div>
            )}

            {business.businessPhone && (
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Phone Number</span>
                  <span className="text-xs font-bold text-gray-800 block">{business.businessPhone}</span>
                </div>
              </div>
            )}

            {business.address && (
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">Location</span>
                  <span className="text-xs font-bold text-gray-800 block leading-relaxed">
                    {business.address.street ? (
                      <>
                        {business.address.street}, {business.address.city},<br />
                        {business.address.state} {business.address.postalCode}, {business.address.country}
                      </>
                    ) : (
                      "Default Store Address"
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Message form */}
        <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Send a Message</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Product Inquiry, Support, etc."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send size={12} /> {submitting ? "Sending..." : "Submit Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
