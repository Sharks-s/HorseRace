import { useState } from "react";
import { useViolations } from "../hooks/useViolations";
import type {
  CreateViolationBody,
  ViolationSeverity,
  ViolationType,
} from "../types/referee.types";
import StatusBadge from "./StatusBadge";
import "../referee.css";

type Props = {
  raceId: string;
  raceSubmitted: boolean;
};

const demoParticipants = [
  {
    horseID: "horse-1",
    horseName: "Thunderbolt",
    jockeyID: "jockey-1",
    jockeyName: "J. Smith",
  },
  {
    horseID: "horse-2",
    horseName: "Midnight Runner",
    jockeyID: "jockey-2",
    jockeyName: "A. Davis",
  },
  {
    horseID: "horse-3",
    horseName: "Golden Hoof",
    jockeyID: "jockey-3",
    jockeyName: "M. Wang",
  },
];

export default function ViolationsTab({
  raceId,
  raceSubmitted,
}: Props) {
  const {
    violations,
    loading,
    createViolation,
    deleteViolation,
  } = useViolations(raceId);

  const [horseID, setHorseID] = useState(demoParticipants[0].horseID);
  const [type, setType] =
    useState<ViolationType>("LANE_VIOLATION");
  const [severity, setSeverity] =
    useState<ViolationSeverity>("WARNING");
  const [description, setDescription] = useState("");

  const selectedParticipant = demoParticipants.find(
    (item) => item.horseID === horseID
  );

  const handleSubmit = async () => {
    if (!selectedParticipant || !description.trim()) {
      alert("Please select horse and enter description");
      return;
    }

    const body: CreateViolationBody = {
      horseID: selectedParticipant.horseID,
      jockeyID: selectedParticipant.jockeyID,
      type,
      severity,
      description,
    };

    await createViolation(body);
    setDescription("");
  };

  return (
    <section className="two-column-layout">
      <div className="form-card">
        <h2>Create Violation</h2>
        <p>Record violation during race.</p>

        <div className="form-group">
          <label>Horse</label>
          <select
            value={horseID}
            disabled={raceSubmitted}
            onChange={(e) => setHorseID(e.target.value)}
          >
            {demoParticipants.map((item) => (
              <option key={item.horseID} value={item.horseID}>
                {item.horseName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Jockey</label>
          <input
            disabled
            value={selectedParticipant?.jockeyName ?? ""}
          />
        </div>

        <div className="form-group">
          <label>Violation Type</label>
          <select
            value={type}
            disabled={raceSubmitted}
            onChange={(e) =>
              setType(e.target.value as ViolationType)
            }
          >
            <option value="LANE_VIOLATION">LANE_VIOLATION</option>
            <option value="FALSE_START">FALSE_START</option>
            <option value="DANGEROUS_RIDING">
              DANGEROUS_RIDING
            </option>
            <option value="OBSTRUCTION">OBSTRUCTION</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="form-group">
          <label>Severity</label>
          <select
            value={severity}
            disabled={raceSubmitted}
            onChange={(e) =>
              setSeverity(e.target.value as ViolationSeverity)
            }
          >
            <option value="WARNING">WARNING</option>
            <option value="DISQUALIFY">DISQUALIFY</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            disabled={raceSubmitted}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Horse crossed assigned lane"
          />
        </div>

        <button
          className="btn-gold"
          disabled={raceSubmitted}
          onClick={handleSubmit}
        >
          Add Violation
        </button>
      </div>

      <div className="table-card">
        <h2>Recorded Violations</h2>

        {loading && <p>Loading violations...</p>}

        {!loading && (
          <table className="referee-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Horse</th>
                <th>Jockey</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {violations.map((item) => (
                <tr key={item.violationID}>
                  <td>{item.timestamp}</td>
                  <td>{item.horseID}</td>
                  <td>{item.jockeyID}</td>
                  <td>{item.type}</td>
                  <td>
                    <StatusBadge
                      label={item.severity}
                      type={
                        item.severity === "DISQUALIFY"
                          ? "danger"
                          : "warning"
                      }
                    />
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <button
                      className="btn-danger"
                      disabled={raceSubmitted}
                      onClick={() =>
                        deleteViolation(item.violationID)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {violations.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    No violations recorded for this race.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {raceSubmitted && (
          <div className="lock-message">
            Report submitted. Violations are locked.
          </div>
        )}
      </div>
    </section>
  );
}