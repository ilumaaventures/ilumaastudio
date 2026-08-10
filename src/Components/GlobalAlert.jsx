import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export const GlobalAlert = ({ type = "info", message }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) return null;

  // Resolve Tailwind styling classes and icons based on alert type
  const typeConfig = {
    success: {
      container: "bg-emerald-50 border-emerald-100 text-emerald-800",
      icon: <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />,
    },
    warning: {
      container: "bg-amber-50 border-amber-100 text-amber-800",
      icon: <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />,
    },
    error: {
      container: "bg-red-50 border-red-100 text-red-800",
      icon: <XCircle className="text-red-500 flex-shrink-0" size={18} />,
    },
    info: {
      container: "bg-blue-50 border-blue-100 text-blue-800",
      icon: <Info className="text-blue-500 flex-shrink-0" size={18} />,
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`flex items-center justify-between gap-3 border rounded-xl p-3.5 text-xs font-semibold leading-relaxed shadow-sm transition-all duration-300 w-full ${currentConfig.container}`}
    >
      <div className="flex items-center gap-2.5">
        {currentConfig.icon}
        <span className="break-all">{message}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none transition cursor-pointer p-0.5 rounded-md hover:bg-black/5"
        aria-label="Close alert"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default GlobalAlert;
