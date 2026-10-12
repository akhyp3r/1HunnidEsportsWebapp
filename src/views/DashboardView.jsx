import React from 'react';
import { 
  Swords, 
  CalendarClock, 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Megaphone, 
  Clock,
  Pin
} from 'lucide-react';
import BannerHero from '../components/BannerHero';
import TodayScrimAlert from '../components/TodayScrimAlert';
import { useAuth } from '../context/AuthContext';

export default function DashboardView({ 
  scrims, 
  players, 
  announcements, 
  onRsvp, 
  setCurrentTab,
  onOpenNewScrim,
  onOpenNewPlayer
}) {
  const { user, isManager } = useAuth();

  const todayScrim = scrims.find(s => s.isToday && s.status === 'upcoming');
  const upcomingScrims = scrims.filter(s => !s.isToday && s.status === 'upcoming').slice(0, 3);
  const activePlayers = players.filter(p => p.status === 'active' && p.role === 'player');

  const promptCards = [
    {
      title: "Announce Scrim Time",
      desc: "Post today's or weekend scrim schedule with maps & time slot",
      action: isManager ? onOpenNewScrim : () => setCurrentTab('scrims'),
      icon: Swords,
      color: "from-red-500/20 to-orange-500/10",
      accent: "text-red-400"
    },
    {
      title: "Submit Weekly Free Times",
      desc: "Pick your daily available hours using dropdown ranges",
      action: () => setCurrentTab('availability'),
      icon: CalendarClock,
      color: "from-blue-500/20 to-indigo-500/10",
      accent: "text-blue-400"
    },
    {
      title: isManager ? "Create Player Login IDs" : "View Team Roster",
      desc: isManager ? "Add new players & generate credentials to give them" : "Inspect active line-up & roles",
      action: isManager ? onOpenNewPlayer : () => setCurrentTab('roster'),
      icon: Users,
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400"
    },
    {
      title: "Match Records & VODs",
      desc: "Review scrim results, scores, coach notes and replay links",
      action: () => setCurrentTab('matches'),
      icon: Trophy,
      color: "from-purple-500/20 to-pink-500/10",
      accent: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Hero */}
      <BannerHero 
        activePlayersCount={activePlayers.length} 
        todayScrim={todayScrim} 
      />

      {/* Greeting / Gemini Style Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#8e918f] font-medium mb-1">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>Apex Esports Central Command</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-white via-zinc-200 to-red-400 bg-clip-text text-transparent">{user?.ign || user?.name}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8e918f]">Status:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Ready for Competition
          </span>
        </div>
      </div>

      {/* TODAY'S SCRIM ALERT NOTIFICATION (Prominent) */}
      {todayScrim ? (
        <TodayScrimAlert scrim={todayScrim} onRsvp={onRsvp} />
      ) : (
        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333538] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#282a2c] text-zinc-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">No Scrim Scheduled for Today Yet</h4>
              <p className="text-xs text-[#8e918f]">
                {isManager 
                  ? "Click 'Announce Scrim' to schedule today's practice session." 
                  : "Check back later or check upcoming scrim schedule."}
              </p>
            </div>
          </div>
          {isManager && (
            <button
              onClick={onOpenNewScrim}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              + Announce Scrim
            </button>
          )}
        </div>
      )}

      {/* Gemini-Style Quick Action Prompt Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e918f] mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promptCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className={`group p-5 rounded-3xl bg-[#1e1f20] border border-[#333538] hover:border-[#4f5256] hover:bg-[#252628] cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm relative overflow-hidden`}
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} border border-[#333538] flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.accent}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-[#8e918f] mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Upcoming Scrims & Team Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Scrims */}
        <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333538]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Upcoming Scrims
              </h3>
            </div>
            <button
              onClick={() => setCurrentTab('scrims')}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              View Full Schedule →
            </button>
          </div>

          {upcomingScrims.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8e918f]">
              No upcoming scrims on the calendar.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingScrims.map((scrim) => (
                <div
                  key={scrim.id}
                  className="p-4 rounded-2xl bg-[#131314] border border-[#333538]/70 hover:border-[#474a4d] transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">vs {scrim.opponent}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#282a2c] text-zinc-300">
                        {scrim.format}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8e918f]">
                      <span className="flex items-center gap-1 font-mono text-zinc-300">
                        <Clock className="w-3 h-3 text-red-400" />
                        {scrim.date} @ {scrim.time}
                      </span>
                      <span>Maps: {scrim.maps?.join(', ') || 'TBD'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400">
                      {scrim.freeCount || 0} Ready
                    </div>
                    <button
                      onClick={() => setCurrentTab('scrims')}
                      className="text-[11px] text-zinc-400 hover:text-white underline mt-1"
                    >
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Announcements */}
        <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333538]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Team Announcements
              </h3>
            </div>
            <span className="text-xs text-[#8e918f]">Official Notices</span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ann.pinned 
                    ? 'bg-red-950/20 border-red-500/30' 
                    : 'bg-[#131314] border-[#333538]/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {ann.pinned && <Pin className="w-3 h-3 text-red-400 fill-red-400" />}
                    <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                  </div>
                  <span className="text-[10px] text-[#8e918f]">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#c4c7c5] leading-relaxed">
                  {ann.content}
                </p>
                <div className="mt-2 text-[10px] text-[#8e918f]">
                  Posted by <span className="text-zinc-300 font-semibold">{ann.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
