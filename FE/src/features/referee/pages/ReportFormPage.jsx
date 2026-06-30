import React, { useState } from 'react';

const ReportFormPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [standings, setStandings] = useState([
    { rank: '1', horse: 'Midnight Runner', jockey: 'J. Velazquez', time: '2:28.45', points: 10, dq: false },
    { rank: '2', horse: 'Thunder Strike', jockey: 'I. Ortiz Jr.', time: '2:28.52', points: 6, dq: false },
    { rank: '3', horse: 'Golden Mane', jockey: 'J. Rosario', time: '2:28.91', points: 4, dq: false },
    { rank: '-', horse: 'Shadowfax', jockey: 'L. Saez', time: '2:29.10', points: 0, dq: true }
  ]);

  const handleDqToggle = (index) => {
    const updated = [...standings];
    updated[index].dq = !updated[index].dq;
    if (updated[index].dq) {
      updated[index].points = 0;
      updated[index].rank = '-';
    } else {
      updated[index].points = index === 0 ? 10 : index === 1 ? 6 : 4;
      updated[index].rank = String(index + 1);
    }
    setStandings(updated);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto bg-background p-md md:p-xl transition-all">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumb & Header */}
          <div className="mb-lg">
            <nav aria-label="Breadcrumb" className="flex text-on-surface-variant font-label-md text-label-md mb-2">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <a className="hover:text-secondary transition-colors" href="#">Referee</a>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                    <span className="text-on-surface font-semibold">Submit Race Report</span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="font-display-lg text-display-lg text-on-surface font-bold text-3xl">Submit Race Report</h2>
            </div>
          </div>

          {/* Race Info Card */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg mb-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Race #04 - The Grand Derby</h3>
                  <span className="px-2 py-1 rounded bg-[#ffecd1] text-[#9a5b00] font-label-md text-label-md uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
                    Pending Report
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">Belmont Park • 1m 4f • Dirt • Fast • Purse: $1,500,000</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Race Completed</p>
              <p className="font-tabular-nums text-tabular-nums text-on-surface text-lg">Oct 24, 2023 - 14:30 EST</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mb-lg">
            <ol className="flex items-center w-full">
              <li className={`flex w-full items-center ${currentStep >= 1 ? 'text-secondary' : 'text-outline-variant'} after:content-[''] after:w-full after:h-1 after:border-b after:border-secondary after:border-4 after:inline-block`}>
                <span className="flex items-center justify-center w-8 h-8 bg-secondary-fixed rounded-full lg:h-10 lg:w-10 shrink-0 ring-4 ring-white">
                  <span className="font-headline-sm text-headline-sm text-primary-container">1</span>
                </span>
              </li>
              <li className={`flex w-full items-center ${currentStep >= 2 ? 'text-secondary' : 'text-outline-variant'} after:content-[''] after:w-full after:h-1 after:border-b after:border-outline-variant after:border-4 after:inline-block`}>
                <span className="flex items-center justify-center w-8 h-8 bg-surface-variant rounded-full lg:h-10 lg:w-10 shrink-0 ring-4 ring-white">
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">2</span>
                </span>
              </li>
              <li className={`flex items-center ${currentStep >= 3 ? 'text-secondary' : 'text-outline-variant'}`}>
                <span className="flex items-center justify-center w-8 h-8 bg-surface-variant rounded-full lg:h-10 lg:w-10 shrink-0 ring-4 ring-white">
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">3</span>
                </span>
              </li>
            </ol>
            <div className="flex justify-between mt-3 px-2">
              <span className="font-label-md text-label-md text-secondary uppercase w-1/3 text-left">Race Results</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase w-1/3 text-center">Violations Summary</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase w-1/3 text-right">Review & Submit</span>
            </div>
          </div>

          {/* Content Canvas */}
          <div className="space-y-lg">
            {/* Step 1: Active */}
            <div className="bg-white rounded-xl border-t-4 border-t-secondary border-x border-b border-outline-variant shadow-sm overflow-hidden">
              <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Final Standings</h3>
                </div>
                <button className="px-4 py-2 border-2 border-secondary text-secondary font-label-md text-label-md rounded hover:bg-secondary/5 transition-colors">
                  Calculate Rankings
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#F7F8FA] border-b border-outline-variant">
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase w-16 text-center">Rank</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase">Horse</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase">Jockey</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase text-right">Finish Time</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase text-center w-24">Points</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase text-center w-32">Disqualified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {standings.map((row, index) => (
                      <tr key={index} className={`hover:bg-surface-container-low transition-colors group ${row.dq ? 'bg-error/5 opacity-75' : ''}`}>
                        <td className="p-4 text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${row.rank === '1' ? 'bg-secondary-fixed' : 'bg-surface-variant'}`}>
                            <span className="font-headline-sm text-headline-sm text-primary-container">{row.rank}</span>
                          </div>
                        </td>
                        <td className={`p-4 font-body-lg text-body-lg text-on-surface font-semibold ${row.dq ? 'line-through' : ''}`}>{row.horse}</td>
                        <td className="p-4 font-body-md text-body-md text-on-surface-variant">{row.jockey}</td>
                        <td className="p-4 font-tabular-nums text-tabular-nums text-on-surface text-right">{row.time}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded font-tabular-nums text-tabular-nums ${row.dq ? 'bg-surface-variant text-on-surface-variant' : 'bg-secondary-container text-on-secondary-container'}`}>{row.points}</span>
                        </td>
                        <td className="p-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.dq}
                              onChange={() => handleDqToggle(index)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-error"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 2: Collapsed Summary */}
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg flex items-center justify-between opacity-75 hover:opacity-100 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-outline-variant text-2xl">gavel</span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">2. Violations Summary</h4>
                  <p className="font-body-md text-body-md text-error flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-error inline-block"></span>
                    3 violations recorded requiring review
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant">expand_more</span>
            </div>

            {/* Step 3: Collapsed Summary */}
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-outline-variant text-2xl">task_alt</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">3. Review & Submit</h4>
              </div>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="mt-xl text-center pb-xl">
            <p className="font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-2 bg-surface-variant/50 py-3 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">info</span>
              BR-05: Results can only be published after referee report is submitted and Admin approval.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportFormPage;
