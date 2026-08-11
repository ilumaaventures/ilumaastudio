import React from "react";

export default function ServiceEmptyState({
  title = "No Services Returned from Backend API",
  description = "We couldn't find any services registered in the database. Please check your backend connection or create service listings.",
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center mx-auto text-2xl">
        🛠️
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
        {description}
      </p>
    </div>
  );
}
