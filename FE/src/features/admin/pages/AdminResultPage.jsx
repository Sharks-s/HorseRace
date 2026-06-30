import React, { useState } from 'react';

const AdminResultPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [showWarning, setShowWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex selection:bg-secondary selection:text-on-secondary">
      {/* Main Content Area */}
      <main className="flex-1 bg-surface-container-lowest min-h-screen pb-xl">
        {/* Breadcrumb & Top Utility Area */}
        <header className="px-xl py-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-40">
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="font-label-md text-label-md hover:text-secondary cursor-pointer transition-colors">Admin</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-label-md text-label-md text-on-surface">Official Results</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search races, horses..."
                className="pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface text-body-md focus:ring-0 focus:border-secondary transition-all w-64 placeholder:text-on-surface-variant"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="px-xl pt-xl max-w-container-max mx-auto">
          {/* Page Header */}
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mb-md text-3xl">Official Results</h2>
            {/* Tab Bar */}
            <div className="flex gap-xl border-b border-outline-variant/50">
              <button
                onClick={() => setActiveTab('pending')}
                className={`font-label-md text-label-md pb-sm uppercase tracking-wider font-semibold ${activeTab === 'pending' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Pending Approval
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`font-label-md text-label-md pb-sm uppercase tracking-wider font-semibold ${activeTab === 'published' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Published Results
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`font-label-md text-label-md pb-sm uppercase tracking-wider font-semibold ${activeTab === 'all' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                All Results
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">pending_actions</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Pending</span>
              <span className="font-display-lg text-display-lg text-on-surface font-bold text-2xl">3</span>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">today</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Published Today</span>
              <span className="font-display-lg text-display-lg text-on-surface font-bold text-2xl">1</span>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">fact_check</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Total Published</span>
              <span className="font-display-lg text-display-lg text-on-surface font-bold text-2xl">12</span>
            </div>
          </div>

          {/* Pending Approval Content */}
          <section>
            {/* Filter Bar */}
            <div className="bg-white border border-outline-variant/30 rounded-lg p-md mb-lg flex flex-wrap gap-md items-center shadow-ambient-lvl1">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
              <span className="font-label-md text-label-md text-on-surface-variant mr-4">FILTERS</span>
              <select className="border border-outline-variant/50 rounded bg-white text-body-md py-1.5 px-3 focus:border-secondary focus:ring-0 min-w-[180px]">
                <option>All Tournaments</option>
                <option>Royal Ascot</option>
                <option>Kentucky Derby</option>
              </select>
              <select className="border border-outline-variant/50 rounded bg-white text-body-md py-1.5 px-3 focus:border-secondary focus:ring-0 min-w-[150px]">
                <option>All Races</option>
                <option>Sprint</option>
                <option>Endurance</option>
              </select>
              <div className="flex items-center border border-outline-variant/50 rounded bg-white overflow-hidden">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant pl-3">calendar_today</span>
                <input className="border-none bg-transparent text-body-md py-1.5 px-3 focus:ring-0 w-[180px]" placeholder="Date Range" type="text" defaultValue="Oct 12 - Oct 14, 2023" />
              </div>
              <button className="ml-auto font-label-md text-label-md text-secondary hover:text-on-secondary-fixed-variant transition-colors">Clear Filters</button>
            </div>

            {/* Results Grid */}
            <div className="flex flex-col gap-lg">
              <div className="bg-white border border-outline-variant/30 rounded-xl shadow-ambient-lvl1 flex flex-col overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                
                {/* Card Header / Summary */}
                <div className="p-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                  <div className="pl-sm">
                    <div className="flex items-center gap-sm mb-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#fffbeb] text-[#d97706] border border-[#fcd34d]">PENDING APPROVAL</span>
                      <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span> Oct 14, 2023 • 14:30
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface text-lg">Grand National Sprint - Heat 4</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Royal Ascot Tournament • Referee: Michael O'Brien</p>
                  </div>
                  <div className="flex items-center gap-sm w-full md:w-auto mt-4 md:mt-0">
                    <button className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors">
                      View Rankings
                    </button>
                    <button
                      onClick={() => setShowWarning(!showWarning)}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#006a61] text-white font-label-md text-label-md uppercase tracking-wider hover:bg-[#005049] transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">publish</span> Publish Official
                    </button>
                  </div>
                </div>

                {/* Inline Publish Warning */}
                {showWarning && (
                  <div className="bg-[#eff4ff] border-y border-outline-variant/30 p-md flex items-start gap-md">
                    <span className="material-symbols-outlined text-error text-[24px] mt-0.5 text-red-600">warning</span>
                    <div className="flex-1">
                      <h4 class="font-label-md text-label-md font-bold text-on-surface uppercase mb-1">Confirm Publish</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-3">Publishing these results will make them official and visible to all users. This action cannot be easily undone.</p>
                      <div className="flex gap-sm">
                        <button className="px-3 py-1.5 rounded bg-red-600 text-white font-label-md text-label-md uppercase hover:bg-red-700 transition-colors">Confirm &amp; Publish</button>
                        <button onClick={() => setShowWarning(false)} className="px-3 py-1.5 rounded border border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase hover:bg-surface transition-colors">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expandable Top 3 Section */}
                <div className="border-t border-outline-variant/20 bg-[#f8f9ff] p-0">
                  <div
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-lg py-sm flex justify-between items-center cursor-pointer hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10"
                  >
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Top 3 Placements (Preview)</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
                  </div>
                  
                  {showPreview && (
                    <div className="overflow-x-auto p-4 pt-2">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-outline-variant/30">
                            <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant uppercase">Pos</th>
                            <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant uppercase">Horse</th>
                            <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant uppercase">Jockey</th>
                            <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant uppercase text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody className="font-tabular-nums text-tabular-nums text-on-surface">
                          <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
                            <td className="py-2 px-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#fef08a] text-[#854d0e] font-bold text-[12px]">1</span></td>
                            <td className="py-2 px-3 font-medium">Thunderstrike</td>
                            <td className="py-2 px-3 text-on-surface-variant">J. Smith</td>
                            <td className="py-2 px-3 text-right">01:12.45</td>
                          </tr>
                          <tr className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
                            <td className="py-2 px-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e5e7eb] text-[#374151] font-bold text-[12px]">2</span></td>
                            <td className="py-2 px-3 font-medium">Midnight Runner</td>
                            <td className="py-2 px-3 text-on-surface-variant">A. Davis</td>
                            <td className="py-2 px-3 text-right">01:12.89</td>
                          </tr>
                          <tr className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2 px-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#fed7aa] text-[#9a3412] font-bold text-[12px]">3</span></td>
                            <td className="py-2 px-3 font-medium">Desert Wind</td>
                            <td className="py-2 px-3 text-on-surface-variant">M. Johnson</td>
                            <td className="py-2 px-3 text-right">01:13.10</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminResultPage;
