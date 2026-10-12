import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      setLoading(true);
      setError('');
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#131314] flex flex-col justify-center items-center p-4 relative">
      {/* Sleek Minimalist Login Container */}
      <div className="w-full max-w-sm rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-7 md:p-8 shadow-xl animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img 
            src="/assets/logo.png" 
            alt="One Hunnid Esports" 
            className="w-14 h-14 mx-auto object-contain mb-3 drop-shadow-md" 
          />
          <h1 className="text-lg font-bold tracking-wider text-white uppercase">
            One Hunnid Esports
          </h1>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Operations & Scrim Hub
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-[#2b181a] border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#c4c7c5] mb-1.5">
              Username ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter login ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-colors"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c4c7c5] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Minimal admin quick access button */}
        <div className="mt-6 pt-4 border-t border-[#2e3032] flex items-center justify-between text-[11px] text-[#9a9c9e]">
          <span>Admin account:</span>
          <button
            type="button"
            onClick={handleAdminQuickFill}
            className="text-zinc-300 hover:text-white underline font-mono"
          >
            admin / admin123
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-[11px] text-zinc-600">
        One Hunnid Esports • Tactical Operations Hub
      </div>
    </div>
  );
}
