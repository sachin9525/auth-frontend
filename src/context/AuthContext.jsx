import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authApi
        .getMe()
        .then((res) => setUser(res.data.data.user))
        .catch(() => localStorage.removeItem("accessToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.signin({ email, password });
    const { accessToken, user } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
    return user;
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const res = await authApi.signin({ email, password });
    const { accessToken, user } = res.data.data;

    if (user.role !== "admin") {
      try {
        await authApi.signout();
      } catch (_) {}
      localStorage.removeItem("accessToken");
      setUser(null);
      const error = new Error("Admin access only");
      error.code = "ADMIN_ONLY";
      throw error;
    }

    localStorage.setItem("accessToken", accessToken);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.signout();
    } catch (_) {}
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const updateUser = useCallback((u) => setUser(u), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, adminLogin, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
