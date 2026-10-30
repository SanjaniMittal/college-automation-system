import api from "./api";

export const authService = {
  login: async (email, password, role) => {
    const response = await api.post("/auth/login", { email, password, role });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  },

  // Admin User Credential Management
  getAllUsers: async () => {
    const response = await api.get("/auth/users");
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/auth/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
};

export default authService;
