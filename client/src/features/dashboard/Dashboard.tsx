import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { libraryApi, recognitionApi } from '../../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    totalSongs: 0,
    fingerprintedSongs: 0,
    totalRecognitions: 0,
    recentRecognitions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [songs, history] = await Promise.all([
        libraryApi.getSongs(),
        recognitionApi.getHistory(),
      ]);

      const totalSongs = Array.isArray(songs) ? songs.length : 0;
      const fingerprintedSongs = Array.isArray(songs) ? songs.filter((s: any) => s.fingerprinted).length : 0;
      const totalRecognitions = Array.isArray(history) ? history.length : 0;
      const recentRecognitions = Array.isArray(history)
        ? history.filter((h: any) => {
          const date = new Date(h.timestamp);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        }).length
        : 0;

      setStats({
        totalSongs,
        fingerprintedSongs,
        totalRecognitions,
        recentRecognitions,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white' : 'bg-black'}`}>
                <svg className={`w-6 h-6 ${isDark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Echo</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user?.username}</span>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Dashboard</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Overview of your Echo system</p>
        </div>

        {loading ? (
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading statistics...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className={`border rounded-2xl p-6 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Songs</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.totalSongs}</p>
              </div>

              <div className={`border rounded-2xl p-6 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fingerprinted</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.fingerprintedSongs}</p>
              </div>

              <div className={`border rounded-2xl p-6 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Recognitions</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.totalRecognitions}</p>
              </div>

              <div className={`border rounded-2xl p-6 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Recent (7 days)</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.recentRecognitions}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`border rounded-2xl p-8 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/recognize')}
                  className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${isDark ? 'bg-gray-700 border-gray-600 hover:border-gray-400' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                >
                  <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Recognize</span>
                </button>

                <button
                  onClick={() => navigate('/library')}
                  className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${isDark ? 'bg-gray-700 border-gray-600 hover:border-gray-400' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                >
                  <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Library</span>
                </button>

                <button
                  onClick={() => navigate('/history')}
                  className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${isDark ? 'bg-gray-700 border-gray-600 hover:border-gray-400' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                >
                  <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>History</span>
                </button>

                {user?.is_admin && (
                  <button
                    onClick={() => navigate('/admin/upload')}
                    className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${isDark ? 'bg-gray-700 border-gray-600 hover:border-gray-400' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                  >
                    <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Upload Song</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
