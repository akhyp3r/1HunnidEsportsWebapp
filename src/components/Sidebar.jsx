import React from 'react';
import { 
  LayoutDashboard, 
  Swords, 
  CalendarClock, 
  Users, 
  Trophy, 
  BookOpen, 
  Menu, 
  Plus, 
  Sparkles, 
  LogOut, 
  ShieldAlert, 
  UserCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  collapsed, 
  setCollapsed, 
  onOpenNewScrim,
  onOpenNewPlayer,
  onOpenProfile
}) {
  const { user, logout, isManager } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'scrims', label: 'Scrims & RSVP', icon: Swords, badge: 'Live' },
    { id: 'availability', label: 'Weekly Free Times', icon: CalendarClock },
    { id: 'roster', label: isManager ? 'Roster & Credentials' : 'Team Roster', icon: Users },
    { id: 'matches', label: 'Match Records & VODs', icon: Trophy },
    { id: 'playbook', label: 'Strats & Playbook', icon: BookOpen }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen z-40 bg-[#1e1f20] border-r border-[#333538] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Section */}
      <div className="p-4 flex flex-col">
        {/* Header / Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2.5 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {!collapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
              />
              <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-white via-zinc-200 to-red-400 bg-clip-text text-transparent">
                APEX OPS
              </span>
            </div>
          )}
        </div>

        {/* Gemini-style "+ New Scrim / Action" pill */}
        {isManager ? (
          <div className="mb-6 space-y-2">
            <button
              onClick={onOpenNewScrim}
              className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-white border border-[#333538] hover:border-red-500/40 shadow-sm transition-all group ${
                collapsed ? 'px-0' : ''
              }`}
              title="Announce New Scrim"
            >
              <Plus className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-200" />
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">
                  Announce Scrim
                </span>
              )}
            </button>

            {!collapsed && (
              <button
                onClick={onOpenNewPlayer}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-transparent hover:bg-[#282a2c] text-xs text-[#c4c7c5] hover:text-white border border-dashed border-[#333538] transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>+ Create Player Login</span>
              </button>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={() => setCurrentTab('availability')}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-white border border-[#333538] hover:border-red-500/30 transition-all ${
                collapsed ? 'px-0' : ''
              }`}
              title="Submit Free Times"
            >
              <CalendarClock className="w-5 h-5 text-red-400" />
              {!collapsed && (
                <span className="text-sm font-medium">Update Free Times</span>
              )}
            </button>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#282a2c] text-white font-semibold shadow-inner'
                    : 'text-[#c4c7c5] hover:bg-[#282a2c]/60 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-red-400' : 'text-[#8e918f]'}`} />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Pill */}
      <div className="p-3 border-t border-[#333538]/70">
        <div 
          onClick={onOpenProfile}
          className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-[#282a2c] cursor-pointer transition-colors group ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Edit Profile & PFP"
        >
          <div className="relative">
            <img 
              src={user?.avatar || '/assets/logo.png'} 
              alt={user?.ign} 
              className="w-10 h-10 rounded-full object-cover border border-[#44474a] group-hover:border-red-400 transition-colors"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1e1f20] rounded-full"></span>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white truncate">
                  {user?.ign || user?.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  isManager ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-[#8e918f] truncate">
                {user?.gameRole || user?.username}
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mt-2 flex items-center justify-between px-2 pt-2 border-t border-[#333538]/40 text-xs text-[#8e918f]">
            <button 
              onClick={onOpenProfile}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <UserCircle className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={logout}
              className="hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
