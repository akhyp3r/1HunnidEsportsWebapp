import React from 'react';
import { Swords, Users, CalendarClock, Plus, ArrowRight, Shield, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatScrimTime } from '../../utils/time';

export default function AdminDashboardView({
  scrims,
  players,
  announcements,
  onOpenNewScrim,
  onOpenNewPlayer,
  setCurrentTab
}) {
  const { user } = useAuth();
  const todayScrim = scrims.find(s => s.isToday && s.status === 'upcoming');
  const activePlayers = players.filter(p => p.role === 'player' && p.status === 'active');
  const upcomingScrims = scrims.filter(s => s.status === 'upcoming');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-[#2e3032] bg-[#1c1d1e] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/logo.png" 
              alt="One Hunnid Esports" 
              className="w-16 h-16 object-contain rounded-2xl bg-[#131314] p-2 border border-[#2e3032]" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                  ADMIN CONSOLE
                </span>
                <span className="text-xs text-zinc-500 font-mono">ONE HUNNID ESPORTS</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Welcome back, {user?.ign || 'Director'}
              </h2>
              <p className="text-xs text-[#9a9c9e] mt-0.5">
                Manage your roster credentials, scrim schedules, and player attendance.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onOpenNewPlayer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#262729] hover:bg-[#313235] text-white text-xs font-semibold border border-[#3e4043] transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span>+ Create Player Login</span>
            </button>

            <button
              onClick={onOpenNewScrim}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Announce Scrim</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setCurrentTab('roster')}
          className="p-5 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9a9c9e]">
            <span>Active Players</span>
            <Users className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {activePlayers.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {activePlayers.length === 0 ? 'No players created yet' : 'Players on roster'}
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('scrims')}
          className="p-5 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9a9c9e]">
            <span>Upcoming Scrims</span>
            <Swords className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {upcomingScrims.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {todayScrim 
              ? `Match today @ ${formatScrimTime(todayScrim).localTime12h} (${formatScrimTime(todayScrim).deviceTz})` 
              : 'No matches today'}
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('availability')}
          className="p-5 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9a9c9e]">
            <span>Availability Matrix</span>
            <CalendarClock className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-sm font-bold text-white mt-2">
            Weekly Heatmap
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Review player free hours
          </div>
        </div>
      </div>

      {/* TODAY'S SCRIM STATUS (If announced) */}
      {todayScrim && (
        <div className="p-6 rounded-3xl bg-[#1c1d1e] border border-red-500/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2e3032]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase text-red-400">TODAY'S SCRIM ACTIVE</span>
              <span className="text-sm font-bold text-white">vs {todayScrim.opponent}</span>
            </div>
            <div className="text-xs font-mono text-zinc-300">
              {formatScrimTime(todayScrim).localTime12h} ({formatScrimTime(todayScrim).deviceTz}) • {todayScrim.format}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#9a9c9e]">
              Roster Attendance: <span className="text-emerald-400 font-bold">{todayScrim.freeCount || 0} Free</span> • <span className="text-rose-400 font-bold">{todayScrim.notFreeCount || 0} Busy</span> • <span className="text-zinc-500">{todayScrim.pendingCount || 0} Pending</span>
            </div>

            <button
              onClick={() => setCurrentTab('scrims')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              View Full Scrim Roster →
            </button>
          </div>
        </div>
      )}

      {/* Roster Setup Callout if no players created yet */}
      {activePlayers.length === 0 && (
        <div className="p-8 rounded-3xl bg-[#1c1d1e] border border-dashed border-[#2e3032] text-center">
          <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No Players Registered Yet</h3>
          <p className="text-xs text-[#9a9c9e] max-w-md mx-auto mt-1">
            As the admin, you can create dedicated login IDs and passwords for each of your players and hand them out.
          </p>
          <button
            onClick={onOpenNewPlayer}
            className="mt-4 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            + Create First Player Login ID
          </button>
        </div>
      )}
    </div>
  );
}
