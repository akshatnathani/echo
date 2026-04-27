import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate('/recognize');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-black' : 'bg-white'} p-4`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${isDark ? 'bg-white' : 'bg-black'}`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>SoundID</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Identify any song instantly</p>
        </div>

        {/* Form Card */}
        <div className={`border rounded-2xl p-8 shadow-sm ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Welcome back</h2>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to continue to SoundID</p>

          {error && (
            <div id="flash-message" className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
              <span className="flash-error">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-black transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' : 'bg-gray-50 border-gray-300 text-black focus:ring-black'}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-black transition-all duration-200 pr-12 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-gray-500' : 'bg-gray-50 border-gray-300 text-black focus:ring-black'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/register" id="register-link" className={`font-bold hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
                Sign up free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
