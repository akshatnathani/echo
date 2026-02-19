// src/features/identify/Home.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { identifyApi, type Track } from '@/lib/api';
import { authStorage } from '@/lib/auth';

export default function Home() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [identifiedTrack, setIdentifiedTrack] = useState<Track | null>(null);
  const [error, setError] = useState('');
  const user = authStorage.getUser();
  const abortControllerRef = useRef<AbortController | null>(null);
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

  const trendingEchoes = [
    { location: 'Tokyo, JP', count: 1234, coords: [35.6762, 139.6503] },
    { location: 'New York, US', count: 987, coords: [40.7128, -74.0060] },
    { location: 'London, UK', count: 856, coords: [51.5074, -0.1278] },
  ];

  const handleListen = async () => {
    if (listening) {
        abortControllerRef.current?.abort();
        setListening(false);
        return;
    }

    setListening(true);
    setError('');
    setIdentifiedTrack(null);
    
    // Create new abort controller for this session
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Simulate capturing audio with abort capability
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 2000);
        controller.signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new DOMException('Aborted', 'AbortError'));
        });
      });

      // Double check before API call
      if (controller.signal.aborted) return;

      // Get user location (in production, use actual geolocation)
      const location = {
        latitude: 40.7128,
        longitude: -74.0060,
        city: 'New York',
        country: 'United States'
      };

      // Call identify API
      const response = await identifyApi.identify(
        'mock_audio_data',
        location
      );

      // Only set result if not aborted
      if (!controller.signal.aborted) {
         setIdentifiedTrack(response.track);
         setListening(false); // Natural finish
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
          // User manually stopped listening, do nothing (state is already handled)
          return;
      }
      setError(err instanceof Error ? err.message : 'Failed to identify music');
      setListening(false);
    } 
  };

  const handleLogout = () => {
    authStorage.clearAll();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
        
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      <header className="z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Echoic</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-white font-medium text-sm">Discover</Link>
            <Link to="/map" className="text-slate-400 hover:text-white transition-colors text-sm">Sonic Map</Link>
            <Link to="/playlists" className="text-slate-400 hover:text-white transition-colors text-sm">Playlists</Link>
            <Link to="/ai-stories" className="text-slate-400 hover:text-white transition-colors text-sm">AI Stories</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </button>
            <div className="h-4 w-px bg-slate-800" />
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
 
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Main Hero Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Identify the music <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">around you.</span>
          </h1>
          <p className="text-lg text-slate-400">
            Tap the button below to instantly recognize songs, discover lyrics, and add them to your library.
          </p>
        </div>

        {/* The Listening Button - Centerpiece */}
        <div className="relative mb-20 group">
          {/* Animated rings when listening */}
          {listening && (
             <>
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
                <div className="absolute inset-[-20px] rounded-full border border-indigo-500/20 animate-pulse" />
                <div className="absolute inset-[-40px] rounded-full border border-indigo-500/10 animate-pulse" style={{ animationDelay: '0.2s' }} />
             </>
          )}

          <button
            onClick={handleListen}
            className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                listening 
                ? 'bg-indigo-600 scale-105 shadow-[0_0_60px_-10px_rgba(79,70,229,0.5)]' 
                : 'bg-slate-900 border-2 border-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] hover:scale-105'
            }`}
          >
            <div className={`transition-transform duration-500 ${listening ? 'scale-110' : ''}`}>
                {listening ? (
                    <div className="flex gap-1 items-end h-12 mb-2">
                         <div className="w-1.5 bg-white h-4 animate-[music-bar_0.8s_ease-in-out_infinite]" />
                         <div className="w-1.5 bg-white h-8 animate-[music-bar_0.6s_ease-in-out_infinite_0.1s]" />
                         <div className="w-1.5 bg-white h-12 animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]" />
                         <div className="w-1.5 bg-white h-6 animate-[music-bar_0.7s_ease-in-out_infinite_0.3s]" />
                         <div className="w-1.5 bg-white h-10 animate-[music-bar_0.9s_ease-in-out_infinite_0.4s]" />
                    </div>
                ) : (
                    <svg className="w-16 h-16 md:w-20 md:h-20 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )}
            </div>
            <span className={`text-sm font-semibold tracking-widest uppercase ${listening ? 'text-indigo-100' : 'text-slate-400 group-hover:text-white'}`}>
                {listening ? 'Listening...' : 'Tap to Listen'}
            </span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-slide-up">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results Card */}
        {identifiedTrack && (
          <div className="w-full max-w-2xl mb-20 animate-slide-up">
            <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-1 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 relative z-10">
                {/* Album Art Placeholder */}
                <div className="w-full md:w-48 aspect-square rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center flex-shrink-0 group">
                    <svg className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {identifiedTrack.matchPercentage}% Match
                        </span>
                        {identifiedTrack.genre && (
                            <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                                {identifiedTrack.genre}
                            </span>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-1 leading-tight">{identifiedTrack.name}</h2>
                    <p className="text-lg text-slate-400 mb-6 font-medium">{identifiedTrack.artist}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {identifiedTrack.album && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                {identifiedTrack.album}
                            </div>
                        )}
                        {identifiedTrack.bpm && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {identifiedTrack.bpm} BPM
                            </div>
                        )}
                    </div>
                
                    <div className="flex gap-3 mt-auto">
                        <button className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                             </svg>
                             Play Preview
                        </button>
                        <button className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 transition-all hover:bg-slate-700/80 flex items-center justify-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                             </svg>
                             Add to Library
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Activity Section */}
        <div className="w-full max-w-4xl">
           <div className="flex items-center justify-between mb-8 px-2">
               <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Live Global Echoes</h2>
                    <p className="text-slate-400 text-sm">Real-time identifications happening worldwide</p>
               </div>
               <Link to="/map" className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2">
                    Explore Map
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
               </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 rounded-3xl p-6 border border-slate-800/50 backdrop-blur-sm">
                
                {/* Mini Map Visualization */}
                <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group">
                     <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                     
                     {/* Simplified World Geometry */}
                     <svg className="absolute inset-0 w-full h-full text-slate-800/50" fill="currentColor" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <path d="M20,15 Q35,8 50,15 T80,15 T100,20 L100,50 L0,50 L0,20 Q10,25 20,15" />
                     </svg>
                     
                     {/* Ping Animations */}
                     <div className="absolute top-1/3 left-1/4">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-indigo-500 rounded-full relative" />
                     </div>
                     <div className="absolute bottom-1/3 right-1/3 animation-delay-500">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping absolute" style={{ animationDelay: '0.5s' }} />
                        <div className="w-3 h-3 bg-purple-500 rounded-full relative" />
                     </div>
                     
                     <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse" />
                        324 active listeners
                     </div>
                </div>

                {/* Trending List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Trending Locations</h3>
                    {trendingEchoes.map((echo, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 border border-slate-800/50 transition-colors group">
                           <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                    i === 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                                    i === 1 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' : 
                                    'bg-orange-700/10 text-orange-700 border border-orange-700/20'
                                }`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-200">{echo.location}</div>
                                    <div className="text-xs text-slate-500">Live activity</div>
                                </div>
                           </div>
                           <div className="text-indigo-400 font-mono font-medium bg-indigo-500/5 px-2 py-1 rounded text-sm group-hover:bg-indigo-500/10 transition-colors">
                                {echo.count.toLocaleString()}
                           </div>
                        </div>
                    ))}
                    <button className="w-full py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors border-t border-slate-800/50 mt-2">
                        View Global Leaderboard
                    </button>
                </div>
           </div>
        </div>

      </main>
    </div>
  );
}
