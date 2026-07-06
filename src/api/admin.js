import api from "./auth";

export const adminApi = {
  // GET /api/admin/users?page=1&limit=10&role=user&verified=true&search=sachin
  getUsers: (params) => api.get("/admin/users", { params }),

  // PATCH /api/admin/users/:id/role
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),

  // PATCH /api/admin/users/:id/status
  toggleStatus: (id) => api.patch(`/admin/users/${id}/status`),

  // DELETE /api/admin/users/:id
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
