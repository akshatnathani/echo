// src/features/map/Map.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { echoesApi, type Echo } from '@/lib/api';
import { authStorage } from '@/lib/auth';

const vibes = ['Dreamy', 'Ethereal', 'Dark', 'Cinematic', 'Lo-fi', 'Industrial'];

export default function Map() {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [loading, setLoading] = useState(true);
  const [bpmRange] = useState([85, 140]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Ethereal']);
  const [currentView, setCurrentView] = useState<'explorer' | 'library' | 'history'>('explorer');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadEchoes();
  }, []);

  const loadEchoes = async () => {
    try {
      const response = await echoesApi.getAll(100);
      setEchoes(response.echoes);
    } catch (error) {
      console.error('Failed to load echoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const handleLogout = () => {
    authStorage.clearAll();
    navigate('/login');
  };

  // Mock featured track (in production, this would come from the API)
  const featuredTrack = echoes.length > 0 ? echoes[0] : {
    trackName: 'Midnight Protocol',
    artist: 'Synthwave Collective',
    genre: 'Electronic',
    bpm: 128,
    city: 'Tokyo',
    country: 'Japan',
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.5),rgba(2,6,23,1))]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

       {/* Simplified Modern Header */}
       <header className="relative z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Sonic Map</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 translate-x-12">
            <Link to="/home" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Discover</Link>
            <Link to="/map" className="text-white font-medium text-sm border-b-2 border-indigo-500 pb-0.5">Sonic Map</Link>
            <Link to="/playlists" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Playlists</Link>
            <Link to="/ai-stories" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">AI Stories</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-800/50 rounded-full border border-transparent hover:border-slate-800 transition-all">
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {user?.fullName.charAt(0) || 'A'}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-300">{user?.fullName || 'User'}</span>
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-xl shadow-black/50 border border-slate-800 overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Modern Glass Sidebar */}
        <aside className="w-80 border-r border-slate-800/50 flex flex-col bg-slate-950/50 backdrop-blur-2xl">
          <div className="p-6 border-b border-slate-800/50">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Sonic Filters
             </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* View Selector */}
            <div className="space-y-1">
                {[
                    { id: 'explorer', label: 'Map Explorer', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { id: 'library', label: 'My Library', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                    { id: 'history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as 'explorer' | 'library' | 'history')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    currentView === item.id 
                        ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.label}
                </button>
                ))}
            </div>

            {/* BPM Range */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BPM Range</span>
                    <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded">{bpmRange[0]} - {bpmRange[1]}</span>
                </div>
                <div className="relative pt-2">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: '60%', marginLeft: '20%' }}></div>
                    </div>
                    {/* Visual only sliders for now */}
                    <input type="range" className="absolute top-0 w-full opacity-0 cursor-pointer" />
                </div>
            </div>

            {/* Vibe Tags */}
            <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-4">Vibe Tags</span>
                <div className="flex flex-wrap gap-2">
                {vibes.map((vibe) => (
                    <button
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selectedVibes.includes(vibe)
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-900/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                    >
                    {vibe}
                    </button>
                ))}
                </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-4 border border-indigo-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="relative flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm mb-1">AI Insight</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                        Exploration suggestion: The "Moon Noir" cluster in the upper right quadrant aligns with your listening history.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </aside>

        {/* Main Map View */}
        <main className="flex-1 relative bg-slate-950 flex flex-col">
           
           {/* Top Bar Overlay */}
           <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl pointer-events-auto">
                     <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Current Mood</span>
                     <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        HIGH ENERGY
                     </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl flex flex-col gap-1 p-1 pointer-events-auto">
                    {['qm', 'plus', 'minus', 'target'].map((icon, i) => (
                        <button key={i} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {icon === 'plus' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
                                {icon === 'minus' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />}
                                {icon === 'target' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                {icon === 'qm' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                             </svg>
                        </button>
                    ))}
                </div>
           </div>

           {/* The Map Surface */}
           <div className="flex-1 relative overflow-hidden">
                {/* Custom Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
                
                {/* Axis Lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-slate-800"></div>

                {/* Map Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {loading ? (
                         <div className="flex flex-col items-center gap-4">
                             <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-slate-400 font-medium">Calibrating sensors...</span>
                         </div>
                    ) : (
                        <div className="relative w-full h-full">
                            {/* Scattered Points */}
                            {[
                                { top: '25%', left: '35%', color: 'text-blue-500' },
                                { top: '45%', left: '65%', color: 'text-purple-500' },
                                { top: '65%', left: '45%', color: 'text-pink-500' },
                                { top: '35%', left: '75%', color: 'text-rose-500' },
                                { top: '55%', left: '25%', color: 'text-emerald-500' },
                            ].map((point, i) => (
                                <div key={i} className={`absolute ${point.color}`} style={{ top: point.top, left: point.left }}>
                                    <div className="w-2 h-2 bg-current rounded-full animate-pulse shadow-[0_0_10px_currentColor]"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-current rounded-full animate-ping opacity-50 duration-1000"></div>
                                </div>
                            ))}

                            {/* Center Active Node (Featured) */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="group bg-slate-900/90 backdrop-blur-xl rounded-2xl p-1 border border-slate-700/50 shadow-2xl transition-all hover:scale-105 duration-300 w-[340px]">
                                    <div className="p-5 flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/20 flex-shrink-0 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">93% Match</span>
                                            </div>
                                            <h3 className="font-bold text-white truncate">{featuredTrack.trackName}</h3>
                                            <p className="text-sm text-slate-400 truncate">{featuredTrack.artist}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Mini Visualizer */}
                                    <div className="h-10 flex items-end gap-0.5 px-6 opacity-30">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="flex-1 bg-indigo-400 rounded-t-sm"
                                                style={{ height: `${20 + Math.random() * 80}%` }}
                                            />
                                        ))}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="flex border-t border-slate-800/50 divide-x divide-slate-800/50">
                                        <button className="flex-1 py-3 text-xs font-semibold text-white hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 rounded-bl-2xl">
                                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                             Play
                                        </button>
                                        <button className="flex-1 py-3 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 rounded-br-2xl">
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                             Library
                                        </button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Axis Labels */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 uppercase tracking-widest">Energetic</div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 uppercase tracking-widest">Calm</div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 uppercase tracking-widest -rotate-90">Positive</div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 uppercase tracking-widest rotate-90">Melancholic</div>
           </div>
        </main>
      </div>
    </div>
  );
}
