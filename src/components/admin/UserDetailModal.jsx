import { useState } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Crown,
  UserCheck,
  UserX,
  Trash2,
  Calendar,
  Hash,
  Activity,
} from "lucide-react";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";

const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-start gap-3 py-3 border-b border-dark-500 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p
        className={`text-sm text-white mt-0.5 break-all ${mono ? "font-mono text-xs" : "font-medium"}`}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

export default function UserDetailModal({ user, onClose, onUpdate }) {
  const [loading, setLoading] = useState(null); // 'role' | 'status' | 'delete'
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) return null;

  const handleRoleChange = async () => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setLoading("role");
    try {
      const res = await adminApi.updateRole(user._id, newRole);
      toast.success(`Role changed to ${newRole}`);
      onUpdate(res.data.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStatus = async () => {
    setLoading("status");
    try {
      const res = await adminApi.toggleStatus(user._id);
      toast.success(res.data.message);
      onUpdate(res.data.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setLoading("delete");
    try {
      await adminApi.deleteUser(user._id);
      toast.success("User deleted successfully");
      onClose(true); // true = refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
      setLoading(null);
    }
  };

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-dark-700 border border-dark-400 rounded-2xl shadow-2xl page-enter overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(108,99,255,0.1), 0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-dark-500">
          <h2 className="text-base font-semibold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-dark-500 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="px-6 py-5 border-b border-dark-500">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-xl font-bold text-brand shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-slate-400 truncate">{user.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {/* Role badge */}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border
                  ${
                    user.role === "admin"
                      ? "bg-brand/10 text-brand border-brand/25"
                      : "bg-dark-500 text-slate-300 border-dark-400"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Crown className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {user.role}
                </span>
                {/* Verified badge */}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border
                  ${
                    user.isEmailVerified
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {user.isEmailVerified ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </span>
                {/* Active badge */}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border
                  ${
                    user.isActive
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-2 max-h-56 overflow-y-auto">
          <InfoRow icon={Hash} label="User ID" value={user._id} mono />
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Shield} label="Role" value={user.role} />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <InfoRow
            icon={Clock}
            label="Last Login"
            value={
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleString("en-IN")
                : "Never"
            }
          />
          <InfoRow
            icon={Activity}
            label="Login Attempts"
            value={user.loginAttempts ?? 0}
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-dark-500 space-y-2.5">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
            Actions
          </p>

          {/* Role toggle */}
          <button
            onClick={handleRoleChange}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand/8 border border-brand/20
                       hover:bg-brand/15 transition-all text-sm font-medium text-brand disabled:opacity-50"
          >
            {loading === "role" ? (
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
            ) : (
              <Crown className="w-4 h-4" />
            )}
            {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
          </button>

          {/* Status toggle */}
          <button
            onClick={handleToggleStatus}
            disabled={!!loading}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium disabled:opacity-50
              ${
                user.isActive
                  ? "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/15 text-amber-400"
                  : "bg-green-500/8 border-green-500/20 hover:bg-green-500/15 text-green-400"
              }`}
          >
            {loading === "status" ? (
              <div
                className={`w-4 h-4 border-2 rounded-full animate-spin ${user.isActive ? "border-amber-500/30 border-t-amber-400" : "border-green-500/30 border-t-green-400"}`}
              />
            ) : user.isActive ? (
              <UserX className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            {user.isActive ? "Deactivate Account" : "Activate Account"}
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={!!loading}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium disabled:opacity-50
              ${
                confirmDelete
                  ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse"
                  : "bg-red-500/8 border-red-500/20 hover:bg-red-500/15 text-red-400"
              }`}
          >
            {loading === "delete" ? (
              <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-400 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {confirmDelete ? "⚠️ Click again to confirm delete" : "Delete User"}
          </button>
          {confirmDelete && (
            <p className="text-xs text-red-400/80 text-center">
              This action is permanent and cannot be undone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
