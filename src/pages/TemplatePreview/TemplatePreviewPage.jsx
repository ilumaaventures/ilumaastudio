import React from "react";
import { useParams, Link } from "react-router-dom";
import { Store, ArrowLeft } from "lucide-react";
import templateRegistry from "../../templates/registry";
import StoreRenderer from "../../templates/StoreRenderer";

export default function TemplatePreviewPage() {
  const { templateKey } = useParams();
  const normalizedKey = (templateKey || "").toLowerCase().trim();
  const templateMeta = templateRegistry[normalizedKey];

  if (!templateMeta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Store size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Template Not Found
          </h2>
          <p className="text-xs text-slate-500">
            No registered template matches key: <code className="font-mono font-bold text-slate-800">"{templateKey}"</code>.
          </p>
          <div className="pt-2">
            <Link
              to="/store-template"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={14} /> Return to Store Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the complete production template natively across the viewport without any toolbar or simulator chrome
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <StoreRenderer
        templateKey={normalizedKey}
        data={templateMeta.demoData}
        isPreview={true}
      />
    </div>
  );
}
