import axios from "axios";

// Public API – no withCredentials needed for spectator endpoints
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const publicResultApi = {
  getOfficialResults: async (raceId) => {
    const response = await publicAxios.get(`/public/races/${raceId}/results`);
    return response.data;
  },

  getTournamentStandings: async (tournamentId) => {
    const response = await publicAxios.get(`/public/tournaments/${tournamentId}/standings`);
    return response.data;
  },

  getTournaments: async () => {
    const response = await publicAxios.get("/tournaments");
    return response.data;
  },

  getRacesByTournament: async (tournamentId) => {
    const response = await publicAxios.get(`/tournaments/${tournamentId}/races`);
    return response.data;
  },
};
