import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authStorage } from '@/lib/auth';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  readTime: string;
  tags: string[];
}

export default function AIStories() {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [activeTab, setActiveTab] = useState('trending');
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

  const stories: Story[] = [
    {
      id: '1',
      title: 'The Sound of Neon Rain',
      excerpt: 'In a cyberpunk Tokyo, a sound engineer discovers a frequency that can unlock memories trapped in the neon lights.',
      coverImage: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      author: 'Echo AI',
      readTime: '5 min read',
      tags: ['Sci-Fi', 'Cyberpunk', 'Mystery']
    },
    {
      id: '2',
      title: 'Rhythms of the Deep',
      excerpt: 'A marine biologist finds a pattern in whale songs that resembles an ancient underwater civilization\'s lost anthem.',
      coverImage: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      author: 'Echo AI',
      readTime: '8 min read',
      tags: ['Adventure', 'Nature', 'Discovery']
    },
    {
      id: '3',
      title: 'Echoes of a Forgotten City',
      excerpt: 'An urban explorer records ambient noise in abandoned places, only to hear the voices of the past telling their stories.',
      coverImage: 'bg-gradient-to-br from-amber-500 to-orange-600',
      author: 'Echo AI',
      readTime: '6 min read',
      tags: ['History', 'Supernatural', 'Drama']
    }
  ];

  const handleLogout = () => {
    authStorage.clearAll();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/20">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Echoic</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Discover</Link>
            <Link to="/map" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Sonic Map</Link>
            <Link to="/playlists" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">Playlists</Link>
            <Link to="/ai-stories" className="text-purple-400 font-medium">AI Stories</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1.5 hover:bg-slate-800 rounded-lg transition-colors duration-200">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold shadow-md shadow-purple-600/10">
                  {user?.fullName.charAt(0) || 'A'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-200">{user?.fullName || 'Alex'}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-xl">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-slate-700/50 text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AI Generated Stories
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Immerse yourself in unique narratives crafted by Echo AI, inspired by the sounds of the world around you.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-600/25 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Story
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 border-b border-slate-800 mb-8 overflow-x-auto pb-1">
          {['trending', 'latest', 'cyberpunk', 'nature', 'lo-fi'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 relative whitespace-nowrap ${
                activeTab === tab
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div 
              key={story.id}
              className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              <div className={`h-48 ${story.coverImage} relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                  {story.readTime}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {story.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-slate-700/50 text-purple-300 border border-purple-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-200">
                  {story.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {story.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                      AI
                    </div>
                    {story.author}
                  </div>
                  
                  <button className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 group/btn">
                    Read Story
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
