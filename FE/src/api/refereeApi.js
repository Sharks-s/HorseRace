import { api } from "./axios";

export const refereeApi = {
  // Pre-race inspection
  getAssignedInspections: async () => {
    const response = await api.get("/referee/pre-race/registrations");
    return response.data;
  },

  inspectHorse: async (registrationId, data) => {
    const response = await api.put(`/referee/pre-race/registrations/${registrationId}/inspect`, data);
    return response.data;
  },

  // Violations
  recordViolation: async (raceId, data) => {
    const response = await api.post(`/referee/races/${raceId}/violations`, data);
    return response.data;
  },

  getViolations: async (raceId) => {
    const response = await api.get(`/referee/races/${raceId}/violations`);
    return response.data;
  },

  deleteViolation: async (violationId) => {
    const response = await api.delete(`/referee/violations/${violationId}`);
    return response.data;
  },

  // Report submission
  submitReport: async (raceId, data) => {
    const response = await api.post(`/referee/races/${raceId}/report`, data);
    return response.data;
  },

  getReport: async (raceId) => {
    const response = await api.get(`/referee/races/${raceId}/report`);
    return response.data;
  },
};
