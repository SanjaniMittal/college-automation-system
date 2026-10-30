import api from "./api";

export const attendanceService = {
  getAll: async () => (await api.get("/attendance")).data,
  create: async (data) => (await api.post("/attendance", data)).data,
  update: async (id, data) => (await api.put(`/attendance/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/attendance/${id}`)).data,
};

export default attendanceService;
