import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Clock,
  LogOut,
  Key,
  Bell,
  CheckCircle2,
  Settings,
  ChevronRight,
  Activity,
  Lock,
  Zap,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { Logo, PasswordInput, Button, StatCard, ThemeToggle } from "../components/UI";
import toast from "react-hot-toast";

function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  return (
    <div className="w-14 h-14 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-lg font-bold text-brand">
      {initials}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [changePw, setChangePw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const set = (k) => (e) => setChangePw((p) => ({ ...p, [k]: e.target.value }));

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!changePw.currentPassword) errs.currentPassword = "Required";
    if (!changePw.newPassword || changePw.newPassword.length < 8)
      errs.newPassword = "Min 8 characters";
    if (!/[A-Z]/.test(changePw.newPassword))
      errs.newPassword = "Need one uppercase";
    if (!/[0-9]/.test(changePw.newPassword))
      errs.newPassword = "Need one number";
    if (!/[@$!%*?&#^]/.test(changePw.newPassword))
      errs.newPassword = "Need a special char";
    if (changePw.newPassword === changePw.currentPassword)
      errs.newPassword = "Must differ from current";
    if (changePw.newPassword !== changePw.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }

    setPwLoading(true);
    try {
      await authApi.changePassword(changePw);
      toast.success("Password changed! Please sign in again.");
      await logout();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "security", label: "Security", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-dark-900"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(108,99,255,0.12), transparent)",
      }}
    >
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-dark-500 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 rounded-xl px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:bg-dark-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile header */}
        <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar name={user?.name} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
                {user?.isEmailVerified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
                {user?.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-slate-400 dark:text-slate-400 text-sm mt-0.5">{user?.email}</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Member since{" "}
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 p-1 rounded-xl w-full sm:w-auto sm:inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none justify-center
                ${activeTab === tab.id ? "bg-brand text-white shadow-lg" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-600"}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6 page-enter">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                icon={CheckCircle2}
                label="Email"
                value={user?.isEmailVerified ? "Verified" : "Unverified"}
                color="green"
              />
              <StatCard
                icon={Shield}
                label="Role"
                value={user?.role === "admin" ? "Admin" : "User"}
                color="brand"
              />
              <StatCard
                icon={Activity}
                label="Status"
                value={user?.isActive ? "Active" : "Inactive"}
                color="cyan"
              />
              <StatCard
                icon={Clock}
                label="Last Login"
                value={
                  user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Now"
                }
                color="amber"
              />
            </div>

            <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Account Info
              </h2>
              {[
                { icon: User, label: "Full Name", value: user?.name },
                { icon: Mail, label: "Email", value: user?.email },
                { icon: Shield, label: "Role", value: user?.role },
                {
                  icon: Lock,
                  label: "Account ID",
                  value: user?._id?.slice(-8).toUpperCase(),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-200 dark:border-dark-500 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-dark-600 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white font-medium truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Security Status
              </h2>
              {[
                {
                  icon: CheckCircle2,
                  text: "Email verified",
                  ok: user?.isEmailVerified,
                  tip: "Verify email for full access",
                },
                {
                  icon: Lock,
                  text: "Password protected",
                  ok: true,
                  tip: "Keep your password strong",
                },
                {
                  icon: Zap,
                  text: "Session active",
                  ok: true,
                  tip: "You are currently signed in",
                },
              ].map(({ icon: Icon, text, ok, tip }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? "bg-green-500/10" : "bg-amber-500/10"}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${ok ? "text-green-400" : "text-amber-400"}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white">{text}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{tip}</p>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-amber-400"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-4 page-enter">
            <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    You'll be signed out of all devices
                  </p>
                </div>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <PasswordInput
                  label="Current Password"
                  placeholder="Your current password"
                  value={changePw.currentPassword}
                  onChange={set("currentPassword")}
                  error={pwErrors.currentPassword}
                />
                <PasswordInput
                  label="New Password"
                  placeholder="Min 8 chars, uppercase, number, special"
                  value={changePw.newPassword}
                  onChange={set("newPassword")}
                  error={pwErrors.newPassword}
                  showStrength
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  value={changePw.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={pwErrors.confirmPassword}
                />
                <Button type="submit" loading={pwLoading}>
                  <Key className="w-4 h-4" /> Update Password
                </Button>
              </form>
            </div>

            <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Security Info
              </h2>
              {[
                {
                  icon: Lock,
                  text: "Account lockout",
                  sub: "Locked after 5 failed login attempts (30 min)",
                },
                {
                  icon: Zap,
                  text: "Token rotation",
                  sub: "Refresh tokens rotate on every use",
                },
                {
                  icon: Globe,
                  text: "All devices sign out",
                  sub: "Password change logs out all sessions",
                },
                {
                  icon: Shield,
                  text: "HttpOnly cookies",
                  sub: "Refresh token protected from JS access",
                },
              ].map(({ icon: Icon, text, sub }) => (
                <div
                  key={text}
                  className="flex items-start gap-3 py-2 border-b border-slate-200 dark:border-dark-500 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-dark-600 flex items-center justify-center mt-0.5 shrink-0">
                    <Icon className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{text}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4 page-enter">
            <div className="bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-500 rounded-2xl divide-y divide-dark-500">
              {[
                {
                  icon: Bell,
                  label: "Notifications",
                  sub: "Email alerts and updates",
                  action: "Manage",
                },
                {
                  icon: Globe,
                  label: "Language",
                  sub: "English (US)",
                  action: "Change",
                },
                {
                  icon: Shield,
                  label: "Privacy",
                  sub: "Data and privacy settings",
                  action: "View",
                },
              ].map(({ icon: Icon, label, sub, action }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:bg-dark-600/50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-dark-600 border border-slate-300 dark:border-dark-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
                    {action} <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-1">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                These actions are irreversible. Proceed with caution.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out of all devices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
