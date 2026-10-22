import React from "react";
import { Check, X, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

/**
 * Evaluates password strength criteria and returns score & itemized status.
 */
export const evaluatePassword = (password = "") => {
  const pwd = String(password || "");
  const hasMinLen = pwd.length >= 6;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  // Criteria list
  const criteria = [
    { id: "length", label: "Min 6 characters", met: hasMinLen },
    { id: "upper", label: "Uppercase letter (A-Z)", met: hasUpper },
    { id: "number", label: "Number (0-9)", met: hasNumber },
    { id: "special", label: "Special symbol (!@#$)", met: hasSpecial },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let level = "Weak";
  let color = "rose"; // rose, amber, blue, emerald

  if (!pwd) {
    level = "None";
    color = "slate";
  } else if (!hasMinLen || metCount <= 1) {
    level = "Weak";
    color = "rose";
  } else if (metCount === 2) {
    level = "Fair";
    color = "amber";
  } else if (metCount === 3) {
    level = "Good";
    color = "blue";
  } else {
    level = "Strong";
    color = "emerald";
  }

  // Score out of 4 for the bar (0 to 4)
  const score = !pwd ? 0 : !hasMinLen ? 1 : metCount;

  return {
    password: pwd,
    hasMinLen,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    criteria,
    metCount,
    score,
    level,
    color,
    isSecure: hasMinLen && metCount >= 3,
  };
};

/**
 * Visual Password Strength Meter & Criteria Checklist
 */
export default function PasswordStrengthMeter({
  password = "",
  showCriteria = true,
  className = "",
}) {
  if (!password) {
    return null;
  }

  const { score, level, color, criteria } = evaluatePassword(password);

  const colorStyles = {
    rose: {
      bar: "bg-rose-500",
      text: "text-rose-500 dark:text-rose-400",
      badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
      icon: ShieldAlert,
    },
    amber: {
      bar: "bg-amber-500",
      text: "text-amber-500 dark:text-amber-400",
      badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
      icon: ShieldAlert,
    },
    blue: {
      bar: "bg-blue-500",
      text: "text-blue-500 dark:text-blue-400",
      badge: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
      icon: Shield,
    },
    emerald: {
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
      icon: ShieldCheck,
    },
  }[color] || {
    bar: "bg-slate-300",
    text: "text-slate-400",
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    icon: Shield,
  };

  const Icon = colorStyles.icon;

  return (
    <div className={`mt-2 space-y-2 select-none animate-fadeIn ${className}`}>
      {/* Top row: Label & Strength Level */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
          <Icon size={13} className={colorStyles.text} />
          <span>Security level-(Use 6 characters with atleast one uppercase, one lowercase, and one number)</span>
        </span>
        <span
          className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${colorStyles.badge}`}
        >
          {level}
        </span>
      </div>

      {/* 4-Step Animated Strength Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isFilled = score >= step;
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${isFilled
                ? colorStyles.bar
                : "bg-slate-200 dark:bg-slate-700/60"
                }`}
            />
          );
        })}
      </div>


    </div>
  );
}
