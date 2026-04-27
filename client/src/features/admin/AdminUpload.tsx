import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { libraryApi } from '../../lib/api';

export default function AdminUpload() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [songName, setSongName] = useState('');
  const [singerName, setSingerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!songName.trim()) {
      setError('Song name is required');
      return;
    }
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      await libraryApi.uploadSong(file, songName, singerName);
      setSuccess('Song uploaded and fingerprinted successfully!');
      setFile(null);
      setSongName('');
      setSingerName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user?.is_admin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <svg className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Access Denied</h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This page is for administrators only</p>
          <button
            onClick={() => navigate('/recognize')}
            className={`px-8 py-3 font-bold rounded-lg transition-all duration-200 ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            Go to Recognize
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Upload Song</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Add a new song to the fingerprint database</p>
        </div>

        <div className={`border rounded-2xl p-8 shadow-sm ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Song Name</label>
              <input
                type="text"
                id="song_name"
                required
                placeholder="Enter the song name"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                className={`w-full px-4 py-3.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-black transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-600' : 'bg-gray-50 border-gray-300 text-black focus:ring-black'}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Singer Name</label>
              <input
                type="text"
                id="singer_name"
                placeholder="Enter the singer name"
                value={singerName}
                onChange={(e) => setSingerName(e.target.value)}
                className={`w-full px-4 py-3.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-black transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-600' : 'bg-gray-50 border-gray-300 text-black focus:ring-black'}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Audio File</label>
              <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-900' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                <input
                  type="file"
                  accept=".mp3,.wav"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio_file"
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
              id="admin-upload-submit"
              disabled={!file || !songName || loading}
              className={`w-full py-4 px-4 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              {loading ? 'Uploading and Fingerprinting...' : 'Upload Song'}
            </button>
          </form>

          {error && (
            <div id="admin-upload-error" className={`mt-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {error}
            </div>
          )}

          {success && (
            <div id="admin-upload-success" className={`mt-6 p-4 rounded-xl text-sm ${isDark ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-600'}`}>
              {success}
            </div>
          )}
        </div>

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
