import React, { useEffect, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { getActiveAnnouncements } from "../api/announcementService";

function TopBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await getActiveAnnouncements();

      setAnnouncements(Array.isArray(response) ? response : []);
    };

    loadAnnouncements();
  }, []);

  // Show announcements one by one
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % announcements.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [announcements]);

  const currentAnnouncement =
    announcements.length > 0 ? announcements[currentIndex] : null;

  return (
    <div className="bg-[#1e293b] text-white text-xs border-b border-slate-700/50 py-1.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Promo Message */}
        <div className="flex items-center gap-3 font-medium min-w-0">
          <div className="overflow-hidden min-w-0">
            <span
              key={currentAnnouncement?._id || currentIndex}
              className="text-gray-300 block truncate animate-[fadeIn_0.5s_ease-in-out]"
            >
              {currentAnnouncement?.description || "Welcome to ILumaaStudio!"}
            </span>
          </div>
        </div>

        {/* Right Links & Selectors */}
        <div className="hidden md:flex items-center gap-5 text-slate-300 text-[11px]">
          <a href="/track-order" className="hover:text-white transition-colors">
            Track Order
          </a>

          <span className="text-slate-600">|</span>

          <a href="/help" className="hover:text-white transition-colors">
            Help Center
          </a>

          <span className="text-slate-600">|</span>

          <a
            href="/businessRegistration"
            className="hover:text-white transition-colors"
          >
            Sell on ILUMAAStudio
          </a>

          <span className="text-slate-600">|</span>
          <a
            href="/business-pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </a>

          <span className="text-slate-600">|</span>

          <a
            href="/store-template"
            className="hover:text-white transition-colors"
          >
            Store Template
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
