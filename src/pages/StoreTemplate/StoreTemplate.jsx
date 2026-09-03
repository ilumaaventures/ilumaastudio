import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Eye,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  X,
  ArrowRight,
  CheckCircle2,
  Search,
  Star,
  Layers,
  ShoppingBag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Palette,
  ShieldCheck,
  Zap,
  Cpu,
  Heart,
  Utensils,
  GraduationCap,
  Wrench,
  Dumbbell,
  Stethoscope,
  Maximize2,
  Lock,
  Globe,
  SlidersHorizontal,
  BookOpen,
  Flower2,
} from "lucide-react";
import templateRegistry from "../../templates/registry";
import StoreRenderer from "../../templates/StoreRenderer";

// Enhanced list with icon mappings, colors, and industry tags
const templateList = Object.values(templateRegistry).map((t) => {
  const isEcom = t.businessType === "ecommerce";

  let icon = ShoppingBag;
  let industryLabel = t.category;

  if (t.category === "grocery") {
    icon = ShoppingBag;
    industryLabel = "Grocery & Fresh";
  } else if (t.category === "fashion") {
    icon = Sparkles;
    industryLabel = "Fashion & Luxury";
  } else if (t.category === "electronics") {
    icon = Cpu;
    industryLabel = "High-Tech & Audio";
  } else if (t.category === "beauty") {
    icon = Heart;
    industryLabel = "Beauty & Cosmetics";
  } else if (t.category === "furniture") {
    icon = Layers;
    industryLabel = "Furniture & Decor";
  } else if (t.category === "jewelry") {
    icon = Sparkles;
    industryLabel = "Fine Jewelry";
  } else if (t.category === "restaurant") {
    icon = Utensils;
    industryLabel = "Restaurant & Cafe";
  } else if (t.category === "salon") {
    icon = Sparkles;
    industryLabel = "Salon & Spa";
  } else if (t.category === "tutor") {
    icon = GraduationCap;
    industryLabel = "Education & Tutoring";
  } else if (t.category === "home-services") {
    icon = Wrench;
    industryLabel = "Home Services";
  } else if (t.category === "fitness") {
    icon = Dumbbell;
    industryLabel = "Fitness & Gym";
  } else if (t.category === "clinic") {
    icon = Stethoscope;
    industryLabel = "Clinic & Health";
  } else if (t.category === "bags") {
    icon = ShoppingBag;
    industryLabel = "Leather Bags & Travel";
  } else if (t.category === "tools") {
    icon = Wrench;
    industryLabel = "Power Tools & Hardware";
  } else if (t.category === "books") {
    icon = BookOpen;
    industryLabel = "Books & Literature";
  } else if (t.category === "food") {
    icon = Utensils;
    industryLabel = "Specialty Gourmet Food";
  } else if (t.category === "flowers") {
    icon = Flower2;
    industryLabel = "Flowers & Floral Studio";
  } else if (t.category === "shoes") {
    icon = Zap;
    industryLabel = "Athletic Shoes & Kicks";
  }

  return {
    id: t.key,
    key: t.key,
    name: t.name,
    category: isEcom ? "Ecommerce" : "Services",
    rawCategory: t.category,
    type: industryLabel,
    icon,
    description: t.description,
    image: t.thumbnail,
    badge: isEcom ? "E-Commerce" : "Service Booking",
    rating: "4.9",
    sectionsCount: t.supportedSections?.length || 8,
    colors: t.defaultTheme?.colors || {
      primary: "#4F46E5",
      secondary: "#818CF8",
    },
    demoData: t.demoData,
    capabilities: t.capabilities,
    previewPath: t.previewPath,
  };
});

const categoryFilters = [
  { id: "All", label: "All Templates", count: templateList.length },
  {
    id: "Ecommerce",
    label: "E-Commerce",
    count: templateList.filter((t) => t.category === "Ecommerce").length,
  },
  {
    id: "Services",
    label: "Service Providers",
    count: templateList.filter((t) => t.category === "Services").length,
  },
];

const industryFilters = [
  { id: "All", label: "All Industries", icon: Globe },
  { id: "grocery", label: "Grocery", icon: ShoppingBag },
  { id: "fashion", label: "Fashion", icon: Sparkles },
  { id: "electronics", label: "Electronics", icon: Cpu },
  { id: "beauty", label: "Beauty", icon: Heart },
  { id: "furniture", label: "Furniture", icon: Layers },
  { id: "jewelry", label: "Jewelry", icon: Sparkles },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "salon", label: "Salon & Spa", icon: Sparkles },
  { id: "tutor", label: "Tutor & Academy", icon: GraduationCap },
  { id: "home-services", label: "Home Services", icon: Wrench },
  { id: "fitness", label: "Fitness & Gym", icon: Dumbbell },
  { id: "clinic", label: "Health & Clinic", icon: Stethoscope },
];

