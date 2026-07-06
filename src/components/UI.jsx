import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const Logo = ({ size = "md" }) => {
  const sizes = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-12 h-12" };
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${sizes[size]} rounded-xl bg-brand flex items-center justify-center shadow-lg`}
        style={{ boxShadow: "0 0 20px rgba(108,99,255,0.4)" }}
      >
        <ShieldCheck className="w-4 h-4 text-white" />
      </div>
      <span className="font-semibold text-slate-900 dark:text-white tracking-tight">AuthKit</span>
    </div>
  );
};

export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl bg-white dark:bg-dark-600 border border-slate-200 dark:border-dark-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-500 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};

export const InputField = ({
  label,
  error,
  icon: Icon,
  rightElement,
  ...props
}) => (
  <div className="space-y-1.5">
    {label && <label className="label">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        className={`input-field ${Icon ? "pl-10" : ""} ${error ? "border-red-500/60" : ""}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export const PasswordInput = ({
  label,
  error,
  showStrength,
  value,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const getStrength = (val = "") => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[@$!%*?&#^]/.test(val)) s++;
    if (val.length >= 12) s++;
    return s;
  };
  const strength = showStrength ? getStrength(value) : 0;
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colorMap = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-brand",
  ];
  const textMap = [
    "",
    "text-red-400",
    "text-orange-400",
    "text-yellow-400",
    "text-green-400",
    "text-brand",
  ];
  return (
    <div className="space-y-1.5">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type={show ? "text" : "password"}
          value={value}
          className={`input-field pl-10 pr-10 ${error ? "border-red-500/60" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value && (
        <div className="space-y-1 mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colorMap[strength] : "bg-dark-400"}`}
              />
            ))}
          </div>
          <p className={`text-xs ${textMap[strength]}`}>{labels[strength]}</p>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export const Button = ({
  children,
  loading,
  variant = "primary",
  className = "",
  ...props
}) => (
  <button
    className={`${variant === "ghost" ? "btn-ghost" : "btn-primary"} flex items-center justify-center gap-2 ${className}`}
    disabled={loading}
    {...props}
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
);

export const Divider = ({ text = "or" }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-dark-400" />
    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
      {text}
    </span>
    <div className="flex-1 h-px bg-dark-400" />
  </div>
);

export const BgOrbs = () => (
  <>
    <div
      className="orb w-96 h-96 bg-purple-600/20"
      style={{ top: "-10%", left: "-10%", animationDelay: "0s" }}
    />
    <div
      className="orb w-80 h-80 bg-cyan-500/10"
      style={{ bottom: "-5%", right: "-5%", animationDelay: "3s" }}
    />
    <div
      className="orb w-64 h-64 bg-purple-600/10"
      style={{ top: "40%", right: "10%", animationDelay: "1.5s" }}
    />
  </>
);

export const AuthCard = ({ children, className = "" }) => (
  <div
    className={`auth-card w-full max-w-md p-8 relative z-10 page-enter ${className}`}
  >
    {children}
  </div>
);

export const StatCard = ({ icon: Icon, label, value, color = "brand" }) => {
  const c = {
    brand: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-xl p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${c[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};
