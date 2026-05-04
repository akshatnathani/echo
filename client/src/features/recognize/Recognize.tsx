import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { recognitionApi } from '../../lib/api';

export default function Recognize() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ song_name: string | null; confidence: number; recognized: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Client-side file validation
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3'];
      const validExtensions = ['.mp3', '.wav'];
      const maxSize = 16 * 1024 * 1024; // 16MB

      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

      if (!validExtensions.includes(fileExtension) && !validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload MP3 or WAV files only.');
        setFile(null);
        return;
      }

      if (selectedFile.size > maxSize) {
        setError('File size exceeds 16MB limit. Please upload a smaller file.');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setResult(null);
      setError('');
    }
  };

  const handleRecognize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const response = await recognitionApi.recognize(file);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recognition failed');
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
          <h1 id="recognize-title" className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Recognize Audio</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upload an audio file to identify the song instantly</p>
        </div>

        <div className={`border rounded-2xl p-8 shadow-sm ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <form onSubmit={handleRecognize} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Audio File</label>
              <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-900' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                <input
                  type="file"
                  id="audio_file"
                  accept=".mp3,.wav"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="audio_file"
                  className="cursor-pointer block"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <svg className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className={`font-medium text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>MP3 or WAV (max 16MB)</p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              id="recognize-submit"
              disabled={!file || loading}
              className={`w-full py-4 px-4 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              {loading ? 'Recognizing...' : 'Recognize Song'}
            </button>
          </form>

          {error && (
            <div className={`mt-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {error}
            </div>
          )}

          {result && (
            <div id="recognition-result" className={`mt-6 p-6 rounded-xl ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <h3 id="result-title" className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                {result.recognized ? 'Song Recognized!' : 'No Match Found'}
              </h3>
              {result.recognized ? (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Song</span>
                    <span id="song-name" className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>{result.song_name}</span>
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Confidence</span>
                    <span id="confidence-score" className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>{result.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              ) : (
                <p id="no-match-message" className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Could not identify the song. Try uploading a different audio file.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/library')}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}
          >
            Library
          </button>
          <button
            onClick={() => navigate('/history')}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}
          >
            History
          </button>
          {user?.is_admin && (
            <button
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