export default function StoreTemplate() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [activeIndustryFilter, setActiveIndustryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // "desktop" | "tablet" | "mobile"

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTemplate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedTemplate]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedTemplate(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTemplates = useMemo(() => {
    return templateList.filter((template) => {
      const catMatch =
        activeCategoryFilter === "All" ||
        template.category.toLowerCase() === activeCategoryFilter.toLowerCase();

      const indMatch =
        activeIndustryFilter === "All" ||
        template.rawCategory.toLowerCase() ===
          activeIndustryFilter.toLowerCase();

      const searchMatch =
        !search.trim() ||
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.type.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());

      return catMatch && indMatch && searchMatch;
    });
  }, [activeCategoryFilter, activeIndustryFilter, search]);

  const featuredTemplate = templateList[0];

  // Modal navigation
  const currentModalIndex = useMemo(() => {
    if (!selectedTemplate) return -1;
    return templateList.findIndex((t) => t.key === selectedTemplate.key);
  }, [selectedTemplate]);

  const handleNextTemplate = () => {
    if (currentModalIndex === -1) return;
    const nextIdx = (currentModalIndex + 1) % templateList.length;
    setSelectedTemplate(templateList[nextIdx]);
  };

  const handlePrevTemplate = () => {
    if (currentModalIndex === -1) return;
    const prevIdx =
      (currentModalIndex - 1 + templateList.length) % templateList.length;
    setSelectedTemplate(templateList[prevIdx]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 selection:bg-indigo-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* 4. TEMPLATES CATALOG GRID - LIGHT CARDS */}
        <div className="mb-6 flex items-baseline justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Storefront Catalog ({filteredTemplates.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
            Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                {/* Template Preview */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Badge */}
                  {template.badge && (
                    <div className="absolute right-3 top-3">
                      <span className="rounded-lg bg-slate-900/85 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
                        {template.badge}
                      </span>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link
                      to={`/template-preview/${template.key}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-50 hover:shadow-xl"
                    >
                      <Eye size={15} className="text-indigo-600" />
                      Preview
                    </Link>
                  </div>
                </div>

                {/* Template Info */}
                <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-3">
                  <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900">
                    {template.type}
                  </h3>

                  {template.colors && (
                    <div className="flex shrink-0 -space-x-1">
                      <span
                        className="h-4 w-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                        style={{ backgroundColor: template.colors.primary }}
                      />

                      <span
                        className="h-4 w-4 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No matching templates found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any templates matching "{search}". Try searching
              for another industry or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategoryFilter("All");
                setActiveIndustryFilter("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer hover:bg-indigo-700 transition shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          5. OPTIMIZED DEVICE PREVIEW MODAL - CLEAN LIGHT CHROME
      ========================================================= */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 sm:p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="relative h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Chrome Toolbar */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-slate-800 shadow-2xs">
              {/* Left: Traffic Lights & Template Switcher */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevTemplate}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                    title="Previous Template"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-black text-sm text-slate-900">
                    {selectedTemplate.name}
                  </span>
                  <button
                    onClick={handleNextTemplate}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                    title="Next Template"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 hidden md:inline-block">
                  {selectedTemplate.type}
                </span>
              </div>

              {/* Center: Device Viewport Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Desktop View"
                >
                  <Monitor size={14} />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    previewDevice === "tablet"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet size={14} />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone size={14} />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/template-preview/${selectedTemplate.key}`}
                  target="_blank"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                >
                  <span>Dedicated Tab</span>
                  <ExternalLink size={12} />
                </Link>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Close Preview (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Simulated Address Bar when in Desktop View */}
            {previewDevice === "desktop" && (
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center justify-center">
                <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl px-3 py-1 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-600 shadow-2xs">
                  <Lock size={11} className="text-emerald-600" />
                  <span>
                    https://storefront.ilumaa.com/{selectedTemplate.key}
                  </span>
                </div>
              </div>
            )}

            {/* Viewport Frame Container */}
            <div className="flex-1 overflow-y-auto bg-slate-100/70 p-2 sm:p-6 flex justify-center items-start">
              {/* Responsive Device Frame */}
              <div
                className={`bg-white transition-all duration-300 rounded-2xl overflow-y-auto shadow-xl h-full border ${
                  previewDevice === "desktop"
                    ? "w-full border-slate-200"
                    : previewDevice === "tablet"
                      ? "w-[768px] border-8 border-slate-800 rounded-3xl"
                      : "w-[390px] border-8 border-slate-800 rounded-4xl"
                }`}
              >
                {/* Mobile Camera Notch */}
                {previewDevice === "mobile" && (
                  <div className="sticky top-0 z-50 bg-slate-900 h-6 w-full flex items-center justify-center">
                    <div className="w-20 h-3 bg-black rounded-full" />
                  </div>
                )}

                <StoreRenderer
                  templateKey={selectedTemplate.key}
                  data={selectedTemplate.demoData}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
