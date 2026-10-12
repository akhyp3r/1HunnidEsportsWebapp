import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Swords, 
  CalendarClock, 
  Megaphone, 
  Menu, 
  Plus, 
  LogOut, 
  UserCircle,
  Volume2,
  VolumeX,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminDashboardView from '../views/admin/AdminDashboardView';
import AdminRosterView from '../views/admin/AdminRosterView';
import AdminScrimsView from '../views/admin/AdminScrimsView';
import AdminAvailabilityView from '../views/admin/AdminAvailabilityView';
import AdminAnnouncementsView from '../views/admin/AdminAnnouncementsView';
import GanksterScrimsView from '../views/GanksterScrimsView';
import ValoplantView from '../views/ValoplantView';
import StrategiesView from '../views/StrategiesView';
import ProfileModal from '../views/ProfileModal';
import { formatScrimTime } from '../utils/time';
import { Layers, MapPin } from 'lucide-react';

export default function AdminLayout({
  scrims,
  players,
  availabilityData,
  announcements,
  onCreateScrim,
  onDeleteScrim,
  onCreatePlayer,
  onDeletePlayer,
  onCreateAnnouncement,
  onDeleteAnnouncement,
  soundEnabled,
  setSoundEnabled
}) {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals
  const [isNewScrimModalOpen, setIsNewScrimModalOpen] = useState(false);
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const todayScrim = scrims.find(s => s.isToday && s.status === 'upcoming');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roster', label: 'Roster & Credentials', icon: Users, badge: players.filter(p => p.role === 'player').length },
    { id: 'scrims', label: 'Scrim Schedules', icon: Swords, badge: todayScrim ? 'Today' : null },
    { id: 'valoplant', label: 'Valoplant Board', icon: Layers },
    { id: 'strategies', label: 'Strategies', icon: MapPin },
    { id: 'gankster', label: 'Gankster Scrims', icon: Globe },
    { id: 'availability', label: 'Squad Availability', icon: CalendarClock },
    { id: 'announcements', label: 'Bulletins & Notices', icon: Megaphone }
  ];

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex">
      {/* Admin Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen z-40 bg-[#171819] border-r border-[#262729] transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 flex flex-col">
          {/* Header Toggle */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-full hover:bg-[#202123] text-zinc-400 hover:text-white transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <img 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  className="w-6 h-6 object-contain" 
                />
                <span className="font-bold tracking-wider text-xs text-white">
                  ONE HUNNID
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  ADMIN
                </span>
              </div>
            )}
          </div>

          {/* Quick Create Button */}
          <div className="mb-4">
            <button
              onClick={() => setIsNewScrimModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all ${
                sidebarCollapsed ? 'px-0' : ''
              }`}
              title="Announce Scrim"
            >
              <Plus className="w-4 h-4" />
              {!sidebarCollapsed && <span>Announce Scrim</span>}
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#262729] text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#202123]'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge !== null && item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#202123] text-zinc-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="p-3 border-t border-[#262729]">
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#202123] cursor-pointer transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Edit Admin Profile"
          >
            <img 
              src={user?.avatar || '/assets/logo.png'} 
              alt={user?.ign} 
              className="w-8 h-8 rounded-full object-cover border border-[#3e4043]" 
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user?.ign || user?.name}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                  Team Director
                </div>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="mt-2 pt-2 border-t border-[#202123] flex items-center justify-between px-1 text-[11px] text-zinc-500">
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="hover:text-white flex items-center gap-1"
              >
                <UserCircle className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              <button 
                onClick={logout}
                className="hover:text-red-400 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Admin Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-[#131314]/90 backdrop-blur-md border-b border-[#262729] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wider text-white">
              ONE HUNNID ESPORTS
            </span>
            <span className="text-[10px] text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">
              Admin Control Center
            </span>

            {todayScrim && (
              <div className="hidden sm:flex items-center gap-2 ml-3 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Match Today @ {formatScrimTime(todayScrim).localTime12h} ({formatScrimTime(todayScrim).deviceTz}) vs {todayScrim.opponent}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full hover:bg-[#202123] text-zinc-400 hover:text-white transition-colors"
              title={soundEnabled ? "Audio chime on" : "Audio chime muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsNewPlayerModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202123] hover:bg-[#262729] text-xs font-semibold text-zinc-300 border border-[#2e3032] transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ New Player</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <AdminDashboardView
              scrims={scrims}
              players={players}
              announcements={announcements}
              onOpenNewScrim={() => setIsNewScrimModalOpen(true)}
              onOpenNewPlayer={() => setIsNewPlayerModalOpen(true)}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'roster' && (
            <AdminRosterView
              players={players}
              onCreatePlayer={onCreatePlayer}
              onDeletePlayer={onDeletePlayer}
              isModalOpen={isNewPlayerModalOpen}
              setIsModalOpen={setIsNewPlayerModalOpen}
            />
          )}

          {currentTab === 'scrims' && (
            <AdminScrimsView
              scrims={scrims}
              onCreateScrim={onCreateScrim}
              onDeleteScrim={onDeleteScrim}
              isModalOpen={isNewScrimModalOpen}
              setIsModalOpen={setIsNewScrimModalOpen}
            />
          )}

          {currentTab === 'valoplant' && (
            <ValoplantView
              onNavigateToStrategies={() => setCurrentTab('strategies')}
            />
          )}

          {currentTab === 'strategies' && (
            <StrategiesView
              onNavigateToValoplant={() => setCurrentTab('valoplant')}
            />
          )}

          {currentTab === 'gankster' && (
            <GanksterScrimsView />
          )}

          {currentTab === 'availability' && (
            <AdminAvailabilityView
              availabilityData={availabilityData}
            />
          )}

          {currentTab === 'announcements' && (
            <AdminAnnouncementsView
              announcements={announcements}
              onCreateAnnouncement={onCreateAnnouncement}
              onDeleteAnnouncement={onDeleteAnnouncement}
            />
          )}
        </main>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
