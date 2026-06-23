import { api } from "../../../api/axios";
import type {
  CreateViolationBody,
  InspectBody,
  RefereeReportResponse,
  RegistrationInspection,
  SubmitReportBodyItem,
  Violation,
} from "../types/referee.types";

type ApiResponse<T> = {
  success: boolean;
  code?: string;
  message?: string;
  data: T;
};

export const refereeApi = {
  getAssignedInspections: async () => {
    const res = await api.get<ApiResponse<RegistrationInspection[]>>(
      "/referee/pre-race/registrations"
    );

    return res.data.data;
  },

  inspectRegistration: async (
    registrationId: string,
    body: InspectBody
  ) => {
    const res = await api.put<ApiResponse<RegistrationInspection>>(
      `/referee/pre-race/registrations/${registrationId}/inspect`,
      body
    );

    return res.data.data;
  },

  getViolations: async (raceId: string) => {
    const res = await api.get<ApiResponse<Violation[]>>(
      `/referee/races/${raceId}/violations`
    );

    return res.data.data;
  },

  createViolation: async (
    raceId: string,
    body: CreateViolationBody
  ) => {
    const res = await api.post<ApiResponse<Violation>>(
      `/referee/races/${raceId}/violations`,
      body
    );

    return res.data.data;
  },

  deleteViolation: async (raceId: string, violationId: string) => {
    const res = await api.delete<ApiResponse<void>>(
      `/referee/races/${raceId}/violations/${violationId}`
    );

    return res.data.data;
  },

  submitReport: async (
    raceId: string,
    body: SubmitReportBodyItem[]
  ) => {
    const res = await api.post<ApiResponse<RefereeReportResponse>>(
      `/referee/races/${raceId}/report`,
      body
    );

    return res.data.data;
  },
};