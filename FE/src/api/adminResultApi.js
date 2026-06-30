import { api } from "./axios";

export const adminResultApi = {
  getPendingRaces: async () => {
    const response = await api.get("/admin/results/pending");
    return response.data;
  },

  publishResult: async (raceId) => {
    const response = await api.post(`/admin/results/${raceId}/publish`);
    return response.data;
  },
};
