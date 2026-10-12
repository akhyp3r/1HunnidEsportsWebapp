import React, { useState } from 'react';
import { 
  AlertCircle, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Layers, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TodayScrimAlert({ scrim, onRsvp }) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!scrim) return null;

  const myRsvp = scrim.rsvps?.find(r => r.userId === user?.id);
  const myStatus = myRsvp?.status; // 'free' | 'not_free' | undefined

  const handleRsvpClick = async (status) => {
    try {
      setSubmitting(true);
      await onRsvp(scrim.id, status, customNote);
      setCustomNote('');
      setShowNoteInput(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyDiscordFormat = () => {
    const text = `📢 **APEX ESPORTS - TODAY'S SCRIM ALERT** 📢
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **Opponent:** ${scrim.opponent}
⏰ **Scrim Time:** ${scrim.time} (${scrim.timezone})
🏆 **Format:** ${scrim.format}
🗺️ **Maps:** ${scrim.maps?.join(', ')}
📍 **Server:** ${scrim.serverRegion}
📝 **Coach Notes:** ${scrim.notes || 'Be on Discord 15m early'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ **Ready Players (${scrim.freeCount || 0}):** ${
      scrim.rsvps
        ?.filter(r => r.status === 'free')
        .map(r => r.playerIgn)
        .join(', ') || 'None yet'
    }
❌ **Unavailable:** ${
      scrim.rsvps
        ?.filter(r => r.status === 'not_free')
        .map(r => `${r.playerIgn} (${r.note || 'Busy'})`)
        .join(', ') || 'None'
    }
👉 *Please mark your availability in the Hub!*`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const freePlayers = scrim.rsvps?.filter(r => r.status === 'free') || [];
  const notFreePlayers = scrim.rsvps?.filter(r => r.status === 'not_free') || [];

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#1e1f20] via-[#221c1f] to-[#1e1f20] border-2 border-red-500/50 p-6 md:p-7 shadow-gemini-glow mb-8 overflow-hidden">
      {/* Background ambient red glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header alert badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#333538]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-red-400">
                MANDATORY TEAM SCHEDULE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300">
                TODAY'S SCRIM
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-0.5">
              Scrim vs {scrim.opponent}
            </h3>
          </div>
        </div>

        {/* Discord Copy Button */}
        <button
          onClick={copyDiscordFormat}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-xs font-medium text-[#c4c7c5] hover:text-white border border-[#333538] transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Scrim Ping!' : 'Copy Discord Ping'}</span>
        </button>
      </div>

      {/* Scrim Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3 rounded-2xl bg-[#131314]/80 border border-[#333538]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#8e918f] mb-1">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span>Time</span>
          </div>
          <div className="text-base font-bold text-white font-mono">{scrim.time}</div>
          <div className="text-[11px] text-[#8e918f]">{scrim.timezone}</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#131314]/80 border border-[#333538]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#8e918f] mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Format</span>
          </div>
          <div className="text-base font-bold text-white">{scrim.format}</div>
          <div className="text-[11px] text-[#8e918f]">Competitive Rule</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#131314]/80 border border-[#333538]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#8e918f] mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Maps</span>
          </div>
          <div className="text-sm font-bold text-white truncate">
            {scrim.maps?.join(', ') || 'TBD'}
          </div>
          <div className="text-[11px] text-[#8e918f]">Map Pool</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#131314]/80 border border-[#333538]/70">
          <div className="flex items-center gap-1.5 text-xs text-[#8e918f] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Server / Region</span>
          </div>
          <div className="text-sm font-bold text-white truncate">
            {scrim.serverRegion || 'Tournament Client'}
          </div>
          <div className="text-[11px] text-[#8e918f]">Custom Lobby</div>
        </div>
      </div>

      {scrim.notes && (
        <div className="mb-5 p-3 rounded-2xl bg-[#131314]/50 border border-[#333538]/50 text-xs text-[#c4c7c5]">
          <span className="font-semibold text-white mr-1.5">Coach Briefing:</span>
          {scrim.notes}
        </div>
      )}

      {/* RSVP ACTION BAR */}
      <div className="p-4 rounded-2xl bg-[#131314] border border-[#333538] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Prompt */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1">
            <div className="text-xs text-[#8e918f]">Your Attendance Status:</div>
            <div className="flex items-center gap-2 mt-0.5">
              {myStatus === 'free' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marked: FREE TO PLAY
                </span>
              ) : myStatus === 'not_free' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/40">
                  <XCircle className="w-3.5 h-3.5" />
                  Marked: NOT FREE (Cannot Play)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40 animate-pulse">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Pending Response — Please Mark Below
                </span>
              )}

              {myRsvp?.note && (
                <span className="text-xs text-zinc-400 italic">
                  ("{myRsvp.note}")
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => handleRsvpClick('free')}
            disabled={submitting}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm ${
              myStatus === 'free'
                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>I'm Free (Can Play)</span>
          </button>

          <button
            onClick={() => {
              if (!showNoteInput && myStatus !== 'not_free') {
                setShowNoteInput(true);
              } else {
                handleRsvpClick('not_free');
              }
            }}
            disabled={submitting}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm ${
              myStatus === 'not_free'
                ? 'bg-rose-500 text-white shadow-rose-500/20'
                : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/50'
            }`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Not Free (Cannot Play)</span>
          </button>

          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="text-xs text-[#8e918f] hover:text-white px-2 py-1 underline transition-colors"
          >
            {showNoteInput ? 'Cancel Note' : 'Add Note'}
          </button>
        </div>
      </div>

      {/* Optional Note input dropdown */}
      {showNoteInput && (
        <div className="mt-3 p-3 rounded-2xl bg-[#131314] border border-[#333538] flex items-center gap-2 animate-fadeIn">
          <input
            type="text"
            placeholder="Add brief reason (e.g. 'Exam until 20:30' or 'Arriving 10m early')"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="flex-1 bg-[#1e1f20] border border-[#333538] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => handleRsvpClick('not_free')}
            disabled={submitting}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            Submit Not Free
          </button>
          <button
            onClick={() => handleRsvpClick('free')}
            disabled={submitting}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-black font-bold text-xs hover:bg-emerald-500 transition-colors"
          >
            Submit Free
          </button>
        </div>
      )}

      {/* ROSTER READINESS LIVE TALLY */}
      <div className="mt-5 pt-4 border-t border-[#333538]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-xs">
            <span className="text-[#8e918f]">Readiness: </span>
            <span className="font-bold text-emerald-400">{freePlayers.length} Ready</span>
            <span className="text-[#8e918f]"> / </span>
            <span className="font-bold text-rose-400">{notFreePlayers.length} Unavailable</span>
          </div>
        </div>

        {/* Players Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {freePlayers.map(p => (
            <span 
              key={p.userId} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs"
              title={p.note || 'Ready to play'}
            >
              <img 
                src={p.playerAvatar || '/assets/logo.png'} 
                alt={p.playerIgn} 
                className="w-3.5 h-3.5 rounded-full object-cover" 
              />
              <span className="font-semibold">{p.playerIgn}</span>
              <Check className="w-3 h-3 text-emerald-400" />
            </span>
          ))}

          {notFreePlayers.map(p => (
            <span 
              key={p.userId} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs"
              title={p.note || 'Cannot play'}
            >
              <img 
                src={p.playerAvatar || '/assets/logo.png'} 
                alt={p.playerIgn} 
                className="w-3.5 h-3.5 rounded-full object-cover" 
              />
              <span className="font-semibold">{p.playerIgn}</span>
              <X className="w-3 h-3 text-rose-400" />
              {p.note && <span className="text-[10px] text-zinc-400">({p.note})</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
