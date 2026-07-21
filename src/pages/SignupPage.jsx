import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    else if (!/[A-Z]/.test(form.password))
      e.password = "Need one uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Need one number";
    else if (!/[@$!%*?&#^]/.test(form.password))
      e.password = "Need one special char (@$!%*?&#^)";
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
      await authApi.signup(form);
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      }
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
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Open your email
              </h2>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-2">
                We sent a verification link to{" "}
                <span className="text-slate-900 dark:text-white font-medium">{form.email}</span>
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl p-4 text-sm text-slate-400 dark:text-slate-400 text-left space-y-2">
              <p className="text-slate-700 dark:text-slate-300 font-medium">Next steps:</p>
              <p>1. Open your email inbox</p>
              <p>2. Click the verification link</p>
              <p>3. Come back and sign in</p>
            </div>
            <Button onClick={() => navigate("/login")} className="mt-2">
              Go to Login <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              onClick={() =>
                authApi
                  .resendVerification(form.email)
                  .then(() => toast.success("Resent!"))
                  .catch(() => toast.error("Failed"))
              }
              className="text-sm text-brand hover:text-brand-light transition-colors"
            >
              Resend verification email
            </button>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Create account</h1>
          <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
            Join thousands of secure users
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            placeholder="Sachin Kumar"
            icon={User}
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
          />

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

          <PasswordInput
            label="Password"
            placeholder="Min 8 chars, uppercase, number, special"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            showStrength
            autoComplete="new-password"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl p-3">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">
              Password must have:
            </p>
            <div className="grid grid-cols-2 gap-1">
              {[
                ["8+ characters", form.password.length >= 8],
                ["One uppercase", /[A-Z]/.test(form.password)],
                ["One number", /[0-9]/.test(form.password)],
                ["Special char", /[@$!%*?&#^]/.test(form.password)],
              ].map(([text, pass]) => (
                <p
                  key={text}
                  className={`text-xs flex items-center gap-1.5 ${pass ? "text-green-400" : "text-slate-400 dark:text-slate-500"}`}
                >
                  <span>{pass ? "✓" : "○"}</span>
                  {text}
                </p>
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} className="mt-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 dark:text-slate-400 mt-6">
          Already have an account?{" "}
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
