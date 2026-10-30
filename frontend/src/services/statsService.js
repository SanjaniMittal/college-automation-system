import api from "./api";

export const statsService = {
  getAdminStats: async () => (await api.get("/stats/admin")).data,
  getStudentStats: async (rollNo) => (await api.get(`/stats/student/${rollNo}`)).data,
};

export default statsService;
