import React, { useEffect, useState } from "react";
import { X, Sparkles, Flame, Gift, Tag, AlertTriangle, ExternalLink, Megaphone, Flag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveNotifications } from "../api/notificationService";

const THEME_STYLES = {
  INDEPENDENCE_DAY: {
    bg: "bg-gradient-to-r from-orange-500 via-white to-emerald-600 text-slate-900",
    modalHeader: "bg-gradient-to-br from-orange-500 via-[#1e293b] to-emerald-600 text-white",
    badge: "🇮🇳 Happy 15th August Independence Day",
    icon: Flag,
  },
  RAKSHA_BANDHAN: {
    bg: "bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white",
    modalHeader: "bg-gradient-to-br from-pink-600 via-rose-500 to-purple-600 text-white",
    badge: "🪢 Happy Raksha Bandhan Celebration",
    icon: Heart,
  },
  DIWALI: {
    bg: "bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white",
    modalHeader: "bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 text-white",
    badge: "🪔 Happy Diwali Celebration",
    icon: Sparkles,
  },
  HOLI: {
    bg: "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white",
    modalHeader: "bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white",
    badge: "🎨 Holi Colors Festival",
    icon: Flame,
  },
  NEW_YEAR: {
    bg: "bg-gradient-to-r from-blue-900 via-indigo-800 to-[#2563eb] text-white",
    modalHeader: "bg-gradient-to-br from-blue-900 via-indigo-900 to-[#2563eb] text-white",
    badge: "🎆 Happy New Year Celebration",
    icon: Gift,
  },
  EID: {
    bg: "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white",
    modalHeader: "bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white",
    badge: "🌙 Eid Mubarak Celebration",
    icon: Sparkles,
  },
  CHRISTMAS: {
    bg: "bg-gradient-to-r from-red-700 via-emerald-800 to-red-800 text-white",
    modalHeader: "bg-gradient-to-br from-red-700 via-red-800 to-emerald-900 text-white",
    badge: "🎄 Merry Christmas & Happy Holidays",
    icon: Gift,
  },
  SALE: {
    bg: "bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 text-white",
    modalHeader: "bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 text-white",
    badge: "🔥 Mega Platform Sale Live",
    icon: Tag,
  },
  URGENT: {
    bg: "bg-gradient-to-r from-red-600 to-rose-700 text-white",
    modalHeader: "bg-gradient-to-br from-red-600 to-rose-700 text-white",
    badge: "⚠️ Important Platform Notice",
    icon: AlertTriangle,
  },
  NONE: {
    bg: "bg-slate-900 text-white",
    modalHeader: "bg-gradient-to-r from-slate-900 to-[#2563eb] text-white",
    badge: "📢 Announcement",
    icon: Megaphone,
  },
};

export default function GlobalNotificationContainer() {
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [activeModalIndex, setActiveModalIndex] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getActiveNotifications("CUSTOMER");
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching active notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const visibleNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n._id)
  );

  const bannerAlerts = visibleNotifications.filter(
    (n) => n.displayType === "BANNER_ALERT"
  );
  const floatingBars = visibleNotifications.filter(
    (n) => n.displayType === "FLOATING_BAR"
  );
  const modals = visibleNotifications.filter(
    (n) => n.displayType === "CELEBRATION_MODAL" || n.displayType === "ANNOUNCEMENT_MODAL"
  );

  const currentModal = modals[activeModalIndex] || null;

  return (
    <>
      {/* 1. TOP BANNER ALERTS */}
      {bannerAlerts.map((n) => {
        const theme = THEME_STYLES[n.festivalType] || THEME_STYLES.NONE;
        const Icon = theme.icon;

        return (
          <div
            key={n._id}
            className={`w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-between shadow-md relative z-40 animate-fadeIn ${theme.bg}`}
          >
            <div className="flex items-center gap-2 max-w-5xl mx-auto truncate text-center sm:text-left">
              <Icon size={16} className="shrink-0 animate-bounce" />
              <span className="font-extrabold truncate">{n.title}</span>
              <span className="hidden md:inline opacity-90 truncate">— {n.message}</span>

              {n.actionUrl && (
                <Link
                  to={n.actionUrl}
                  className="ml-2 px-3 py-1 bg-white text-slate-900 font-extrabold rounded-lg hover:bg-slate-100 transition shrink-0 flex items-center gap-1 text-[11px] shadow"
                >
                  {n.actionText || "View Details"} <ExternalLink size={12} />
                </Link>
              )}
            </div>

            {n.dismissible !== false && (
              <button
                onClick={() => handleDismiss(n._id)}
                className="p-1 hover:bg-black/20 rounded-lg transition shrink-0 cursor-pointer ml-2"
                title="Close"
              >
                <X size={15} />
              </button>
            )}
          </div>
        );
      })}

      {/* 2. FESTIVAL & CELEBRATION MODAL */}
      {currentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          {(() => {
            const theme = THEME_STYLES[currentModal.festivalType] || THEME_STYLES.NONE;
            const Icon = theme.icon;

            return (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 relative animate-in zoom-in-95 duration-200">
                {/* Header Banner */}
                <div className={`p-6 sm:p-8 relative ${theme.modalHeader}`}>
                  {currentModal.dismissible !== false && (
                    <button
                      onClick={() => handleDismiss(currentModal._id)}
                      className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                      <Icon size={14} />
                      {theme.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
                      {currentModal.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {currentModal.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {currentModal.dismissible !== false && (
                      <button
                        onClick={() => handleDismiss(currentModal._id)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                    {currentModal.actionUrl && (
                      <Link
                        to={currentModal.actionUrl}
                        onClick={() => handleDismiss(currentModal._id)}
                        className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{currentModal.actionText || "Explore Now"}</span>
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. BOTTOM FLOATING BARS */}
      {floatingBars.map((n) => {
        const theme = THEME_STYLES[n.festivalType] || THEME_STYLES.NONE;
        const Icon = theme.icon;

        return (
          <div
            key={n._id}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 shadow-2xl rounded-2xl overflow-hidden animate-slideUp"
          >
            <div className={`p-4 flex items-center justify-between gap-3 text-xs ${theme.bg}`}>
              <div className="flex items-center gap-3 truncate">
                <Icon size={20} className="shrink-0 animate-bounce" />
                <div className="truncate">
                  <div className="font-extrabold truncate">{n.title}</div>
                  <div className="text-[11px] opacity-90 truncate">{n.message}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.actionUrl && (
                  <Link
                    to={n.actionUrl}
                    className="px-3 py-1.5 bg-white text-slate-900 font-extrabold rounded-xl hover:bg-slate-100 transition text-[11px] shadow"
                  >
                    {n.actionText || "Open"}
                  </Link>
                )}
                {n.dismissible !== false && (
                  <button
                    onClick={() => handleDismiss(n._id)}
                    className="p-1 hover:bg-black/20 rounded-lg transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
