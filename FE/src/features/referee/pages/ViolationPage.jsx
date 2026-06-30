import React, { useState } from 'react';

const ViolationPage = () => {
  const [violations, setViolations] = useState([
    {
      id: '01',
      horse: '#4 Midnight Runner',
      jockey: 'J. Smith',
      type: 'False Start',
      typeClass: 'bg-error-container text-on-error-container border border-error/20',
      time: '00:00',
      notes: 'Broke barrier before gates opened fully.',
    },
    {
      id: '02',
      horse: '#7 Star Gazer',
      jockey: 'M. Johnson',
      type: 'Lane Violation',
      typeClass: 'bg-orange-100 text-orange-800 border border-orange-200',
      time: '01:14',
      notes: 'Crossed into lane 3 causing interference.',
    },
    {
      id: '03',
      horse: '#2 Wind Chaser',
      jockey: 'A. Williams',
      type: 'Equipment Fault',
      typeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      time: '02:30',
      notes: 'Loose saddle girth noticed on back straight.',
    }
  ]);

  const [selectedHorse, setSelectedHorse] = useState('');
  const [selectedJockey, setSelectedJockey] = useState('');
  const [violationType, setViolationType] = useState('');
  const [occurrenceMinute, setOccurrenceMinute] = useState('');
  const [notes, setNotes] = useState('');

  const handleRecordViolation = () => {
    if (!selectedHorse || !selectedJockey || !violationType) return;
    const newViolation = {
      id: String(violations.length + 1).padStart(2, '0'),
      horse: selectedHorse === '1' ? '#1 Thunderbolt' : selectedHorse === '2' ? '#4 Midnight Runner' : '#7 Star Gazer',
      jockey: selectedJockey === '1' ? 'J. Smith' : selectedJockey === '2' ? 'M. Johnson' : 'A. Williams',
      type: violationType === 'false_start' ? 'False Start' : violationType === 'lane' ? 'Lane Violation' : violationType === 'obstruction' ? 'Obstruction' : 'Equipment Fault',
      typeClass: violationType === 'false_start' 
        ? 'bg-error-container text-on-error-container border border-error/20' 
        : violationType === 'lane' 
        ? 'bg-orange-100 text-orange-800 border border-orange-200'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      time: `0${occurrenceMinute || 0}:00`,
      notes: notes,
    };
    setViolations([...violations, newViolation]);
    // Reset form
    setSelectedHorse('');
    setSelectedJockey('');
    setViolationType('');
    setOccurrenceMinute('');
    setNotes('');
  };

  const handleDelete = (id) => {
    setViolations(violations.filter(v => v.id !== id));
  };

  return (
    <div className="bg-[#F7F8FA] text-on-surface flex min-h-screen font-body-md text-body-md overflow-x-hidden">
      {/* Main Content Area */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-container-max mx-auto p-xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-lg flex text-on-surface-variant font-label-md text-label-md">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <a className="hover:text-secondary transition-colors" href="#">Referee</a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                  <span aria-current="page" className="text-on-surface font-semibold">Record Violations</span>
                </div>
              </li>
            </ol>
          </nav>
          
          {/* Page Header */}
          <div className="mb-xl">
            <div className="flex items-start justify-between mb-sm">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary-container mb-1">Record Violations</h2>
                <div className="flex items-center gap-md">
                  <span className="font-body-lg text-body-lg text-on-surface-variant">Race: Grand Derby Round 1</span>
                  <div className="flex items-center gap-xs bg-surface-container-low px-sm py-1 rounded-full border border-outline-variant">
                    <div className="w-2 h-2 rounded-full bg-[#009488] pulse-live"></div>
                    <span className="font-label-md text-label-md text-on-surface">Status: IN PROGRESS</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Info Pills */}
            <div className="flex flex-wrap gap-sm mt-md">
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-white rounded-md border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">trophy</span>
                <span className="font-tabular-nums text-tabular-nums">Grand Derby Championship</span>
              </div>
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-white rounded-md border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">event</span>
                <span className="font-tabular-nums text-tabular-nums">Oct 12, 2024</span>
              </div>
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-white rounded-md border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">location_on</span>
                <span className="font-tabular-nums text-tabular-nums">Churchill Downs</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-lg">
            {/* Violation Entry Form (Card) */}
            <div className="col-span-12 lg:col-span-4 h-fit">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="h-1 bg-secondary w-full text-[#006a61]"></div>
                <div className="p-lg">
                  <h3 className="font-headline-sm text-headline-sm text-primary-container border-b border-outline-variant pb-sm mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary">add_alert</span>
                    New Violation
                  </h3>
                  <form className="space-y-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Select Horse</label>
                      <select
                        value={selectedHorse}
                        onChange={(e) => setSelectedHorse(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all outline-none"
                      >
                        <option value="">Choose a horse...</option>
                        <option value="1">#1 - Thunderbolt</option>
                        <option value="2">#4 - Midnight Runner</option>
                        <option value="3">#7 - Star Gazer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Select Jockey</label>
                      <select
                        value={selectedJockey}
                        onChange={(e) => setSelectedJockey(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all outline-none"
                      >
                        <option value="">Choose a jockey...</option>
                        <option value="1">J. Smith</option>
                        <option value="2">M. Johnson</option>
                        <option value="3">A. Williams</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Violation Type</label>
                      <select
                        value={violationType}
                        onChange={(e) => setViolationType(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all outline-none"
                      >
                        <option value="">Select type...</option>
                        <option value="false_start">False Start</option>
                        <option value="lane">Lane Violation</option>
                        <option value="obstruction">Obstruction</option>
                        <option value="equipment">Equipment Fault</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Minute of Occurrence</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 2"
                        value={occurrenceMinute}
                        onChange={(e) => setOccurrenceMinute(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-tabular-nums focus:border-secondary focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Description / Notes</label>
                      <textarea
                        rows="3"
                        placeholder="Enter details of the infraction..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary-fixed-dim/20 transition-all outline-none resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="button"
                      onClick={handleRecordViolation}
                      className="w-full bg-[#009488] hover:bg-[#007A70] text-white font-label-md text-label-md py-sm px-lg rounded-md transition-colors flex items-center justify-center gap-xs mt-lg shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      Record Violation
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Violations Log Table (Card) */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
                <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
                  <h3 className="font-headline-sm text-headline-sm text-primary-container flex items-center gap-xs">
                    <span className="material-symbols-outlined text-on-surface-variant">history</span>
                    Violations Log
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search log..."
                      className="bg-surface border border-[#E2E8F0] rounded-full pl-xl pr-md py-[6px] font-body-md text-sm focus:border-secondary outline-none w-64"
                    />
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F7F8FA] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant w-[50px]">#</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Horse</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Jockey</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Type</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Time</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant max-w-[200px]">Notes</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant text-center w-[80px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] font-tabular-nums text-tabular-nums text-on-surface">
                      {violations.map((violation) => (
                        <tr key={violation.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                          <td className="p-md text-on-surface-variant">{violation.id}</td>
                          <td className="p-md font-semibold">{violation.horse}</td>
                          <td className="p-md text-on-surface-variant">{violation.jockey}</td>
                          <td className="p-md">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${violation.typeClass}`}>
                              {violation.type}
                            </span>
                          </td>
                          <td className="p-md">{violation.time}</td>
                          <td className="p-md text-on-surface-variant truncate max-w-[200px]" title={violation.notes}>
                            {violation.notes}
                          </td>
                          <td className="p-md text-center">
                            <button
                              onClick={() => handleDelete(violation.id)}
                              className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-md hover:bg-error-container/50"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-md border-t border-[#E2E8F0] bg-[#F7F8FA] flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
                  <span>Showing {violations.length} of {violations.length} violations</span>
                  <div className="flex gap-1">
                    <button className="px-sm py-1 border border-outline-variant rounded bg-white hover:bg-surface-container text-on-surface transition-colors disabled:opacity-50" disabled>Prev</button>
                    <button className="px-sm py-1 border border-outline-variant rounded bg-white hover:bg-surface-container text-on-surface transition-colors disabled:opacity-50" disabled>Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViolationPage;
