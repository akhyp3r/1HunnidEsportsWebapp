import React from 'react';
import { Shield, Sparkles, Swords, Clock, CheckCircle2 } from 'lucide-react';

export default function BannerHero({ activePlayersCount, todayScrim, onQuickRsvp }) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#333538] bg-[#1e1f20] shadow-gemini-card mb-8">
      {/* Background Banner with cyber gradient overlay */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <img 
          src="/assets/banner.png" 
          alt="Apex Team Banner" 
          className="w-full h-full object-cover object-center filter brightness-95" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131314] via-[#131314]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#131314] via-transparent to-red-950/20"></div>
      </div>

      {/* Floating Hero Content */}
      <div className="relative px-6 md:px-8 pb-6 -mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="relative p-1 rounded-2xl bg-[#1e1f20] border-2 border-red-500/50 shadow-gemini-glow">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-contain bg-black/60 p-1"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                PRO ROSTER ACTIVE
              </span>
              <span className="text-xs text-[#8e918f] font-mono">
                TIER-1 OPS
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              APEX ESPORTS
            </h2>
            <p className="text-xs md:text-sm text-[#c4c7c5]">
              Match Strategy • Scrim Attendance • Roster Availability Hub
            </p>
          </div>
        </div>

        {/* Quick Hero Stat Chips */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="px-4 py-2 rounded-2xl bg-[#282a2c]/80 border border-[#333538] backdrop-blur-md flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <div>
              <div className="text-[10px] text-[#8e918f] uppercase font-semibold">Active Roster</div>
              <div className="text-sm font-bold text-white">{activePlayersCount} Players Ready</div>
            </div>
          </div>

          {todayScrim && (
            <div className="px-4 py-2 rounded-2xl bg-red-950/40 border border-red-500/40 backdrop-blur-md flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <div>
                <div className="text-[10px] text-red-300 uppercase font-semibold">Today's Scrim</div>
                <div className="text-sm font-bold text-white">{todayScrim.time} ({todayScrim.format})</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
