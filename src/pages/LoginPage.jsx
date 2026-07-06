import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  Logo,
  InputField,
  PasswordInput,
  Button,
  BgOrbs,
  AuthCard,
  ThemeToggle,
} from "../components/UI";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setApiError(msg);
      if (err.response?.status === 423)
        toast.error("Account locked — try again in 30 minutes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <BgOrbs />
      <AuthCard>
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Welcome back</h1>
          <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            placeholder="you@example.com"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="label">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand hover:text-brand-light transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              value={form.password}
              onChange={set("password")}
              placeholder="Your password"
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" loading={loading} className="mt-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl p-3 space-y-1">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Security info:</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            • Account locks after 5 failed attempts (30 min)
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            • Email must be verified before signing in
          </p>
        </div>

        <p className="text-center text-sm text-slate-400 dark:text-slate-400 mt-5">
          No account yet?{" "}
          <Link
            to="/signup"
            className="text-brand hover:text-brand-light transition-colors font-medium"
          >
            Create one
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
