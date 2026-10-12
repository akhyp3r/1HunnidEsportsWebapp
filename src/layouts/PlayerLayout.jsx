import React, { useState } from 'react';
import { Swords, CalendarClock, User, Megaphone, LogOut, Sparkles, Globe, Layers, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PlayerScrimsView from '../views/player/PlayerScrimsView';
import PlayerAvailabilityView from '../views/player/PlayerAvailabilityView';
import PlayerProfileView from '../views/player/PlayerProfileView';
import PlayerNoticesView from '../views/player/PlayerNoticesView';
import GanksterScrimsView from '../views/GanksterScrimsView';
import ValoplantView from '../views/ValoplantView';
import StrategiesView from '../views/StrategiesView';

export default function PlayerLayout({
  scrims,
  availabilityData,
  announcements,
  onRsvp,
  onUpdateAvailability
}) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('scrims');

  const todayScrim = scrims.find(s => s.isToday && s.status === 'upcoming');

  const navItems = [
    { id: 'scrims', label: 'Scrims & Attendance', icon: Swords, badge: todayScrim ? 'Match Today' : null },
    { id: 'valoplant', label: 'Valoplant Board', icon: Layers },
    { id: 'strategies', label: 'Strategies', icon: MapPin },
    { id: 'gankster', label: 'Gankster Scrims', icon: Globe },
    { id: 'availability', label: 'My Free Times', icon: CalendarClock },
    { id: 'profile', label: 'My Profile & PFP', icon: User },
    { id: 'notices', label: 'Team Notices', icon: Megaphone }
  ];

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex flex-col">
      {/* Sleek Top Navigation Bar for Players */}
      <header className="sticky top-0 z-40 bg-[#171819]/90 backdrop-blur-md border-b border-[#2e3032] px-5 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/assets/logo.png" 
              alt="One Hunnid Esports" 
              className="w-7 h-7 object-contain" 
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-white">
                ONE HUNNID ESPORTS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#202123] text-zinc-400 border border-[#2e3032]">
                Player Portal
              </span>
            </div>
          </div>

          {/* Player Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#262729] text-white border border-[#3e4043]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#202123]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#1c1d1e] hover:bg-[#262729] border border-[#2e3032] text-xs transition-colors"
              title="Edit Profile"
            >
              <img
                src={user?.avatar || '/assets/logo.png'}
                alt={user?.ign}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-semibold text-white truncate max-w-[100px]">
                {user?.ign || user?.name}
              </span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-[#202123] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pt-2.5 mt-2 border-t border-[#262729]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center py-1 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area for Players */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-5 md:p-8">
        {activeTab === 'scrims' && (
          <PlayerScrimsView
            scrims={scrims}
            onRsvp={onRsvp}
          />
        )}

        {activeTab === 'valoplant' && (
          <ValoplantView
            onNavigateToStrategies={() => setActiveTab('strategies')}
          />
        )}

        {activeTab === 'strategies' && (
          <StrategiesView
            onNavigateToValoplant={() => setActiveTab('valoplant')}
          />
        )}

        {activeTab === 'gankster' && (
          <GanksterScrimsView />
        )}

        {activeTab === 'availability' && (
          <PlayerAvailabilityView
            availabilityData={availabilityData}
            onUpdateAvailability={onUpdateAvailability}
          />
        )}

        {activeTab === 'profile' && (
          <PlayerProfileView />
        )}

        {activeTab === 'notices' && (
          <PlayerNoticesView
            announcements={announcements}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-[#202123] text-center text-[11px] text-zinc-600">
        One Hunnid Esports • Player Hub
      </footer>
    </div>
  );
}
