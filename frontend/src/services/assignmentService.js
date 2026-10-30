import api from "./api";

export const assignmentService = {
  getAll: async () => (await api.get("/assignments")).data,
  create: async (data) => (await api.post("/assignments", data)).data,
  update: async (id, data) => (await api.put(`/assignments/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/assignments/${id}`)).data,
  getSubmissions: async () => (await api.get("/submissions")).data,
  getSubmissionsByAssignment: async (assignmentId) =>
    (await api.get(`/submissions/assignment/${assignmentId}`)).data,
  getSubmissionsByStudent: async (rollNo) =>
    (await api.get(`/submissions/student/${rollNo}`)).data,
  submitAnswer: async (data) => (await api.post("/submissions", data)).data,
  gradeSubmission: async (id, data) => (await api.put(`/submissions/${id}/grade`, data)).data,
  deleteSubmission: async (id) => (await api.delete(`/submissions/${id}`)).data,
};

export default assignmentService;
