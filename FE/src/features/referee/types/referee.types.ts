export type RegistrationStatus =
  | "ACCEPTED"
  | "RACE_READY"
  | "DISQUALIFIED";

export type InspectDecision = "PASSED" | "FAILED";

export type RaceStatus =
  | "OPEN"
  | "RESULT_SUBMITTED";

export type ViolationType =
  | "LANE_VIOLATION"
  | "FALSE_START"
  | "DANGEROUS_RIDING"
  | "OBSTRUCTION"
  | "OTHER";

export type ViolationSeverity =
  | "WARNING"
  | "DISQUALIFY";

export type RegistrationInspection = {
  registrationId: string;
  status: RegistrationStatus;

  raceId: string;
  raceName: string;
  raceStartTime: string;

  horseId: string;
  horseName: string;
  breed: string;
  age: number;
  weight: number;

  healthCertExpiry: string;
  healthCertValid: boolean;
  weightValid: boolean;
  br01Passed: boolean | null;

  ownerUsername: string;

  jockeyId: string;
  jockeyName: string;

  inspectionNote?: string;
  inspectedAt?: string;
};

export type InspectBody = {
  decision: InspectDecision;
  note: string;
};

export type Violation = {
  violationID: string;
  raceID: string;
  horseID: string;
  jockeyID: string;
  type: ViolationType;
  description: string;
  severity: ViolationSeverity;
  timestamp: string;
  refereeID: string;
};

export type CreateViolationBody = {
  horseID: string;
  jockeyID: string;
  type: ViolationType;
  description: string;
  severity: ViolationSeverity;
};

export type SubmitReportBodyItem = {
  horseID: string;
  finishTime: number;
};

export type ReportResult = {
  resultID: string;
  horseID: string;
  horseName: string;
  jockeyID: string;
  jockeyName: string;
  finishTime: number;
  rank: number;
  violationFlag: boolean;
};

export type RefereeReportResponse = {
  reportID: string;
  raceID: string;
  raceName: string;
  raceStatus: "RESULT_SUBMITTED";
  refereeID: string;
  confirmedResult: boolean;
  submittedAt: string;
  results: ReportResult[];
  violations: Violation[];
};