const LiveStandings = ({ race, raceResults, error, loading }) => {
  const rankLabel = (rank) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return rank;
  };

  return (
    <div className="live-standings">
      <div className="live-standings-head">
        <div>
          <p>Race standings</p>
          <h2>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              flag
            </span>
            {race?.name || 'Select an official race'}
          </h2>
        </div>
        {loading && <span className="live-standings-loading">Updating</span>}
      </div>

      {error && (
        <div className="live-standings-alert">
          <span className="material-symbols-outlined">info</span>
          {error}
        </div>
      )}

      {!error && raceResults.length === 0 && !loading && (
        <div className="live-standings-empty">
          <span className="material-symbols-outlined">hourglass_empty</span>
          <p>No official results to display. Select an official race or wait for publication.</p>
        </div>
      )}

      {raceResults.length > 0 && (
        <div className="live-standings-table-wrap">
          <table className="live-standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Horse & Jockey</th>
                <th className="live-results-align-right">Time</th>
                <th className="live-results-align-right">Points</th>
                <th className="live-results-align-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {raceResults.map((result) => (
                <tr
                  key={result.id}
                  className={result.placement === 1 && !result.violation ? 'live-standings-winner' : ''}
                >
                  <td>
                    <span
                      className={`live-standings-rank ${
                        result.violation ? 'live-standings-rank-dq' : `live-standings-rank-${result.placement}`
                      }`}
                    >
                      {result.violation ? 'DQ' : rankLabel(result.placement)}
                    </span>
                  </td>
                  <td>
                    <strong className={result.violation ? 'live-standings-struck' : ''}>{result.horseName}</strong>
                    <span>Jockey: {result.jockeyName}</span>
                  </td>
                  <td className="live-results-align-right live-results-number">{result.finishTime}s</td>
                  <td className="live-results-align-right live-standings-points">
                    {result.points?.toFixed(1)}
                  </td>
                  <td className="live-results-align-center">
                    {result.violation ? (
                      <span className="live-standings-status live-standings-status-dq">DQ</span>
                    ) : (
                      <span className="live-standings-status live-standings-status-ok">Official</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveStandings;
