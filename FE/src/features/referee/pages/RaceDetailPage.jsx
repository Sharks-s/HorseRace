import { useState } from "react";
import ViolationsTab from "../components/ViolationsTab";
import RaceReportTab from "../components/RaceReportTab";
import "../referee.css";

// type Tab = "OVERVIEW" | "VIOLATIONS" | "REPORT";

export default function RaceDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("VIOLATIONS");

  // Sau này lấy từ useParams()
  const raceId = "race-uuid-demo";

  // Sau này gọi API detail race riêng nếu BE có
  const raceStatus = "OPEN";

  return (
    <div className="referee-page">
      <nav className="top-nav">
        <div className="brand">HorseRace</div>

        <div className="nav-links">
          <a>Home</a>
          <a>Races</a>
          <a>Stable</a>
          <a>Results</a>
        </div>
      </nav>

      <section className="page-header-card">
        <div>
          <h1>Race Detail</h1>
          <p>Race 4: The King's Cup - 14:30</p>
        </div>

        <span className="race-status-badge">{raceStatus}</span>
      </section>

      <div className="tab-bar">
        <button
          className={activeTab === "OVERVIEW" ? "active" : ""}
          onClick={() => setActiveTab("OVERVIEW")}
        >
          Overview
        </button>

        <button
          className={activeTab === "VIOLATIONS" ? "active" : ""}
          onClick={() => setActiveTab("VIOLATIONS")}
        >
          Violations
        </button>

        <button
          className={activeTab === "REPORT" ? "active" : ""}
          onClick={() => setActiveTab("REPORT")}
        >
          Race Report
        </button>
      </div>

      {activeTab === "OVERVIEW" && (
        <section className="table-card">
          <h2>Race Overview</h2>
          <p>Basic race information will be displayed here.</p>
        </section>
      )}

      {activeTab === "VIOLATIONS" && (
        <ViolationsTab raceId={raceId} raceSubmitted={false} />
      )}

      {activeTab === "REPORT" && (
        <RaceReportTab raceId={raceId} />
      )}
    </div>
  );
}