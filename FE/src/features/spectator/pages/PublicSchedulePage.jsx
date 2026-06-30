import React from 'react';

const PublicSchedulePage = () => {
  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] antialiased min-h-screen flex flex-col font-body-md text-body-md">
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="bg-[#131b2e] text-white py-[80px] px-md md:px-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% -20%, #009488 0%, transparent 50%)" }}></div>
          <div className="max-w-container-max mx-auto relative z-10 flex flex-col items-center text-center space-y-xl">
            <h1 className="font-display-lg text-display-lg md:text-[64px] leading-tight font-bold text-4xl">Race Schedule</h1>
            <p className="font-body-lg text-body-lg text-[#7c839b] max-w-2xl mt-4">Discover upcoming tournaments, track live races, and analyze historical performance data across premier global tracks.</p>
            {/* Search & Filter Bar */}
            <div className="w-full max-w-4xl mt-lg">
              <div className="glass-panel rounded-xl p-xs flex flex-col md:flex-row items-center gap-sm bg-white/10 border-white/20 p-2">
                <div className="relative w-full flex-grow">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-white/50 pl-2">search</span>
                  <input
                    type="text"
                    placeholder="Search tournaments, tracks, or horses..."
                    className="w-full bg-white/5 border-none text-white placeholder:text-white/50 pl-[40px] pr-sm py-sm rounded focus:ring-2 focus:ring-secondary outline-none font-body-md text-body-md"
                  />
                </div>
                <div className="flex space-x-xs overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide gap-1">
                  <button className="whitespace-nowrap px-md py-sm bg-[#006a61] text-white rounded-full font-label-md text-label-md px-3 py-1">All</button>
                  <button className="whitespace-nowrap px-md py-sm bg-white/10 text-white hover:bg-white/20 transition-colors rounded-full font-label-md text-label-md border border-white/20 px-3 py-1">This Week</button>
                  <button className="whitespace-nowrap px-md py-sm bg-white/10 text-white hover:bg-white/20 transition-colors rounded-full font-label-md text-label-md border border-white/20 px-3 py-1">This Month</button>
                  <button className="whitespace-nowrap px-md py-sm bg-white/10 text-white hover:bg-white/20 transition-colors rounded-full font-label-md text-label-md border border-white/20 px-3 py-1">Archived</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Grid */}
        <section className="py-xl px-md md:px-xl max-w-container-max mx-auto w-full mt-8">
          <div className="flex justify-between items-end mb-lg">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface text-2xl">Featured Tournaments</h2>
            <div className="flex items-center space-x-sm text-on-surface-variant font-label-md text-label-md gap-1">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Sort by: Date</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg mt-4">
            {/* Tournament Card 1 (Live) */}
            <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden flex flex-col border-t-4 border-t-secondary relative">
              {/* Banner Info */}
              <div className="p-lg bg-[#f8f9ff] border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-md p-4">
                <div className="flex items-start gap-md">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <div className="w-full h-full object-cover bg-teal-800 flex items-center justify-center text-white font-bold text-xs">Royal</div>
                  </div>
                  <div className="pl-3">
                    <div className="flex items-center gap-xs mb-1">
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface text-lg">Royal Ascot Summer Series</h3>
                      <span className="flex items-center gap-[4px] px-2 py-1 bg-secondary-container/20 text-on-secondary-container rounded text-[10px] font-bold tracking-wider uppercase ml-2">
                        <span className="w-[6px] h-[6px] bg-secondary rounded-full pulse-live inline-block"></span>
                        LIVE
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-md gap-y-1 text-on-surface-variant font-body-md text-body-md gap-3">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> Ascot, UK</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_month</span> Jun 18 - Jun 22, 2024</span>
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right mt-2 md:mt-0">
                  <div className="font-tabular-nums text-tabular-nums text-on-surface font-semibold">12 Races Total</div>
                  <button className="mt-2 text-secondary font-label-md text-label-md hover:underline flex items-center gap-1 md:justify-end w-full group">
                    View Details <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
              {/* Expanded Race List (Data Table) */}
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#f8f9ff] border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                      <th className="py-sm px-lg font-semibold p-3">Race Name</th>
                      <th className="py-sm px-lg font-semibold p-3">Time (Local)</th>
                      <th className="py-sm px-lg font-semibold p-3">Track Condition</th>
                      <th className="py-sm px-lg font-semibold text-right p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-tabular-nums text-tabular-nums text-on-surface divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="py-sm px-lg p-3">
                        <div className="font-medium text-secondary group-hover:underline">Queen Anne Stakes (G1)</div>
                        <div className="text-[12px] text-on-surface-variant font-body-md font-normal mt-0.5">1m (Straight) • 4yo+</div>
                      </td>
                      <td className="py-sm px-lg p-3">14:30 GMT</td>
                      <td className="py-sm px-lg p-3">Good to Firm</td>
                      <td className="py-sm px-lg text-right p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-[#86f5e7]/20 text-[#007168] text-[11px] font-bold uppercase border border-[#86f5e7]/50">
                          In Progress
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="py-sm px-lg p-3">
                        <div className="font-medium text-on-surface group-hover:text-secondary group-hover:underline">Coventry Stakes (G2)</div>
                        <div className="text-[12px] text-on-surface-variant font-body-md font-normal mt-0.5">6f • 2yo</div>
                      </td>
                      <td className="py-sm px-lg p-3">15:05 GMT</td>
                      <td className="py-sm px-lg p-3">Good to Firm</td>
                      <td className="py-sm px-lg text-right p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase border border-primary-fixed-dim/50">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicSchedulePage;
