import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Crown,
  UserCheck,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  XCircle,
  Activity,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  X,
  Eye,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../api/admin";
import { Logo } from "../../components/UI";
import UserDetailModal from "../../components/admin/UserDetailModal";
import toast from "react-hot-toast";

// ── Small helpers ─────────────────────────────────────────────────────────────
const Badge = ({ children, color = "gray" }) => {
  const c = {
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    brand: "bg-brand/10 text-brand border-brand/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    gray: "bg-dark-500 text-slate-400 border-dark-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border whitespace-nowrap ${c[color]}`}
    >
      {children}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color = "brand" }) => {
  const c = {
    brand: "bg-brand/10 text-brand border-brand/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${c[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const Avatar = ({ name, size = "sm" }) => {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center font-bold text-brand shrink-0`}
    >
      {initials}
    </div>
  );
};

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-dark-500">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-4 py-3.5">
        <div
          className="h-4 bg-dark-500 rounded animate-pulse"
          style={{ width: `${60 + i * 10}%` }}
        />
      </td>
    ))}
  </tr>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 8,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // { userId: 'role'|'status'|'delete' }

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef(null);

  // Stats (derived)
  const stats = {
    total: pagination.total,
    admins: users.filter((u) => u.role === "admin").length,
    verified: users.filter((u) => u.isEmailVerified).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  // Fetch users
  const fetchUsers = useCallback(
    async (page = 1, searchVal = search) => {
      setLoading(true);
      try {
        const params = { page, limit: pagination.limit };
        if (searchVal) params.search = searchVal;
        if (roleFilter) params.role = roleFilter;
        if (verifiedFilter !== "") params.verified = verifiedFilter;
        const res = await adminApi.getUsers(params);
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("Admin access required");
          navigate("/dashboard");
        } else {
          toast.error("Failed to load users");
        }
      } finally {
        setLoading(false);
      }
    },
    [search, roleFilter, verifiedFilter, pagination.limit, navigate],
  );

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, verifiedFilter]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchUsers(1, search), 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  // Role change
  const handleRoleChange = async (e, usr) => {
    e.stopPropagation();
    const newRole = usr.role === "admin" ? "user" : "admin";
    setActionLoading((p) => ({ ...p, [usr._id]: "role" }));
    try {
      const res = await adminApi.updateRole(usr._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === usr._id ? res.data.data.user : u)),
      );
      toast.success(`${usr.name} is now ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading((p) => {
        const n = { ...p };
        delete n[usr._id];
        return n;
      });
    }
  };

  // Toggle status
  const handleToggleStatus = async (e, usr) => {
    e.stopPropagation();
    setActionLoading((p) => ({ ...p, [usr._id]: "status" }));
    try {
      const res = await adminApi.toggleStatus(usr._id);
      setUsers((prev) =>
        prev.map((u) => (u._id === usr._id ? res.data.data.user : u)),
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading((p) => {
        const n = { ...p };
        delete n[usr._id];
        return n;
      });
    }
  };

  // Delete
  const handleDelete = async (e, usr) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${usr.name}? This is permanent.`)) return;
    setActionLoading((p) => ({ ...p, [usr._id]: "delete" }));
    try {
      await adminApi.deleteUser(usr._id);
      setUsers((prev) => prev.filter((u) => u._id !== usr._id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading((p) => {
        const n = { ...p };
        delete n[usr._id];
        return n;
      });
    }
  };

  const ActionBtn = ({
    onClick,
    icon: Icon,
    color,
    loading: isLoading,
    title,
  }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={isLoading}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40
        ${color === "brand" ? "hover:bg-brand/15 text-brand/60 hover:text-brand" : ""}
        ${color === "amber" ? "hover:bg-amber-500/15 text-amber-500/60 hover:text-amber-400" : ""}
        ${color === "red" ? "hover:bg-red-500/15 text-red-500/60 hover:text-red-400" : ""}
        ${color === "green" ? "hover:bg-green-500/15 text-green-500/60 hover:text-green-400" : ""}`}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
    </button>
  );

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setVerifiedFilter("");
  };
  const hasFilters = search || roleFilter || verifiedFilter !== "";

  return (
    <div
      className="min-h-screen bg-dark-900"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(108,99,255,0.1), transparent)",
      }}
    >
      {/* Navbar */}
      <nav className="border-b border-dark-500 bg-dark-800/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-white bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-brand" /> Admin
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-dark-600 border border-dark-400 rounded-xl px-3 py-1.5">
              <Crown className="w-3.5 h-3.5 text-brand" />
              <span className="text-xs text-slate-300 font-medium">
                {user?.name?.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate("/admin/login");
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand" /> Admin Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage users, roles, and account status
            </p>
          </div>
          <button
            onClick={() => fetchUsers(pagination.page)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-dark-400 hover:border-dark-300 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label="Total Users"
            value={pagination.total}
            sub="All registered"
            color="brand"
          />
          <StatCard
            icon={Crown}
            label="Admins"
            value={stats.admins}
            sub="On this page"
            color="amber"
          />
          <StatCard
            icon={CheckCircle2}
            label="Verified"
            value={stats.verified}
            sub="On this page"
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="Inactive"
            value={stats.inactive}
            sub="On this page"
            color="red"
          />
        </div>

        {/* Table card */}
        <div className="bg-dark-700 border border-dark-500 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 sm:px-5 py-4 border-b border-dark-500 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-dark-600 border border-dark-400 text-slate-100 rounded-xl pl-10 pr-4 py-2.5
                             placeholder-slate-500 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 text-sm transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap
                  ${showFilters || hasFilters ? "border-brand/50 bg-brand/10 text-brand" : "border-dark-400 text-slate-400 hover:border-dark-300 hover:text-white"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters{" "}
                {hasFilters && (
                  <span className="w-4 h-4 bg-brand rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Filter pills */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-1 page-enter">
                {/* Role */}
                <div className="flex gap-1">
                  {["", "user", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                        ${roleFilter === r ? "bg-brand border-brand/50 text-white" : "bg-dark-600 border-dark-400 text-slate-400 hover:text-white"}`}
                    >
                      {r === ""
                        ? "All Roles"
                        : r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Verified */}
                <div className="flex gap-1">
                  {[
                    ["", "All"],
                    ["true", "Verified"],
                    ["false", "Unverified"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setVerifiedFilter(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                        ${verifiedFilter === v ? "bg-brand border-brand/50 text-white" : "bg-dark-600 border-dark-400 text-slate-400 hover:text-white"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table — desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-500">
                  {[
                    "User",
                    "Email",
                    "Role",
                    "Status",
                    "Verified",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-16 text-slate-500"
                    >
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((usr) => (
                    <tr
                      key={usr._id}
                      onClick={() => setSelectedUser(usr)}
                      className="border-b border-dark-500/50 hover:bg-dark-600/40 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={usr.name} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[140px]">
                              {usr.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(usr.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-slate-300 truncate max-w-[180px]">
                          {usr.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge color={usr.role === "admin" ? "brand" : "gray"}>
                          {usr.role === "admin" ? (
                            <Crown className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {usr.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge color={usr.isActive ? "green" : "red"}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${usr.isActive ? "bg-green-400" : "bg-red-400"}`}
                          />
                          {usr.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge color={usr.isEmailVerified ? "green" : "amber"}>
                          {usr.isEmailVerified ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {usr.isEmailVerified ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ActionBtn
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(usr);
                            }}
                            icon={Eye}
                            color="brand"
                            title="View details"
                          />
                          <ActionBtn
                            onClick={(e) => handleRoleChange(e, usr)}
                            icon={Crown}
                            color="amber"
                            loading={actionLoading[usr._id] === "role"}
                            title={
                              usr.role === "admin"
                                ? "Demote to user"
                                : "Promote to admin"
                            }
                          />
                          <ActionBtn
                            onClick={(e) => handleToggleStatus(e, usr)}
                            icon={usr.isActive ? UserX : UserCheck}
                            color={usr.isActive ? "amber" : "green"}
                            loading={actionLoading[usr._id] === "status"}
                            title={usr.isActive ? "Deactivate" : "Activate"}
                          />
                          <ActionBtn
                            onClick={(e) => handleDelete(e, usr)}
                            icon={Trash2}
                            color="red"
                            loading={actionLoading[usr._id] === "delete"}
                            title="Delete user"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden divide-y divide-dark-500">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="h-4 bg-dark-500 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-dark-500 rounded animate-pulse w-1/2" />
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No users found</p>
              </div>
            ) : (
              users.map((usr) => (
                <div
                  key={usr._id}
                  onClick={() => setSelectedUser(usr)}
                  className="p-4 hover:bg-dark-600/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={usr.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {usr.name}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(usr);
                          }}
                          className="text-slate-500 hover:text-brand transition-colors shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {usr.email}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge color={usr.role === "admin" ? "brand" : "gray"}>
                          {usr.role === "admin" ? (
                            <Crown className="w-3 h-3" />
                          ) : (
                            <Users className="w-3 h-3" />
                          )}
                          {usr.role}
                        </Badge>
                        <Badge color={usr.isActive ? "green" : "red"}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${usr.isActive ? "bg-green-400" : "bg-red-400"}`}
                          />
                          {usr.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge color={usr.isEmailVerified ? "green" : "amber"}>
                          {usr.isEmailVerified ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {usr.isEmailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="px-4 sm:px-5 py-4 border-t border-dark-500 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-white font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium">
                  {pagination.total}
                </span>{" "}
                users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchUsers(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="w-8 h-8 rounded-lg border border-dark-400 flex items-center justify-center text-slate-400 hover:text-white hover:border-dark-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    let page = i + 1;
                    if (pagination.pages > 5) {
                      if (pagination.page <= 3) page = i + 1;
                      else if (pagination.page >= pagination.pages - 2)
                        page = pagination.pages - 4 + i;
                      else page = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => fetchUsers(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                        ${pagination.page === page ? "bg-brand text-white" : "border border-dark-400 text-slate-400 hover:text-white hover:border-dark-300"}`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}
                <button
                  onClick={() => fetchUsers(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="w-8 h-8 rounded-lg border border-dark-400 flex items-center justify-center text-slate-400 hover:text-white hover:border-dark-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={(refresh) => {
            setSelectedUser(null);
            if (refresh) fetchUsers(pagination.page);
          }}
          onUpdate={(updated) => {
            setSelectedUser(updated);
            setUsers((prev) =>
              prev.map((u) => (u._id === updated._id ? updated : u)),
            );
          }}
        />
      )}
    </div>
  );
}
