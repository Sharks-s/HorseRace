import { useEffect, useState } from "react";
import { refereeApi } from "../api/referee.api";
import type {
  CreateViolationBody,
  Violation,
} from "../types/referee.types";

export function useViolations(raceId: string) {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const data = await refereeApi.getViolations(raceId);
      setViolations(data);
    } finally {
      setLoading(false);
    }
  };

  const createViolation = async (body: CreateViolationBody) => {
    const created = await refereeApi.createViolation(raceId, body);
    setViolations((prev) => [created, ...prev]);
  };

  const deleteViolation = async (violationId: string) => {
    await refereeApi.deleteViolation(raceId, violationId);

    setViolations((prev) =>
      prev.filter((item) => item.violationID !== violationId)
    );
  };

  useEffect(() => {
    if (raceId) {
      fetchViolations();
    }
  }, [raceId]);

  return {
    violations,
    loading,
    refetch: fetchViolations,
    createViolation,
    deleteViolation,
  };
}