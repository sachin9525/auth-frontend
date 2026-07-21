import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, Mail, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  AuthCard,
  BgOrbs,
  Button,
  InputField,
  PasswordInput,
  ThemeToggle,
} from "../../components/UI";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, adminLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setApiError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = "Admin email is required";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    try {
      const admin = await adminLogin(form.email, form.password);
      toast.success(`Welcome, ${admin.name.split(" ")[0]}!`);
      navigate("/admin", { replace: true });
    } catch (error) {
      const message =
        error.code === "ADMIN_ONLY"
          ? "This account does not have admin access."
          : error.response?.data?.message || "Admin login failed";
      setApiError(message);
      if (error.response?.status === 423) {
        toast.error("Account locked — try again in 30 minutes");
      }
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
          <div className="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
            Admin Login
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to the administration portal
          </p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Admin Email"
            placeholder="admin@example.com"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="username"
          />

          <PasswordInput
            label="Password"
            value={form.password}
            onChange={set("password")}
            placeholder="Your password"
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} className="mt-2">
            Enter Admin Portal <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 bg-brand/5 border border-brand/20 rounded-xl p-3">
          <p className="text-xs text-slate-400 text-center">
            Access is restricted to accounts with the admin role.
          </p>
        </div>

        <Link
          to="/login"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> User login
        </Link>
      </AuthCard>
    </div>
  );
}
