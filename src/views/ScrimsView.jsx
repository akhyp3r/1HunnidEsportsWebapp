import React, { useState } from 'react';
import { 
  Swords, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Layers, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ScrimsView({ 
  scrims, 
  onRsvp, 
  onCreateScrim, 
  onDeleteScrim, 
  isModalOpen, 
  setIsModalOpen 
}) {
  const { user, isManager } = useAuth();
  const [filter, setFilter] = useState('upcoming'); // 'all' | 'upcoming' | 'today'
  const [copiedId, setCopiedId] = useState(null);
  const [rsvpNotes, setRsvpNotes] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    endTime: '22:30',
    timezone: 'GMT+7',
    format: 'Best of 3 (Bo3)',
    maps: ['Ascent', 'Haven'],
    serverRegion: 'Singapore Central - 128 Tick',
    notes: ''
  });

  const availableMaps = ['Ascent', 'Haven', 'Bind', 'Sunset', 'Lotus', 'Split', 'Abyss', 'Mirage', 'Inferno'];

  const toggleMap = (mapName) => {
    setFormData(prev => ({
      ...prev,
      maps: prev.maps.includes(mapName)
        ? prev.maps.filter(m => m !== mapName)
        : [...prev.maps, mapName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.opponent || !formData.date || !formData.time) return;
    await onCreateScrim(formData);
    setIsModalOpen(false);
    setFormData({
      opponent: '',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      endTime: '22:30',
      timezone: 'GMT+7',
      format: 'Best of 3 (Bo3)',
      maps: ['Ascent', 'Haven'],
      serverRegion: 'Singapore Central - 128 Tick',
      notes: ''
    });
  };

  const copyDiscordFormat = (scrim) => {
    const text = `📢 **APEX ESPORTS - SCRIM ANNOUNCEMENT**
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **Opponent:** ${scrim.opponent}
⏰ **Date & Time:** ${scrim.date} @ ${scrim.time} (${scrim.timezone})
🏆 **Format:** ${scrim.format}
🗺️ **Maps:** ${scrim.maps?.join(', ') || 'TBD'}
📍 **Server:** ${scrim.serverRegion}
📝 **Briefing:** ${scrim.notes || 'Be in team voice channel 15 mins prior.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ **Free / Ready:** ${scrim.rsvps?.filter(r => r.status === 'free').map(r => r.playerIgn).join(', ') || 'None yet'}
❌ **Unavailable:** ${scrim.rsvps?.filter(r => r.status === 'not_free').map(r => `${r.playerIgn} (${r.note || 'Busy'})`).join(', ') || 'None'}
👉 *Confirm your slot on the Team Hub!*`;

    navigator.clipboard.writeText(text);
    setCopiedId(scrim.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredScrims = scrims.filter(s => {
    if (filter === 'today') return s.isToday;
    if (filter === 'upcoming') return s.status === 'upcoming';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
            <Swords className="w-4 h-4" />
            <span>Schedule & Attendance</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Scrim Schedules & Attendance RSVP
          </h2>
          <p className="text-xs text-[#8e918f] mt-0.5">
            Mark whether you are free or busy for each scheduled match.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isManager && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Announce New Scrim</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#333538] pb-3">
        {[
          { id: 'upcoming', label: 'Upcoming Scrims' },
          { id: 'today', label: "Today's Scrim" },
          { id: 'all', label: 'All Scrims' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === tab.id
                ? 'bg-[#282a2c] text-white font-semibold border border-[#44474a]'
                : 'text-[#8e918f] hover:text-white hover:bg-[#1e1f20]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrims Cards List */}
      <div className="space-y-5">
        {filteredScrims.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1e1f20] border border-[#333538]">
            <Swords className="w-8 h-8 text-[#8e918f] mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white">No Scrims Found</h4>
            <p className="text-xs text-[#8e918f] mt-1">
              There are no scheduled matches in this category.
            </p>
          </div>
        ) : (
          filteredScrims.map(scrim => {
            const myRsvp = scrim.rsvps?.find(r => r.userId === user?.id);
            const myStatus = myRsvp?.status;
            const freePlayers = scrim.rsvps?.filter(r => r.status === 'free') || [];
            const notFreePlayers = scrim.rsvps?.filter(r => r.status === 'not_free') || [];

            return (
              <div
                key={scrim.id}
                className={`p-6 rounded-3xl bg-[#1e1f20] border transition-all ${
                  scrim.isToday
                    ? 'border-red-500/50 shadow-gemini-glow'
                    : 'border-[#333538] hover:border-[#474a4d]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#333538]/70">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#282a2c] text-red-400">
                      <Swords className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {scrim.isToday && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                            TODAY'S SCRIM
                          </span>
                        )}
                        <span className="text-xs font-semibold text-[#8e918f]">
                          {scrim.format}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        vs {scrim.opponent}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyDiscordFormat(scrim)}
                      className="p-2 rounded-full hover:bg-[#282a2c] text-[#8e918f] hover:text-white border border-[#333538] transition-colors"
                      title="Copy Discord Announcement"
                    >
                      {copiedId === scrim.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {isManager && (
                      <button
                        onClick={() => onDeleteScrim(scrim.id)}
                        className="p-2 rounded-full hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 border border-[#333538] transition-colors"
                        title="Delete Scrim"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="p-3 rounded-2xl bg-[#131314] border border-[#333538]/60">
                    <div className="text-[11px] text-[#8e918f] flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Date</span>
                    </div>
                    <div className="text-xs font-bold text-white">{scrim.date}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131314] border border-[#333538]/60">
                    <div className="text-[11px] text-[#8e918f] flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span>Scrim Time</span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono">{scrim.time} <span className="text-[10px] text-zinc-400">({scrim.timezone})</span></div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131314] border border-[#333538]/60">
                    <div className="text-[11px] text-[#8e918f] flex items-center gap-1.5 mb-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Maps</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {scrim.maps?.join(', ') || 'TBD'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131314] border border-[#333538]/60">
                    <div className="text-[11px] text-[#8e918f] flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Server</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {scrim.serverRegion}
                    </div>
                  </div>
                </div>

                {scrim.notes && (
                  <p className="text-xs text-[#c4c7c5] bg-[#131314]/50 p-3 rounded-2xl border border-[#333538]/50 mb-4">
                    <span className="font-semibold text-white mr-1">Notes:</span> {scrim.notes}
                  </p>
                )}

                {/* RSVP CONTROLS ROW */}
                <div className="p-4 rounded-2xl bg-[#131314] border border-[#333538] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#8e918f]">Your Status: </span>
                    {myStatus === 'free' ? (
                      <span className="text-xs font-bold text-emerald-400 ml-1">
                        ✓ Marked Free (Ready to play)
                      </span>
                    ) : myStatus === 'not_free' ? (
                      <span className="text-xs font-bold text-rose-400 ml-1">
                        ✕ Marked Not Free (Cannot play)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 ml-1">
                        Action Needed: Click Free or Not Free
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => onRsvp(scrim.id, 'free', rsvpNotes[scrim.id] || '')}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        myStatus === 'free'
                          ? 'bg-emerald-500 text-black shadow-sm font-bold'
                          : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>I'm Free</span>
                    </button>

                    <button
                      onClick={() => onRsvp(scrim.id, 'not_free', rsvpNotes[scrim.id] || '')}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        myStatus === 'not_free'
                          ? 'bg-rose-500 text-white shadow-sm font-bold'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-500/40 hover:bg-rose-900/50'
                      }`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Not Free</span>
                    </button>
                  </div>
                </div>

                {/* RSVP Attendance Headcount breakdown */}
                <div className="mt-4 pt-3 border-t border-[#333538]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8e918f]">Confirmed Roster:</span>
                    <span className="font-bold text-emerald-400">{freePlayers.length} Ready</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-bold text-rose-400">{notFreePlayers.length} Unavailable</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {freePlayers.map(p => (
                      <span key={p.userId} className="px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        {p.playerIgn}
                      </span>
                    ))}
                    {notFreePlayers.map(p => (
                      <span key={p.userId} className="px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-500/30 text-[11px] flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400" />
                        {p.playerIgn} {p.note ? `(${p.note})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ANNOUNCE SCRIM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#333538]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Announce Scrim Schedule</h3>
                  <p className="text-xs text-[#8e918f]">Schedule practice match and notify active roster</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#282a2c] text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Opponent Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Vanguard, Team Liquid Academy"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Scrim Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Scrim Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Match Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Best of 1 (Bo1)">Best of 1 (Bo1)</option>
                    <option value="Best of 2 (Bo2)">Best of 2 (Bo2)</option>
                    <option value="Best of 3 (Bo3)">Best of 3 (Bo3)</option>
                    <option value="Best of 5 (Bo5)">Best of 5 (Bo5)</option>
                    <option value="Custom Scrim Sets">Custom Scrim Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Server / Lobby Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Singapore 1, Tokyo, Frankfurt"
                    value={formData.serverRegion}
                    onChange={(e) => setFormData({ ...formData, serverRegion: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Maps Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-2">
                  Select Maps
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMaps.map(mapName => {
                    const isSelected = formData.maps.includes(mapName);
                    return (
                      <button
                        type="button"
                        key={mapName}
                        onClick={() => toggleMap(mapName)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-[#131314] text-[#8e918f] border border-[#333538] hover:text-white'
                        }`}
                      >
                        {mapName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Coach Briefing / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes for the team (e.g. Discord lobby 15m early, focusing on Haven B-splits)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#333538]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-[#8e918f] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Broadcast Scrim Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
