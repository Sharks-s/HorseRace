import { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./JockeyWorkspacePage.css";

const initialProfile = {
  licenseNo: "",
  name: "",
  weight: "",
  bio: "",
};

const formatDateTime = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");

const JockeyWorkspacePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [ranking, setRanking] = useState({ totalRaces: 0, wins: 0, totalPoints: 0, averagePlacement: 0 });
  const [schedule, setSchedule] = useState([]);
  const [limitDate, setLimitDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dailyLimit, setDailyLimit] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWorkspace = useCallback(async () => {
    try {
      const [profileRes, rankingRes, scheduleRes, limitRes] = await Promise.all([
        api.get("/jockey/profile"),
        api.get("/jockey/ranking"),
        api.get("/jockey/schedule/upcoming"),
        api.get("/jockey/daily-limit", { params: { date: limitDate } }),
      ]);

      const profileData = profileRes.data.data;
      if (profileData) {
        setProfile({
          licenseNo: profileData.licenseNo || "",
          name: profileData.name || "",
          weight: profileData.weight == null ? "" : String(profileData.weight),
          bio: profileData.bio || "",
        });
      }
      setRanking(rankingRes.data.data || {});
      setSchedule(scheduleRes.data.data || []);
      setDailyLimit(limitRes.data.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load jockey workspace.");
    } finally {
      setLoading(false);
    }
  }, [limitDate]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...profile,
        weight: Number(profile.weight),
      };
      const response = await api.put("/jockey/profile", payload);
      const updated = response.data.data;
      setProfile({
        licenseNo: updated.licenseNo || "",
        name: updated.name || "",
        weight: updated.weight == null ? "" : String(updated.weight),
        bio: updated.bio || "",
      });
      toast.success("Jockey profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not update profile.");
    }
  };

  const checkDailyRaceLimit = async () => {
    try {
      const response = await api.get("/jockey/daily-limit", { params: { date: limitDate } });
      setDailyLimit(response.data.data);
      toast.success("Daily race limit checked");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not check daily limit.");
    }
  };

  return (
    <div className="jockey-shell" style={{ display: "block" }}>
      <main className="jockey-main" style={{ padding: "24px" }}>
        <section className="jockey-hero">
          <div>
            <p>Jockey Workspace</p>
            <h1>{profile.name || "Complete Your Racing Profile"}</h1>
          </div>
          <div className="jockey-hero-badge">
            <span className="material-symbols-outlined">military_tech</span>
            <strong>{ranking.totalPoints || 0}</strong>
            <small>points</small>
          </div>
        </section>

        <section className="jockey-grid">
          <div className="jockey-left">
            <section className="jockey-card" id="profile">
              <div className="jockey-card-header">
                <div>
                  <p>Profile</p>
                  <h2>Rider Details</h2>
                </div>
              </div>

              <form className="jockey-form" onSubmit={updateProfile}>
                <label>
                  <span>License No</span>
                  <input
                    value={profile.licenseNo}
                    onChange={(event) => setProfile((current) => ({ ...current, licenseNo: event.target.value }))}
                    placeholder="JCK-2026-001"
                    required
                  />
                </label>
                <label>
                  <span>Name</span>
                  <input
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Alex Rider"
                    required
                  />
                </label>
                <label>
                  <span>Weight</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={profile.weight}
                    onChange={(event) => setProfile((current) => ({ ...current, weight: event.target.value }))}
                    placeholder="55.5"
                    required
                  />
                </label>
                <label className="jockey-form-wide">
                  <span>Bio</span>
                  <textarea
                    value={profile.bio}
                    onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
                    placeholder="Race experience, strengths, preferred track conditions..."
                    rows="4"
                  />
                </label>
                <button type="submit">
                  <span className="material-symbols-outlined">save</span>
                  Update Profile
                </button>
              </form>
            </section>

            <section className="jockey-card" id="schedule">
              <div className="jockey-card-header">
                <div>
                  <p>Accepted Registrations</p>
                  <h2>Upcoming Race Schedule</h2>
                </div>
              </div>

              <div className="jockey-schedule-list">
                {schedule.map((item) => (
                  <article key={item.registrationId} className="jockey-race-card">
                    <div className="jockey-race-code">
                      <span className="material-symbols-outlined">timer</span>
                    </div>
                    <div>
                      <h3>{item.raceName}</h3>
                      <p>{item.tournamentName}</p>
                      <span>{formatDateTime(item.startTime)}</span>
                    </div>
                    <div className="jockey-race-horse">
                      <strong>{item.horseName}</strong>
                      <small>{item.ownerUsername}</small>
                    </div>
                  </article>
                ))}
                {!loading && schedule.length === 0 && (
                  <div className="jockey-empty">No upcoming accepted race registrations.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="jockey-side">
            <section className="jockey-ranking" id="ranking">
              <div className="jockey-card-header">
                <div>
                  <p>Auto-calculated</p>
                  <h2>Personal Ranking</h2>
                </div>
              </div>
              <div className="jockey-ranking-grid">
                <div>
                  <span>Total Races</span>
                  <strong>{ranking.totalRaces || 0}</strong>
                </div>
                <div>
                  <span>Wins</span>
                  <strong>{ranking.wins || 0}</strong>
                </div>
                <div>
                  <span>Total Points</span>
                  <strong>{ranking.totalPoints || 0}</strong>
                </div>
                <div>
                  <span>Avg Place</span>
                  <strong>{Number(ranking.averagePlacement || 0).toFixed(2)}</strong>
                </div>
              </div>
            </section>

            <section className="jockey-limit-card" id="br02">
              <div className="jockey-rule-header">
                <span className="material-symbols-outlined">fact_check</span>
                <div>
                  <h3>BR-02</h3>
                  <p>Daily race limit</p>
                </div>
              </div>
              <label>
                <span>Date</span>
                <input type="date" value={limitDate} onChange={(event) => setLimitDate(event.target.value)} />
              </label>
              <button type="button" onClick={checkDailyRaceLimit}>
                <span className="material-symbols-outlined">fact_check</span>
                Check Daily Race Limit
              </button>
              {dailyLimit && (
                <div className={`jockey-limit-result ${dailyLimit.withinLimit ? "jockey-limit-ok" : "jockey-limit-bad"}`}>
                  <strong>
                    {dailyLimit.acceptedRaceCount}/{dailyLimit.dailyLimit}
                  </strong>
                  <span>{dailyLimit.withinLimit ? "Within daily limit" : "Limit exceeded"}</span>
                </div>
              )}
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default JockeyWorkspacePage;
