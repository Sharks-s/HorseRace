import React from 'react';

const AdBanners = () => {
  return (
    <aside className="flex flex-col gap-6 w-full">
      {/* Banner 1: VIP Lounge Promo */}
      <div className="bg-gradient-to-br from-[#121b2e] to-[#1e293b] text-white p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        </div>
        <div className="relative z-10">
          <span className="px-2 py-0.5 rounded bg-[#009488] text-white text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">PROMOTION</span>
          <h3 className="text-xl font-bold tracking-tight mb-2">VIP Race Insights</h3>
          <p className="text-sm text-[#7c839b] leading-relaxed">Access expert analysis, track conditions, and historical winner data to elevate your race knowledge.</p>
        </div>
        <button type="button" className="w-full mt-6 bg-[#009488] hover:bg-[#007c72] text-white font-semibold py-2 rounded-lg text-sm transition-colors shadow-sm">
          Upgrade to VIP
        </button>
      </div>

      {/* Banner 2: Advertisement Placeholder */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-[0_2px_4px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[200px] relative overflow-hidden">
        <div>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">ADVERTISEMENT</span>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Grand Horse Derby 2026</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Get tickets for the championship finals live in Ascot. VIP Packages and trackside seats available now.</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-teal-600">Ascot Derby Tickets</span>
          <a href="https://ascot.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-0.5">
            Buy Now
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default AdBanners;
