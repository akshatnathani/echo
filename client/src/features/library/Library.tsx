import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { libraryApi } from '../../lib/api';
import type { Song } from '../../lib/api';

export default function Library() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = (songs || []).filter(song =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs || []);
    }
  }, [searchQuery, songs]);

  const loadSongs = async () => {
    try {
      const data = await libraryApi.getSongs();
      const songsArray = Array.isArray(data) ? data : [];
      setSongs(songsArray);
      setFilteredSongs(songsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs');
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
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>SoundID</span>
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
          <h1 id="library-title" className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Song Library</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Browse the fingerprinted songs</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              id="song-search"
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 pl-12 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-black transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-600' : 'bg-gray-50 border-gray-300 text-black focus:ring-black'}`}
            />
            <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</div>
        ) : error ? (
          <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
            {error}
          </div>
        ) : filteredSongs.length === 0 ? (
          <div id="no-songs-message" className="text-center py-16">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No songs found matching your search' : 'No songs in the library yet'}
            </p>
            {user?.is_admin && !searchQuery && (
              <button
                onClick={() => navigate('/admin/upload')}
                className={`px-8 py-3 font-bold rounded-lg transition-all duration-200 ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
              >
                Upload First Song
              </button>
            )}
          </div>
        ) : (
          <div id="song-library" className={`border rounded-2xl p-8 shadow-sm ${isDark ? 'bg-black border-black' : 'bg-white border-gray-200'}`}>
            <ul id="song-list" className="space-y-4">
              {(filteredSongs || []).map((song) => (
                <li key={song.id} className={`flex items-center justify-between p-5 rounded-lg border transition-all duration-200 ${isDark ? 'bg-black border-black hover:border-black' : 'bg-gray-50 border-gray-200 hover:border-black'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
                      <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>{song.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {song.singer_name && <span>by {song.singer_name}</span>}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
            onClick={() => navigate('/history')}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}
          >
            History
          </button>
          {user?.is_admin && (
            <button
              id="upload-song-btn"
              onClick={() => navigate('/admin/upload')}
              className={`px-6 py-3 font-bold rounded-lg transition-all duration-200 ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              Upload Song
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
