import { useState } from "react";
import type {
  InspectBody,
  InspectDecision,
  RegistrationInspection,
} from "../types/referee.types";
import StatusBadge from "./StatusBadge";
import "../referee.css";

type Props = {
  inspection: RegistrationInspection;
  onClose: () => void;
  onSubmit: (body: InspectBody) => Promise<void>;
};

export default function InspectionModal({
  inspection,
  onClose,
  onSubmit,
}: Props) {
  const [decision, setDecision] =
    useState<InspectDecision>("PASSED");
  const [note, setNote] = useState("Horse passed inspection");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      await onSubmit({
        decision,
        note,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="inspection-modal">
        <div className="modal-header">
          <div>
            <h2>BR-01 Pre-race Inspection</h2>
            <p>{inspection.raceName}</p>
          </div>

          <button className="btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="inspection-summary">
          <div>
            <span className="label">Horse</span>
            <strong>{inspection.horseName}</strong>
            <p>
              {inspection.breed} · {inspection.age} years ·{" "}
              {inspection.weight} kg
            </p>
          </div>

          <div>
            <span className="label">Jockey</span>
            <strong>{inspection.jockeyName}</strong>
          </div>

          <div>
            <span className="label">Owner</span>
            <strong>{inspection.ownerUsername}</strong>
          </div>
        </div>

        <div className="check-list">
          <div>
            <span>Health Certificate</span>
            <StatusBadge
              label={inspection.healthCertValid ? "Valid" : "Invalid"}
              type={inspection.healthCertValid ? "success" : "danger"}
            />
          </div>

          <div>
            <span>Weight Requirement</span>
            <StatusBadge
              label={inspection.weightValid ? "Valid" : "Invalid"}
              type={inspection.weightValid ? "success" : "danger"}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Decision</label>
          <select
            value={decision}
            onChange={(e) =>
              setDecision(e.target.value as InspectDecision)
            }
          >
            <option value="PASSED">PASSED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        <div className="form-group">
          <label>Inspection Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter inspection note"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-gold"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Submit Inspection"}
          </button>
        </div>
      </div>
    </div>
  );
}