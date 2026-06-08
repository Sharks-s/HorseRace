import { api } from "./axios";

export const tournamentApi = {
  getAllTournaments: async () => {
    const response = await api.get("/tournaments");
    return response.data;
  },

  getTournamentById: async (id) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  createTournament: async (data) => {
    const response = await api.post("/tournaments", data);
    return response.data;
  },

  updateTournament: async (id, data) => {
    const response = await api.put(`/tournaments/${id}`, data);
    return response.data;
  },

  deleteTournament: async (id) => {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  },

  // RACES
  getRacesByTournament: async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}/races`);
    return response.data;
  },

  createRace: async (tournamentId, data) => {
    const response = await api.post(`/tournaments/${tournamentId}/races`, data);
    return response.data;
  },

  updateRace: async (tournamentId, id, data) => {
    const response = await api.put(`/tournaments/${tournamentId}/races/${id}`, data);
    return response.data;
  },

  deleteRace: async (tournamentId, id) => {
    const response = await api.delete(`/tournaments/${tournamentId}/races/${id}`);
    return response.data;
  }
};
