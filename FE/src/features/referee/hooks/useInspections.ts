import { useEffect, useState } from "react";
import { refereeApi } from "../api/referee.api";
import type {
  InspectBody,
  RegistrationInspection,
} from "../types/referee.types";

export function useInspections() {
  const [inspections, setInspections] = useState<RegistrationInspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await refereeApi.getAssignedInspections();
      setInspections(data);
    } catch (err) {
      console.error(err);
      setError("Cannot load assigned inspections");
    } finally {
      setLoading(false);
    }
  };

  const inspect = async (
    registrationId: string,
    body: InspectBody
  ) => {
    const updated = await refereeApi.inspectRegistration(
      registrationId,
      body
    );

    setInspections((prev) =>
      prev.map((item) =>
        item.registrationId === registrationId ? updated : item
      )
    );
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return {
    inspections,
    loading,
    error,
    refetch: fetchInspections,
    inspect,
  };
}