import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { recognitionApi } from '../../lib/api';
import type { RecognitionHistory } from '../../lib/api';

export default function History() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [history, setHistory] = useState<RecognitionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await recognitionApi.getHistory();
      const historyArray = Array.isArray(data) ? data : [];
      setHistory(historyArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
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
                id="logout-btn"
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 id="history-title" className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Recognition History</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your past audio recognitions</p>
        </div>

        {loading ? (
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</div>
        ) : error ? (
          <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
            {error}
          </div>
        ) : history.length === 0 ? (
          <div id="no-history-message" className="text-center py-16">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No recognition history yet</p>
            <button
              onClick={() => navigate('/recognize')}
              className={`px-8 py-3 font-bold rounded-lg transition-all duration-200 ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              Start Recognizing
            </button>
          </div>
        ) : (
          <div id="history-list" className={`border rounded-2xl p-8 shadow-sm ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
            <table id="history-table" className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Song</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Confidence</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                </tr>
              </thead>
              <tbody>
                {(history || []).map((item) => (
                  <tr key={item.id} className={`border-b transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className={`py-4 px-4 font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                      {item.recognized ? item.song_name : 'Unknown'}
                    </td>
                    <td className={`py-4 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        {item.confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {item.recognized ? (
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          Recognized
                        </span>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          Not Recognized
                        </span>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/recognize')}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}
          >
            Recognize
          </button>
          <button
            onClick={() => navigate('/library')}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}
          >
            Library
          </button>
        </div>
      </div>
    </div>
  );
}
