import React, { useState, useEffect } from 'react';

// --- INTERFACES & TYPES ---
interface JockeyOffer {
  id: string;
  name: string;
  avatar: string;
  horseAssigned: string;
  offeredFee: number;
  winBonus: number;
  status: 'Pending' | 'Accepted' | 'Declined';
}

interface RaceDeadline {
  id: string;
  day: string;
  month: string;
  title: string;
  subtitle: string;
  progress: number; // Percentage 0-100
  isUrgent?: boolean;
}

interface LiveOdds {
  horseName: string;
  odds: string;
}

export default function OwnerDashboard() {
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState<string>('08 Oct 2023');
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  // Giả lập dữ liệu từ API để component sạch sẽ, dễ bảo trì
  const [jockeyOffers] = useState<JockeyOffer[]>([
    {
      id: '1',
      name: 'Marcus Thorne',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIHujfaUcya5fNouDiaYLWPNGtGg4IynyG3ss5WL5XcXRqpUQjA7iBZPrU-fAJbWstb8a7WBtZTYqwMB6kM95HOeRb6c0wXpAyjbxsEOkxfbVkssJVGcByqpPlx785qBZlvIlc8wB18E0zAlf9OsHouX8ahsxpybKWppZ75226nM03NZep9wzw4y6S0Bf0rGukXbjd9gWC-dnCmBjmA9hasN12RsFcWOfzzv9jhtarVYP_wsv4qKMA41gmzVj3ruxx1MBQ1NGUZQ',
      horseAssigned: 'Midnight Shadow',
      offeredFee: 12500,
      winBonus: 5,
      status: 'Pending'
    },
    {
      id: '2',
      name: 'Elena Rodriguez',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3lfbxbmlHUhWFcq10mNZUspcTG_6IxTDUgYna7IuFHjlQIrKUiGdHQ0UVK2Whj9cOMx8Dbvm46vUYvzeooLO44nSkYPL2sn2Y_f0y5h-0acriJ4Y7zayBnJ7W0HVUZBFP1PtBVWXueIrZMqRGeaYmap8q9Hms7I83-XhWABRaGgjFT2Z-mYcgLuUB4vzW5rnsR_9B66teKxeK0px2bSO-HfKXB9Q2ghy8A4bpWC7F-UTBBWT-i7gLbd2eXmsmA6C_iDEcbIfy0w',
      horseAssigned: 'Golden Gale',
      offeredFee: 15000,
      winBonus: 8,
      status: 'Accepted'
    },
    {
      id: '3',
      name: 'Julian Vane',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvWnZVFqsFw5YWhmBA_kGRy4jqgvBWBSCUs-_OHJzm9RiFyVuQXYEednJMRmOReqPd-meRQV213h-UAuO43y39VBDCk9isi4fUIR7HxBEbT_OGlN9wNddOg4NrWFKVOUayqNNMOXbxcqU6QxBdAWmMksEnohJGsGNSqHGvADJ0XWH6SIa3NwBbF_MAn2rhI4qWYRua_PcomwQwBDukiIPs7-rFgwMIRMm5tHLtfQx2L0245gvov2ow-VI8HalgA9ibhgkCXYeS9g',
      horseAssigned: 'Royal Crest',
      offeredFee: 9800,
      winBonus: 3,
      status: 'Pending'
    },
    {
      id: '4',
      name: 'Sarah Jenkins',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAme4wdovjXAk03HmGlp9OZ5hj9U-wIUSbvnV1eI3d4Jm0HqXQUfe6s79a2mixZltK204_QSNXdf_PdxBcZseAW4sSCNYusV90m_nSaUVqYFXX_aiy9i81rzNeEstOBi0VHS08zf6yYW8I9Hp1f5A-kcQiozhdGpkReF9hxuUQbOEG_5QfFnFtyeawBEhDn8wwudmMJA9VfqJN0xwSMD67DBct6de5lU1lp951XXR4FlKD8j3gcv-bNUDs1933Yb6PUJJZnmdByfQ',
      horseAssigned: 'Wild Ember',
      offeredFee: 11200,
      winBonus: 5,
      status: 'Accepted'
    }
  ]);

  const [raceDeadlines] = useState<RaceDeadline[]>([
    { id: '1', day: '12', month: 'Oct', title: 'Royal Ascot Qualifiers', subtitle: 'Entry closes in 4h 22m', progress: 85, isUrgent: true },
    { id: '2', day: '15', month: 'Oct', title: 'The Derby Sprint', subtitle: 'Early bird fee available', progress: 40 },
    { id: '3', day: '22', month: 'Oct', title: 'Westminster Stakes', subtitle: 'Pre-registration open', progress: 10 }
  ]);

  const [liveOdds] = useState<LiveOdds[]>([
    { horseName: 'Midnight Shadow', odds: '4/1' },
    { horseName: 'Golden Gale', odds: '7/2' },
    { horseName: 'Royal Crest', odds: '12/1' }
  ]);

  // --- EFFECTS ---
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-GB', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- HELPER RENDERS ---
  const navItems = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Races', icon: 'sports_score' },
    { name: 'Stables', icon: 'table' },
    { name: 'Health & Safety', icon: 'health_and_safety' },
    { name: 'Analytics', icon: 'analytics' },
    { name: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-['Inter']">
      
      {/* --- SIDEBAR COMPONENT --- */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#002a15] dark:bg-[#004225] flex flex-col py-4 px-2 shadow-md z-50">
        <div className="mb-10 px-4">
          <h1 className="font-['Oswald'] text-2xl text-[#fed65b] tracking-wider uppercase">STABLE MANAGEMENT</h1>
          <p className="text-xs text-white/60 mt-1">Elite Tier Admin</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-[#735c00] text-white active:scale-95'
                    : 'text-white hover:bg-[#98d4ac]/10 hover:text-[#ffe088]'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 flex flex-col gap-4">
          <button className="w-full bg-[#735c00] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-md text-sm">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Start New Race</span>
          </button>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#eceef0] overflow-hidden">
              <img 
                alt="User profile photo" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXt05Lfdp6apuSzK7KNN0DXbdjv7jVR4Ut-dkEttq3DgQFroLOZbwGvwvYrD0bg4OsZYposbRaz6y2gNso0XLuCkgCnefpOA_urt6umiSmGvMBTbUplebbgQGbScgpqbev65bUR58VpNMmDwIxfZbbTYU_tKH8xAzHgx-utE36F_3Ye6amHT7wKl5oC_bqRQFtkuz2QY0QQTaTgu6h-pz7_GODWcLI1VZQ8eEPRCZULd244o9mcgAXqsAJGOobPz_xEaLcNIf1NQ"
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white text-sm truncate">Lord Kensington</p>
              <p className="text-[10px] text-white/50 uppercase tracking-tighter">Verified Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- HEADER COMPONENT --- */}
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-16rem)] bg-[#f7f9fb] dark:bg-[#d8dadc] flex justify-between items-center px-4 z-40 border-b border-[#c0c9c0]">
        <div className="flex items-center gap-6">
          <h2 className="font-['Oswald'] text-2xl font-medium text-[#002a15] dark:text-[#98d4ac]">Championship Manager</h2>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#404942] text-[20px]">search</span>
            <input 
              className="pl-10 pr-4 py-1.5 bg-[#f2f4f6] border-none rounded-full w-64 text-sm focus:ring-2 focus:ring-[#735c00]/50 outline-none" 
              placeholder="Search horses, jockeys..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[#404942]">
            <button className="hover:text-[#002a15] transition-colors cursor-pointer relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f7f9fb]"></span>
            </button>
            <button className="hover:text-[#002a15] transition-colors cursor-pointer">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-[#c0c9c0] mx-2"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#191c1e] text-right hidden sm:block">
              <div className="font-bold">{currentDate}</div>
              <div className="text-[10px] text-[#404942]">Next Race: 14:00</div>
            </span>
            <img 
              alt="Administrator avatar" 
              className="w-8 h-8 rounded-full bg-[#fed65b] p-0.5" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEqt_DcOHBNWQamd_6qcx18CNN4bXhuh4IkpSWgb-jw6H2EYa_4LUvJk9rOxx3Sn_CMYlLJtr0ENWKpW1-yNrD857eyXO07gu7dDIE0k6RKfMCLN3bJlcQsrUTRm2IFGEdYoqeEwCS-N9vFo-onqteNId5AvC3B_FZxEi5ZMLcKsU7VCh9lpuKxXyzgFBLbER5sEKh1IzRa0j8I7lJ4HiOYN1h1-4DBZnA4oZ99tK-TwwOmOv9z6ItJqYaO-zCohbf_Xv5EBlwDw"
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT CANVAS --- */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
          
          {/* Page Header */}
          <section className="mb-4 flex justify-between items-end">
            <div>
              <h1 className="font-['Oswald'] text-3xl font-semibold text-[#002a15]">Stable Overview</h1>
              <p className="text-sm text-[#404942]">Managing assets for Kensington Thoroughbreds</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#002a15] text-[#002a15] font-semibold text-sm rounded-lg hover:bg-[#002a15]/5 transition-colors">Generate Report</button>
              <button className="px-4 py-2 bg-[#735c00] text-white font-semibold text-sm rounded-lg hover:opacity-90 shadow-md">View Live Odds</button>
            </div>
          </section>

          {/* Metric Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(71,85,105,0.1)] border border-[#c0c9c0]/30 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <p className="text-xs text-[#404942] uppercase tracking-widest mb-1">Total Horses</p>
                <h3 className="font-['Oswald'] text-5xl font-bold text-[#002a15]">24</h3>
                <p className="text-[12px] text-[#98d4ac] font-bold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +2 this month
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#002a15]/5 flex items-center justify-center text-[#002a15] group-hover:bg-[#002a15] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">pets</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(71,85,105,0.1)] border border-[#c0c9c0]/30 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <p className="text-xs text-[#404942] uppercase tracking-widest mb-1">Horses in Training</p>
                <h3 className="font-['Oswald'] text-5xl font-bold text-[#002a15]">18</h3>
                <p className="text-[12px] text-[#404942] font-medium mt-1 italic">75% Capacity</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#002a15]/5 flex items-center justify-center text-[#002a15] group-hover:bg-[#002a15] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">fitness_center</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(71,85,105,0.1)] border border-[#c0c9c0]/30 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <p className="text-xs text-[#404942] uppercase tracking-widest mb-1">Active Contracts</p>
                <h3 className="font-['Oswald'] text-5xl font-bold text-[#002a15]">12</h3>
                <p className="text-[12px] text-[#735c00] font-bold mt-1">4 Pending Offers</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#002a15]/5 flex items-center justify-center text-[#002a15] group-hover:bg-[#002a15] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[32px]">contract_edit</span>
              </div>
            </div>
          </section>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Left Box: Jockey Hiring Status Table */}
            <div className="col-span-12 xl:col-span-8 bg-white rounded-xl shadow-[0px_4px_12px_rgba(71,85,105,0.1)] border border-[#c0c9c0]/30 overflow-hidden">
              <div className="px-4 py-4 border-b border-[#c0c9c0]/30 flex justify-between items-center bg-[#002a15] text-white">
                <h3 className="font-['Oswald'] text-2xl font-medium">Current Jockey Hiring Status</h3>
                <button className="text-xs text-[#fed65b] hover:underline transition-all">Manage All Offers</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#004225] text-white text-sm font-semibold">
                    <tr>
                      <th className="px-4 py-3">Jockey Name</th>
                      <th className="px-4 py-3">Horse Assigned</th>
                      <th className="px-4 py-3">Offered Fee</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#c0c9c0]/20">
                    {jockeyOffers.map((jockey, index) => (
                      <tr key={jockey.id} className={index % 2 === 1 ? 'bg-[#f8fafc]' : ''}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e6e8ea] overflow-hidden">
                              <img alt={jockey.name} className="w-full h-full object-cover" src={jockey.avatar} />
                            </div>
                            <span className="font-semibold">{jockey.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">{jockey.horseAssigned}</td>
                        <td className="px-4 py-4 font-semibold text-[#735c00]">
                          £{jockey.offeredFee.toLocaleString()} <span className="text-[10px] text-[#404942]">+{jockey.winBonus}% Win</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                            jockey.status === 'Accepted' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-[#fed65b]/20 text-[#574500]'
                          }`}>
                            {jockey.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="material-symbols-outlined text-[#404942] hover:text-[#002a15] transition-colors">more_horiz</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Box: Widgets */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
              
              {/* Race Deadlines */}
              <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(71,85,105,0.1)] border border-[#c0c9c0]/30 overflow-hidden">
                <div className="px-4 py-4 border-b border-[#c0c9c0]/30 flex items-center justify-between bg-[#735c00] text-white">
                  <h3 className="font-['Oswald'] text-2xl font-medium">Race Deadlines</h3>
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {raceDeadlines.map((race) => (
                    <div 
                      key={race.id} 
                      className={`p-3 bg-[#f2f4f6] rounded-lg flex gap-4 border-l-4 ${
                        race.isUrgent ? 'border-[#D4AF37]' : 'border-[#c0c9c0]'
                      }`}
                    >
                      <div className="bg-[#002a15] text-white rounded px-2 py-1 flex flex-col items-center justify-center min-w-[50px]">
                        <span className="font-['Oswald'] text-2xl font-medium leading-none">{race.day}</span>
                        <span className="text-[10px] uppercase font-bold">{race.month}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-[#002a15]">{race.title}</h4>
                        <p className="text-xs text-[#404942]">
                          {race.isUrgent ? (
                            <>Entry closes in <span className="text-[#ba1a1a] font-bold">{race.subtitle.replace('Entry closes in ', '')}</span></>
                          ) : (
                            race.subtitle
                          )}
                        </p>
                        <div className="w-full bg-[#c0c9c0]/30 h-1 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full ${race.isUrgent ? 'bg-[#735c00]' : 'bg-[#002a15]'}`} 
                            style={{ width: `${race.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full py-3 bg-[#002a15] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                    <span>Register Entry</span>
                  </button>
                </div>
              </div>

              {/* Market Odds Widget */}
              <div 
                className="bg-[#002a15] text-white rounded-xl shadow-lg overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #002a15 0%, #004225 100%)' }}
              >
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                ></div>
                <div className="p-4 relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-['Oswald'] text-2xl font-medium text-[#fed65b]">Live Odds</h3>
                    <span className="bg-[#ba1a1a] text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">LIVE</span>
                  </div>
                  <div className="space-y-3">
                    {liveOdds.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center text-sm ${
                          idx !== liveOdds.length - 1 ? 'border-b border-white/10 pb-2' : ''
                        }`}
                      >
                        <span>{item.horseName}</span>
                        <span className="font-bold text-[#fed65b]">{item.odds}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Health & Safety Spotlight */}
          <section className="mt-12">
            <div className="bg-white rounded-xl shadow-lg border border-[#c0c9c0]/30 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt="A majestic thoroughbred horse standing in a sunlit wooden stable"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWsBx_wPW2QZj4FzYMwKTk0jmzckYTQhiI9VIeQeEUgexPBUu6jZA_tA25EMrjrF44HJGr3ZC95Sc681tZm0l7FhW6uI-n_hLjRdcgLL7oPu9-W0KzCG50AmHN08HbHdRm0fkOHoBPyPgU17LnbSmeDN0-6ZkkP4E9cGWNKNnLGLgkzoXzEif3reoIfBNCmgvW_yO-TFOFq2NdQNTP5riCPlwGj-AOhB0In2Qh55X7u0F9Qx-WPQ6NIOg2XtMQZLcUGMVxBj2IRw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-bold">HEALTH CERTIFIED</span>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-['Oswald'] text-3xl font-semibold text-[#002a15]">Stable Health Spotlight</h3>
                    <p className="text-[#404942] text-sm">Bi-weekly veterinary inspection summary for Kensington Main Stables.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block text-[#191c1e]">Next Visit:</span>
                    <span className="font-['Oswald'] text-2xl font-medium text-[#735c00]">Oct 14, 2023</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#f2f4f6] p-3 rounded-lg border-l-4 border-green-500">
                    <div className="text-[12px] uppercase font-bold text-[#404942]">Condition</div>
                    <div className="font-semibold text-sm">Excellent</div>
                  </div>
                  <div className="bg-[#f2f4f6] p-3 rounded-lg border-l-4 border-[#735c00]">
                    <div className="text-[12px] uppercase font-bold text-[#404942]">Vaccinations</div>
                    <div className="font-semibold text-sm">Up to Date</div>
                  </div>
                  <div className="bg-[#f2f4f6] p-3 rounded-lg border-l-4 border-[#002a15]">
                    <div className="text-[12px] uppercase font-bold text-[#404942]">Stamina Rating</div>
                    <div className="font-semibold text-sm">92% Average</div>
                  </div>
                </div>

                <button className="font-semibold text-sm text-[#002a15] flex items-center gap-1 group">
                  <span>Full Health Audit Report</span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}