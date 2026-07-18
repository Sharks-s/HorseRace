const Leaderboard = ({ title, standings, limit = 10, variant = 'list', onViewFull, showTieBreaker = false }) => {
  const displayedStandings = standings.slice(0, limit);

  if (variant === 'table') {
    return (
      <div className="leaderboard-table-card">
        <div className="leaderboard-table-head">
          <h4>{title}</h4>
          <span className="material-symbols-outlined">leaderboard</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Rnk</th>
              <th>Jockey / Horse</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            {displayedStandings.length === 0 ? (
              <tr>
                <td colSpan="3" className="leaderboard-empty">
                  No standings available.
                </td>
              </tr>
            ) : (
              displayedStandings.map((standing, index) => (
                <tr key={standing.horseId}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{standing.horseName}</strong>
                    <span>{standing.totalPoints} pts</span>
                  </td>
                  <td>{standing.bestFinishTime ? `${standing.bestFinishTime.toFixed(2)}s` : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {onViewFull && (
          <div className="leaderboard-footer">
            <button type="button" onClick={onViewFull}>
              View Full Leaderboard
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="live-leaderboard">
      <div className="live-leaderboard-head">
        <div>
          <p>Tournament leaderboard</p>
          <h2>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              trophy
            </span>
            {title}
          </h2>
        </div>
      </div>

      {displayedStandings.length === 0 ? (
        <div className="live-leaderboard-empty">
          <span className="material-symbols-outlined">leaderboard</span>
          <p>No standings yet. Publish official race results first.</p>
        </div>
      ) : (
        <ol className="live-leaderboard-list">
          {displayedStandings.map((standing) => (
            <li key={standing.horseId}>
              <div className="live-leaderboard-rank">{standing.rank}</div>
              <div className="live-leaderboard-horse">
                <strong>{standing.horseName}</strong>
                <span>Best: {standing.bestFinishTime ? `${standing.bestFinishTime.toFixed(2)}s` : '-'}</span>
              </div>
              <div className="live-leaderboard-points">{standing.totalPoints?.toFixed(1)} pts</div>
            </li>
          ))}
        </ol>
      )}

      {showTieBreaker && displayedStandings.length > 0 && (
        <p className="live-leaderboard-note">Tie-breaking: best finish time ascending</p>
      )}
    </div>
  );
};

export default Leaderboard;
