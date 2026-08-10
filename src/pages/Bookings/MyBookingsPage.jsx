import React, { useState, useEffect } from "react";
import { getBookings } from "../../api/bookingService";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, RefreshCw, ChevronRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();
      const list = Array.isArray(res) ? res : res?.data || res?.bookings || [];
      setBookings(list);
    } catch (err) {
      console.error("Failed to load user bookings", err);
      toast.error("Failed to load your appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Appointments & Bookings</h1>
            <p className="text-xs text-gray-500">Track and manage your scheduled service appointments</p>
          </div>
          <button
            onClick={fetchUserBookings}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28" />
            ))}
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm space-y-3">
            <Calendar size={40} className="text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No Appointments Found</h3>
            <p className="text-xs text-gray-500">You haven't scheduled any service appointments yet.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-900">
                      {booking.service?.name || "Service Appointment"}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-indigo-600" />
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Scheduled Date"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-indigo-600" />
                      {booking.timeSlot || "Time Slot TBD"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium block">Total Paid</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
