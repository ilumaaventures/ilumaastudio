import React, { useState } from "react";
import { X, Calendar, Clock, User, Phone, CheckCircle, Sparkles } from "lucide-react";

export default function BookingModal({
  isOpen,
  onClose,
  service = null,
  business = {},
  themeColors = {},
}) {
  if (!isOpen) return null;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const primaryColor = themeColors.primary || "#4F46E5";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={resetAndClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Booking Request Confirmed!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1.5 leading-relaxed">
                Thank you, <span className="font-bold text-slate-800">{name || "Valued Client"}</span>.
                We have received your appointment request for{" "}
                <span className="font-bold text-slate-800">
                  {service?.serviceName || service?.name || "our service"}
                </span>{" "}
                on <span className="font-bold text-slate-800">{date || "Selected Date"}</span> at{" "}
                <span className="font-bold text-slate-800">{time}</span>.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 text-left space-y-1">
              <p><span className="font-semibold text-slate-800">Provider:</span> {business.name || business.businessName || "Service Provider"}</p>
              <p><span className="font-semibold text-slate-800">Contact:</span> {phone || "Provided on file"}</p>
              <p className="text-[11px] text-slate-400 pt-1">A confirmation SMS & calendar invite will be sent shortly.</p>
            </div>
            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-xl text-white text-xs font-bold transition shadow-md cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 bg-slate-100 text-slate-700">
                <Sparkles size={11} style={{ color: primaryColor }} />
                <span>Instant Scheduling</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Book Your Appointment
              </h3>
              {service && (
                <p className="text-xs text-slate-500 mt-1">
                  Selected: <span className="font-bold text-slate-800">{service.serviceName || service.name}</span>
                  {service.price ? ` — ₹${Number(service.price).toFixed(2)}` : ""}
                  {service.duration ? ` (${service.duration})` : ""}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:bg-white transition"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                      time === slot
                        ? "text-white border-transparent shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                    style={time === slot ? { backgroundColor: primaryColor } : {}}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:bg-white transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any dietary restrictions, specific requests, or details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:bg-white transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Confirm Appointment Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
