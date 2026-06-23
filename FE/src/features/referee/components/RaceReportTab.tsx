import { useMemo, useState } from "react";
import { refereeApi } from "../api/referee.api";
import type {
  RefereeReportResponse,
  SubmitReportBodyItem,
} from "../types/referee.types";
import "../referee.css";

type Props = {
  raceId: string;
};

type RaceReadyHorse = {
  horseID: string;
  horseName: string;
  jockeyID: string;
  jockeyName: string;
  hasViolation: boolean;
};

const demoRaceReadyHorses: RaceReadyHorse[] = [
  {
    horseID: "horse-1",
    horseName: "Thunderbolt",
    jockeyID: "jockey-1",
    jockeyName: "J. Smith",
    hasViolation: true,
  },
  {
    horseID: "horse-2",
    horseName: "Midnight Runner",
    jockeyID: "jockey-2",
    jockeyName: "A. Davis",
    hasViolation: false,
  },
  {
    horseID: "horse-3",
    horseName: "Golden Hoof",
    jockeyID: "jockey-3",
    jockeyName: "M. Wang",
    hasViolation: false,
  },
];

export default function RaceReportTab({ raceId }: Props) {
  const [finishTimes, setFinishTimes] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] =
    useState<RefereeReportResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = !!submittedReport;

  const previewRows = useMemo(() => {
    const rows = demoRaceReadyHorses.map((horse) => ({
      ...horse,
      finishTime: Number(finishTimes[horse.horseID]),
    }));

    const validRows = rows
      .filter((row) => !Number.isNaN(row.finishTime) && row.finishTime > 0)
      .sort((a, b) => a.finishTime - b.finishTime);

    const rankMap = new Map<string, number>();

    validRows.forEach((row, index) => {
      rankMap.set(row.horseID, index + 1);
    });

    return rows.map((row) => ({
      ...row,
      previewRank: rankMap.get(row.horseID) ?? null,
    }));
  }, [finishTimes]);

  const handleChangeFinishTime = (horseID: string, value: string) => {
    setFinishTimes((prev) => ({
      ...prev,
      [horseID]: value,
    }));
  };

  const handleSubmitReport = async () => {
    const body: SubmitReportBodyItem[] = demoRaceReadyHorses.map(
      (horse) => ({
        horseID: horse.horseID,
        finishTime: Number(finishTimes[horse.horseID]),
      })
    );

    const invalid = body.some(
      (item) => Number.isNaN(item.finishTime) || item.finishTime <= 0
    );

    if (invalid) {
      alert("Please enter finish time for all RACE_READY horses.");
      return;
    }

    const confirmed = window.confirm(
      "After submission, finish times, ranking, and violations will be locked. Submit final race report?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      const report = await refereeApi.submitReport(raceId, body);
      setSubmittedReport(report);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <section className="table-card">
        <div className="success-banner">
          Race report submitted successfully. Status: RESULT_SUBMITTED
        </div>

        <h2>Final Rank Table</h2>

        <table className="referee-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Horse</th>
              <th>Jockey</th>
              <th>Finish Time</th>
              <th>Violation</th>
            </tr>
          </thead>

          <tbody>
            {submittedReport.results.map((result) => (
              <tr key={result.resultID}>
                <td>#{result.rank}</td>
                <td>{result.horseName}</td>
                <td>{result.jockeyName}</td>
                <td>{result.finishTime}s</td>
                <td>
                  {result.violationFlag ? "⚠ Yes" : "No violation"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  return (
    <section className="table-card">
      <div className="report-header">
        <div>
          <h2>Official Race Results Input</h2>
          <p>Enter official finish times for all RACE_READY horses.</p>
        </div>

        <span className="race-status-badge">OPEN</span>
      </div>

      <table className="referee-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Jockey</th>
            <th>Finish Time</th>
            <th>Preview Rank</th>
            <th>Violation Flag</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {previewRows.map((row) => (
            <tr key={row.horseID}>
              <td>
                <strong>{row.horseName}</strong>
              </td>

              <td>{row.jockeyName}</td>

              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="70.10"
                  disabled={isSubmitted}
                  value={finishTimes[row.horseID] ?? ""}
                  onChange={(e) =>
                    handleChangeFinishTime(
                      row.horseID,
                      e.target.value
                    )
                  }
                />
                <br />
                <span className="muted">Finish time in seconds</span>
              </td>

              <td>
                {row.previewRank ? `${row.previewRank}` : "-"}
              </td>

              <td>
                {row.hasViolation ? (
                  <span className="violation-warning">⚠ Violation</span>
                ) : (
                  <span className="muted">No violation</span>
                )}
              </td>

              <td>RACE_READY</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="review-box">
        <h3>Review Violations</h3>
        <p>
          DISQUALIFY violations will affect final result. Please review all
          race violations before submitting the report.
        </p>
      </div>

      <div className="form-group">
        <label>Referee Notes</label>
        <textarea placeholder="Enter final report notes..." />
      </div>

      <div className="footer-actions">
        <button className="btn-secondary">Preview Ranking</button>

        <button
          className="btn-gold"
          disabled={submitting}
          onClick={handleSubmitReport}
        >
          {submitting ? "Submitting..." : "Submit Final Report"}
        </button>
      </div>
    </section>
  );
}