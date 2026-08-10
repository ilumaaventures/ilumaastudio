import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-slate-900">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-6 text-3xl md:text-4xl font-bold text-slate-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg text-slate-600">
          The page you are looking for might have been removed, renamed, or is
          temporarily unavailable.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            to="/"
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-16">
          <div className="w-32 h-32 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-5xl">🛍️</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
