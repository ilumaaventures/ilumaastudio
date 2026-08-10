import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Calendar, ArrowRight, Home } from "lucide-react";

export default function BookingSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={44} />
        </div>

        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your appointment has been successfully scheduled. The service provider will verify your slot and arrive as planned.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded">Confirmed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Execution Window</span>
            <span className="font-semibold text-gray-800">4 Hours Notice</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to="/my-bookings"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Calendar size={16} />
            View My Bookings
          </Link>

          <Link
            to="/services"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Browse More Services
          </Link>
        </div>
      </div>
    </div>
  );
}
