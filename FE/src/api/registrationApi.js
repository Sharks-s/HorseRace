import { api } from "./axios";

export const registrationApi = {
  sendInvitation: async (raceId, data) => {
    const response = await api.post(`/races/${raceId}/invitations`, data);
    return response.data;
  },

  respondToInvitation: async (invitationId, accept) => {
    const response = await api.put(`/races/invitations/${invitationId}/respond`, null, {
      params: { accept }
    });
    return response.data;
  },

  getJockeyInvitations: async (jockeyId) => {
    const response = await api.get(`/races/jockeys/${jockeyId}/invitations`);
    return response.data;
  },

  getRaceRegistrations: async (raceId) => {
    const response = await api.get(`/races/${raceId}/registrations`);
    return response.data;
  }
};
