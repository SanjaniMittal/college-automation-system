import api from "./api";

export const studentService = {
  getAll: async () => (await api.get("/students")).data,
  getByClass: async (className) => (await api.get(`/students/class/${className}`)).data,
  getByRoll: async (rollNo) => (await api.get(`/students/roll/${rollNo}`)).data,
  create: async (data) => (await api.post("/students", data)).data,
  update: async (id, data) => (await api.put(`/students/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/students/${id}`)).data,
};

export default studentService;
