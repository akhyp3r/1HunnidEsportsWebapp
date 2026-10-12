import React from 'react';
import { Bell, Sparkles, Volume2, VolumeX, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ todayScrim, onOpenProfile, soundEnabled, setSoundEnabled }) {
  const { user, isManager } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#131314]/90 backdrop-blur-md border-b border-[#333538] px-6 py-3.5 flex items-center justify-between">
      {/* Left: Brand & Scrim Live Ping */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/assets/logo.png" 
              alt="Team Logo" 
              className="w-8 h-8 object-contain"
            />
            {todayScrim && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-white flex items-center gap-2">
              APEX ESPORTS
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1f20] text-[#c4c7c5] border border-[#333538] font-normal">
                Scrim Ops
              </span>
            </h1>
          </div>
        </div>

        {/* Live Scrim pill */}
        {todayScrim && (
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/40 text-red-200 text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-semibold">Scrim Today @ {todayScrim.time}</span>
            <span className="text-red-400 font-mono">({todayScrim.timezone})</span>
            <span className="text-zinc-400">vs {todayScrim.opponent}</span>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Sound alert toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition-colors"
          title={soundEnabled ? "Scrim audio chime active" : "Scrim audio chime muted"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* User Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333538] text-xs font-medium text-white transition-all shadow-sm"
        >
          <img
            src={user?.avatar || '/assets/logo.png'}
            alt={user?.ign}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-semibold text-zinc-200">{user?.ign || user?.name}</span>
          {isManager && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
              COACH
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
