import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send cookies (refreshToken)
});

// ── Attach access token to every request ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh on 401 ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          "/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

// ── Auth endpoints ──
export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  signin: (data) => api.post("/auth/signin", data),
  signout: () => api.post("/auth/signout"),
  getMe: () => api.get("/auth/me"),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, data) =>
    api.post(`/auth/reset-password/${token}`, data),
  changePassword: (data) => api.post("/auth/change-password", data),
  refreshToken: () => api.post("/auth/refresh-token"),
};

export default api;
