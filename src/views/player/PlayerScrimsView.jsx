import React, { useState } from 'react';
import { 
  Swords, 
  Clock, 
  Calendar, 
  Layers, 
  MapPin, 
  Check, 
  X, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatScrimTime } from '../../utils/time';

export default function PlayerScrimsView({ scrims, onRsvp }) {
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [customNote, setCustomNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const todayScrim = scrims.find(s => s.isToday && s.status === 'upcoming');
  const upcomingScrims = scrims.filter(s => s.status === 'upcoming');

  const myRsvp = todayScrim?.rsvps?.find(r => r.userId === user?.id);
  const myStatus = myRsvp?.status;

  const handleRsvpClick = async (scrimId, status) => {
    try {
      setSubmitting(true);
      await onRsvp(scrimId, status, customNote);
      setCustomNote('');
      setShowNoteInput(false);
    } finally {
      setSubmitting(false);
    }
  };

  const copyDiscordFormat = (scrim) => {
    const t = formatScrimTime(scrim);
    const text = `📢 **ONE HUNNID ESPORTS - SCRIM ALERT** 📢
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Opponent: ${scrim.opponent}
⏰ Time: ${t.localTime12h} (${t.deviceTz})${t.hasDiff ? ` [Scheduled: ${t.originalTime12h} ${t.originalTz}]` : ''}
🏆 Format: ${scrim.format}
🗺️ Maps: ${scrim.maps?.join(', ') || 'TBD'}
📍 Server: ${scrim.serverRegion}
📝 Notes: ${scrim.notes || 'Be on voice 15 mins prior.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ready (${scrim.freeCount || 0}): ${scrim.rsvps?.filter(r => r.status === 'free').map(r => r.playerIgn).join(', ') || 'None yet'}
❌ Unavailable: ${scrim.rsvps?.filter(r => r.status === 'not_free').map(r => `${r.playerIgn} (${r.note || 'Busy'})`).join(', ') || 'None'}
👉 *RSVP on the One Hunnid Portal!*`;

    navigator.clipboard.writeText(text);
    setCopiedId(scrim.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Player Match Schedule
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
          Scrim Attendance & Match Roster
        </h2>
        <p className="text-xs text-[#9a9c9e] mt-0.5">
          Confirm if you can play in today's and upcoming practice sessions.
        </p>
      </div>

      {/* TODAY'S SCRIM SECTION */}
      {todayScrim ? (
        <div className="p-6 rounded-3xl bg-[#1c1d1e] border border-red-500/40 shadow-sm relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#2e3032]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  MATCH TODAY
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  vs {todayScrim.opponent}
                </h3>
              </div>
            </div>

            <button
              onClick={() => copyDiscordFormat(todayScrim)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#262729] hover:bg-[#313235] text-xs text-zinc-300 hover:text-white border border-[#2e3032] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedId === todayScrim.id ? 'Copied Ping!' : 'Copy Discord Ping'}</span>
            </button>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {(() => {
              const t = formatScrimTime(todayScrim);
              return (
                <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                  <div className="text-[11px] text-[#9a9c9e] flex items-center gap-1 mb-0.5">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span>Scrim Time (12h)</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono">{t.localTime12h}</div>
                  <div className="text-[10px] text-zinc-400 truncate" title={`${t.deviceTz} device time`}>
                    {t.deviceTz}
                    {t.hasDiff && <span className="text-zinc-500 ml-1">({t.originalTime12h} {t.originalTz})</span>}
                  </div>
                </div>
              );
            })()}

            <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
              <div className="text-[11px] text-[#9a9c9e] flex items-center gap-1 mb-0.5">
                <Layers className="w-3 h-3 text-zinc-400" />
                <span>Format</span>
              </div>
              <div className="text-sm font-bold text-white">{todayScrim.format}</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
              <div className="text-[11px] text-[#9a9c9e] flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-zinc-400" />
                <span>Maps</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {todayScrim.maps?.join(', ') || 'TBD'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
              <div className="text-[11px] text-[#9a9c9e] flex items-center gap-1 mb-0.5">
                <span>Server</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {todayScrim.serverRegion}
              </div>
            </div>
          </div>

          {todayScrim.notes && (
            <div className="text-xs text-[#c4c7c5] p-3 rounded-2xl bg-[#131314] border border-[#262729] mb-4">
              <span className="font-semibold text-white mr-1">Coach Briefing:</span>
              {todayScrim.notes}
            </div>
          )}

          {/* RSVP Button Bar */}
          <div className="p-4 rounded-2xl bg-[#131314] border border-[#2e3032] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#9a9c9e]">Your Attendance Status: </span>
              {myStatus === 'free' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 ml-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marked: FREE TO PLAY
                </span>
              ) : myStatus === 'not_free' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 ml-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Marked: CANNOT PLAY (Busy)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 ml-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Response Needed — Please Mark Below
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => handleRsvpClick(todayScrim.id, 'free')}
                disabled={submitting}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  myStatus === 'free'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-[#262729] hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>I'm Free (Can Play)</span>
              </button>

              <button
                onClick={() => {
                  if (!showNoteInput && myStatus !== 'not_free') {
                    setShowNoteInput(true);
                  } else {
                    handleRsvpClick(todayScrim.id, 'not_free');
                  }
                }}
                disabled={submitting}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  myStatus === 'not_free'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-[#262729] hover:bg-rose-950/40 text-rose-400 border border-rose-500/30'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Cannot Play</span>
              </button>

              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                {showNoteInput ? 'Cancel' : 'Add Note'}
              </button>
            </div>
          </div>

          {showNoteInput && (
            <div className="mt-2.5 p-3 rounded-2xl bg-[#131314] border border-[#2e3032] flex items-center gap-2">
              <input
                type="text"
                placeholder="Optional reason (e.g. 'Class ends at 20:15')"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="flex-1 bg-[#1c1d1e] border border-[#2e3032] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/60"
              />
              <button
                onClick={() => handleRsvpClick(todayScrim.id, 'not_free')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Submit Not Free
              </button>
              <button
                onClick={() => handleRsvpClick(todayScrim.id, 'free')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Submit Free
              </button>
            </div>
          )}

          {/* Live Roster Count */}
          <div className="mt-4 pt-3 border-t border-[#2e3032] flex items-center justify-between text-xs">
            <div className="text-zinc-400">
              Squad Readiness: <span className="text-emerald-400 font-bold">{todayScrim.freeCount || 0} Free</span> • <span className="text-rose-400 font-bold">{todayScrim.notFreeCount || 0} Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              {todayScrim.rsvps?.map(r => (
                <span
                  key={r.userId}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    r.status === 'free'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                  }`}
                  title={r.note || r.status}
                >
                  {r.playerIgn}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-[#1c1d1e] border border-[#2e3032] text-center">
          <Swords className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No Scrim Scheduled for Today</h4>
          <p className="text-xs text-zinc-500 mt-1">
            Coach has not scheduled a match for today. Check the upcoming schedule below.
          </p>
        </div>
      )}

      {/* UPCOMING SCRIMS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Upcoming Scrim Calendar
        </h3>

        {upcomingScrims.filter(s => !s.isToday).length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] text-center text-xs text-zinc-500">
            No further upcoming scrims on the calendar.
          </div>
        ) : (
          upcomingScrims.filter(s => !s.isToday).map(scrim => {
            const rsvp = scrim.rsvps?.find(r => r.userId === user?.id);
            const status = rsvp?.status;

            return (
              <div
                key={scrim.id}
                className="p-5 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">vs {scrim.opponent}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#262729] text-zinc-400 font-mono">
                      {scrim.format}
                    </span>
                  </div>
                  <div className="text-xs text-[#9a9c9e] mt-1 flex items-center gap-3">
                    {(() => {
                      const t = formatScrimTime(scrim);
                      return (
                        <span className="font-mono text-zinc-300">
                          {t.localDate} @ {t.localTime12h} ({t.deviceTz})
                        </span>
                      );
                    })()}
                    <span>Maps: {scrim.maps?.join(', ') || 'TBD'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onRsvp(scrim.id, 'free', '')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      status === 'free'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#262729] hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    I'm Free
                  </button>

                  <button
                    onClick={() => onRsvp(scrim.id, 'not_free', '')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      status === 'not_free'
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#262729] hover:bg-rose-950/40 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Not Free
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
