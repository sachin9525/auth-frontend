import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Mail,
  RefreshCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { authApi } from "../api/auth";
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

// ── Verify Email ─────────────────────────────────────────────────────────────
export function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
      <BgOrbs />
      <AuthCard>
        <div className="flex flex-col items-center mb-6">
          <Logo size="lg" />
        </div>

        {status === "loading" && (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="w-10 h-10 text-brand animate-spin mx-auto" />
            <p className="text-slate-400 dark:text-slate-400">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email Verified!</h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-2">
                Your account is now active. You can sign in.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-dark-600 border border-green-500/20 rounded-xl p-4 space-y-1.5 text-left">
              <p className="text-sm font-medium text-green-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> What's unlocked:
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400">✓ Full account access</p>
              <p className="text-xs text-slate-400 dark:text-slate-400">✓ Protected routes</p>
              <p className="text-xs text-slate-400 dark:text-slate-400">✓ All API features</p>
            </div>
            <Button onClick={() => navigate("/login")}>
              Sign In Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-2">
                The link is invalid or expired (24h limit).
              </p>
            </div>
            <Button onClick={() => navigate("/login")} variant="ghost">
              <RefreshCw className="w-4 h-4" /> Back to Login
            </Button>
          </div>
        )}
      </AuthCard>
    </div>
  );
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      // Always show success (API hides whether email exists)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent)
    return (
      <div className="page-bg relative overflow-hidden">
        <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
        <BgOrbs />
        <AuthCard>
          <div className="text-center space-y-5">
            <div className="flex flex-col items-center mb-2">
              <Logo size="lg" />
            </div>
            <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Check your inbox</h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-2">
                If <span className="text-slate-900 dark:text-white font-medium">{email}</span> has
                an account, a reset link has been sent.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl p-4 text-sm text-slate-400 dark:text-slate-400 text-left space-y-1.5">
              <p className="text-slate-700 dark:text-slate-300 font-medium text-xs uppercase tracking-wider">
                Instructions
              </p>
              <p className="text-xs">• Open Mailtrap or your email client</p>
              <p className="text-xs">
                • Click the reset link (valid for 1 hour)
              </p>
              <p className="text-xs">• Set a new strong password</p>
            </div>
            <Link to="/login" className="block">
              <Button variant="ghost">
                <ArrowRight className="w-4 h-4" /> Back to Login
              </Button>
            </Link>
          </div>
        </AuthCard>
      </div>
    );

  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
      <BgOrbs />
      <AuthCard>
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
            Forgot password?
          </h1>
          <p className="text-slate-400 dark:text-slate-400 text-sm mt-1 text-center">
            Enter your email and we'll send a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            placeholder="you@example.com"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
          />
          <Button type="submit" loading={loading}>
            Send Reset Link <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 dark:text-slate-400 mt-6">
          Remembered it?{" "}
          <Link
            to="/login"
            className="text-brand hover:text-brand-light transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

// ── Reset Password ────────────────────────────────────────────────────────────
export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    else if (!/[A-Z]/.test(form.password))
      e.password = "Need one uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Need one number";
    else if (!/[@$!%*?&#^]/.test(form.password))
      e.password = "Need a special char";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.resetPassword(token, form);
      setDone(true);
      toast.success("Password reset! Please sign in.");
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="page-bg relative overflow-hidden">
        <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
        <BgOrbs />
        <AuthCard>
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Password Reset!</h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-2">
                All devices have been signed out. Please sign in with your new
                password.
              </p>
            </div>
            <Button onClick={() => navigate("/login")}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </AuthCard>
      </div>
    );

  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
      <BgOrbs />
      <AuthCard>
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Reset password</h1>
          <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
            Choose a new strong password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="New Password"
            placeholder="Min 8 chars, uppercase, number, special"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            showStrength
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Repeat your new password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading}>
            <KeyRound className="w-4 h-4" /> Reset Password
          </Button>
        </form>

        <div className="mt-4 bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl p-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            ⚠️ Resetting your password will sign out all devices.
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
