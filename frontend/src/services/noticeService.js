import api from "./api";

export const noticeService = {
  getAll: async () => (await api.get("/notices")).data,
  create: async (data) => (await api.post("/notices", data)).data,
  update: async (id, data) => (await api.put(`/notices/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/notices/${id}`)).data,
};

export default noticeService;
